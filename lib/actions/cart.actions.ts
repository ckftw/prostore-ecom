/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    )
    const shippingPrice = round2(
        itemsPrice > 100 ? 0 : 100
    )

    const taxPrice = round2(
        0.15 * itemsPrice
    )

    const totalPrice = round2(
        itemsPrice + taxPrice + shippingPrice
    )
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),

    }
}

export async function addItemToCart(data: CartItem) {
    try {
        //CHECK FOR CART COOKIE
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');
        const session = await auth();
        const userId = session?.user?.id ? session.user.id as string : undefined;
        const cart = await getMyCart();
        const item = cartItemSchema.parse(data);

        //FIND PRODUCT IN DATABASE
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        //CHECK IF PRODUCT EXIST IN DB OR NOT
        if (!product) throw new Error('Product not found');

        if (!cart) {
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item])
            })
            //ADD TO DATABASE
            await prisma.cart.create({
                data: newCart
            })

            //REVALIDATE PAGE
            revalidatePath(`/product/${product.slug}`)
            return {
                success: true,
                message: `${product.name} added to cart`
            }
        } else {
            //CHECK IF ITEM IS ALREADY IN CART
            const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId)
            if (existItem) {
                //CHECK THE STOCK
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Not enough stock')
                }
                //INCREASE THE QUANTITY
                (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1
            } else {
                //IF ITEM DOES NOT EXIST IN CART
                if (product.stock < 1) {
                    throw new Error('Not enough stock')
                }
                cart.items.push(item);
            }
            //SAVE TO DATABASE
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            });
            revalidatePath(`/product/${product.slug}`);
            return {
                success: true,
                message: `${product.name} ${existItem ? 'updated in' : 'added to'} Cart`
            }
        }


    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }

}

export async function getMyCart() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');
    const session = await auth();
    const userId = session?.user?.id ? session.user.id as string : undefined;

    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
    })

    if (!cart) {
        return undefined
    }
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}

export async function removeFromCart(productId: string) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        //CHECK IF PRODUCT EXIST
        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })
        if (!product) throw new Error("Product not found");

        const cart = await getMyCart();
        if (!cart) throw new Error('Cart not found');

        const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
        if (!exist) throw new Error('Item nto found');

        //CHECK IF ONLY ONE IN QTY
        if (exist.qty === 1) {
            //REMOVE FROM CART
            cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId)
        } else {
            (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
        }

        //UPDATE CART IN DATABASE
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])
            }
        })
        revalidatePath(`/product/${product.slug}`);
        return {
            success: true,
            message: `${product.name} was removed from the cart`
        }


    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}