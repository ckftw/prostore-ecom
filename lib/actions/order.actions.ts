/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult, ShippingAddress } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from '@prisma/client';

//CREATE ORDER AND CREATE ORDER ITEMS
export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error("User is not authenticated");
        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error("User not found");
        const user = await getUserById(userId);
        if (!cart || cart.items.length === 0)
            return {
                success: false,
                message: "Your cart is empty",
                redirectTo: "/cart",
            };
        if (!user.address)
            return {
                success: false,
                message: "No shipping Address",
                redirectTo: "/shipping-address",
            };
        if (!user.paymentMethod)
            return {
                success: false,
                message: "No payment method",
                redirectTo: "/payment-method",
            };

        //CREATE ORDER OBJECT
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        //CREATE A TRANSACTION TO CREATE ORDER
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            //CREATE ORDER
            const insertedOrder = await tx.order.create({ data: order });
            //CREATE ORDER ITEM FROM CART ITEM.
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    },
                });
            }
            //CLEAR THE CART
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });
            return insertedOrder.id;
        });
        if (!insertedOrderId) throw new Error("Order not created");
        return {
            success: true,
            message: "Order Created",
            redirectTo: `/order/${insertedOrderId}`,
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error),
        };
    }
}

//GET ORDER BY ID
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderitems: true,
            user: {
                select: { name: true, email: true },
            },
        },
    });
    return convertToPlainObject(data);
}

//CREATE NEW PAYPAL ORDER
export async function createPaypalOrder(orderId: string) {
    try {
        //GET ORDER FROM DB
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (order) {
            //CREATE PAYPAL ORDER
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
            //UPDATE ORDER WITH PAYPAL ORDER ID
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: "",
                        status: "",
                        pricePaid: 0,
                    },
                },
            });
            return {
                success: true,
                message: "Item order created successfully",
                data: paypalOrder.id,
            };
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}

//APPROVE PAYPAL ORDER AND UPDATE ORDER TO PAID
export async function approvePaypalOrder(
    orderId: string,
    data: { orderID: string }
) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (!order) throw new Error("order not found");
        const captureData = await paypal.capturePayment(data.orderID);
        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentResult)?.id ||
            captureData.status !== "COMPLETED"
        ) {
            throw new Error('Error in Paypal Payment')
        }
        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
            }
        })
        revalidatePath(`/order/${orderId}`);
        return {
            success: true,
            message: 'Your order has been paid'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}

//UPDATE ORDER TO PAID
async function updateOrderToPaid({ orderId, paymentResult }: { orderId: string; paymentResult?: PaymentResult }) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true
        }
    })
    if (!order) throw new Error('Order not found');
    if (order.isPaid) throw new Error('Order is already paid');

    await prisma.$transaction(async (tx) => {
        //ITERATE OVER PRODUCTS AND UPDATE STOCK.
        for (const item of order.orderitems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } }
            })
        }
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult
            }
        })
    })
    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } }
        }
    })
    if (!updatedOrder) throw new Error('Order not found');
}

//GET USERS ORDERS
export async function getMyOrders({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
    const session = await auth();
    if (!session) throw new Error('user not found');
    const data = await prisma.order.findMany({
        where: { userId: session?.user?.id! },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,

    })
    const dataCount = await prisma.order.count({
        where: { userId: session?.user?.id! }
    })
    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    }
}

type SalesDataType = {
    month: string;
    totalSales: number;
}[];

//GET SALES DATA AND ORDER SUMMARY
export async function getOrderSummary() {
    //GET COUNT FOR EACH RESOURCE
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    //CALCULATE TOTAL SALES
    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true }
    })
    //GET MONTHL SALES
    const salesDataRaw = await prisma.$queryRaw<Array<{ month: string; totalSales: Prisma.Decimal }>>`
    SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order"
     GROUP BY to_char("createdAt", 'MM/YY')`;

    const salesData: SalesDataType = salesDataRaw.map((entry) => ({
        month: entry.month,
        totalSales: Number(entry.totalSales)
    }))

    //GET LATES SALES
    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } }
        },
        take: 6,
    });

    return {
        ordersCount, productsCount, usersCount, totalSales, latestSales, salesData
    }
}

//GET ALL ORDERS
export async function getAllOrders({ limit = PAGE_SIZE, page, query }: { limit?: number; page: number; query: string }) {
    const queryFilter: Prisma.OrderWhereInput = query && query !== 'all' ? {
        user: {
            name: {
                contains: query,
                mode: 'insensitive'
            } as Prisma.StringFilter
        }
    } : {}
    const data = await prisma.order.findMany({
        where: { ...queryFilter },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } }
    });
    const dataCount = await prisma.order.count();
    return {
        data, totalPage: Math.ceil(dataCount / limit)
    }
}

//DELETE AN ORDER
export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({ where: { id } });
        revalidatePath('/admin/orders');
        return {
            success: true,
            message: 'Order deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE COD ORDER TO PAID
export async function updateOrderToPaidCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId })
        revalidatePath(`/order/${orderId}`)
        return {
            success: true,
            message: 'Order marked as paid'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE COD ORDER TO DELIVERED
export async function deliveredOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        })
        if (!order) throw new Error('Order not found');
        if (!order.isPaid) throw new Error('Order is not paid');
        await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date()
            }
        })
        revalidatePath(`/order/${orderId}`)
        return {
            success: true,
            message: 'Order has been marked delivered'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}