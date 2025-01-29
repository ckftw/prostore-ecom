/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { ToastAction } from "../ui/toast";
import { Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";

const AddToCart = ({ item, cart }: { item: CartItem, cart?: Cart }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);
            if (!res.success) {
                toast({
                    variant: "destructive",
                    description: res.message,
                });
                return;
            }
            toast({
                description: res.message,
                action: (
                    <ToastAction
                        altText="Go To Cart"
                        onClick={() => router.push('/cart')}
                        className="bg-primary text-white hover:bg-gray-800"
                    >
                        Go To Cart
                    </ToastAction>
                ),
            });
        })

    };

    //HANDLE REMOVE FROM CART
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeFromCart(item.productId)
            toast({
                variant: res.success ? 'default' : 'destructive',
                description: res.message
            })
            return;
        })
    }
    //CHECK IF ITEM IN CART
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);


    return existItem ? (
        <div>
            <Button type="button" variant={'outline'} onClick={handleRemoveFromCart}>
                {isPending ? (
                    <Loader className="w-4 animate-spin" />
                ) : (
                    <Minus className="h-4 w-4" />
                )}

            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button type="button" variant={'outline'} onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className="w-4 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
            </Button>
        </div>
    ) : (
        <Button onClick={handleAddToCart} className="w-full" type="button">
             {isPending ? (
                    <Loader className="w-4 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
            Add To Cart
        </Button>
    )
};

export default AddToCart;
