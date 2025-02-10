/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { approvePaypalOrder, createPaypalOrder, deliveredOrder, updateOrderToPaidCOD } from "@/lib/actions/order.actions";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

const OrderDetailsTable = ({ order, paypalClientId, isAdmin }: { order: Order, paypalClientId: string, isAdmin: boolean }) => {
    const { toast } = useToast();
    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt
    } = order;

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();
        let status = ''
        if (isPending) {
            status = 'Loading PayPal...'
        } else if (isRejected) {
            status = 'Error Loading PayPal'
        }
        return status;
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPaypalOrder(order.id);
        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message
            })
        }
        return res.data;
    }

    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePaypalOrder(order.id, data);
        toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message
        })
    }

    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
            <Button type="button" disabled={isPending} onClick={() => startTransition(async () => {
                const res = await updateOrderToPaidCOD(order.id);
                toast({
                    variant: res.success ? 'default' : 'destructive',
                    description: res.message
                })
            })}>
                {isPending ? 'Processing...' : 'Mark as Paid'}
            </Button>
        )
    }

    const MarkAsDeliveredButton = ()=>{
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
            <Button type="button" disabled={isPending} onClick={() => startTransition(async () => {
                const res = await deliveredOrder(order.id);
                toast({
                    variant: res.success ? 'default' : 'destructive',
                    description: res.message
                })
            })}>
                {isPending ? 'Processing...' : 'Mark as Delivered'}
            </Button>
        )
    }

    return (
        <div>
            <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p className="mb-2">{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant={'secondary'}>Paid at {formatDateTime(paidAt!).dateTime}</Badge>
                            ) : (
                                <Badge variant={'destructive'}>
                                    Not Paid
                                </Badge>
                            )}

                        </CardContent>
                    </Card>
                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">{shippingAddress.streetAddress}, {shippingAddress.city}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant={'secondary'}>Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
                            ) : (
                                <Badge variant={'destructive'}>
                                    Not Delivered
                                </Badge>
                            )}

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderitems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{item.qty}</span>
                                            </TableCell>
                                            <TableCell className="">
                                                ${item.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>

                            {/* PAYPAL PAYMENT */}
                            {!isPaid && paymentMethod === 'Paypal' && (
                                <div>
                                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                        <PrintLoadingState />
                                        <PayPalButtons onApprove={handleApprovePayPalOrder} createOrder={handleCreatePayPalOrder} />
                                    </PayPalScriptProvider>
                                </div>
                            )}

                            {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                                <MarkAsPaidButton />
                            )}

                            {isAdmin && isPaid && !isDelivered && (
                                <MarkAsDeliveredButton />
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsTable;