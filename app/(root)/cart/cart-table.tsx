/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTransition } from "react";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.items.map((item) => {
                  return (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          className="flex items-center"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="flex-center gap-2">
                        <Button
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeFromCart(item.productId);
                              if (!res.success) {
                                toast({
                                  variant: "destructive",
                                  description: res.message,
                                });
                              }
                            })
                          }
                          variant="outline"
                          type="button"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);
                              if (!res.success) {
                                toast({
                                  variant: "destructive",
                                  description: res.message,
                                });
                              }
                            })
                          }
                          variant="outline"
                          type="button"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-right">
                        ${ item.price}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
                <div className="pb-3 text-xl">
                    Subtotal ({cart.items.reduce((acc,c)=>acc+c.qty,0)})
                    <span className="font-bold">
                        {formatCurrency(cart.itemsPrice)}
                    </span>
                </div>

                <Button onClick={()=>startTransition(async()=>{
                    router.push('/shipping-address')
                })} className="w-full" disabled={isPending}>
                    {isPending? (
                        <Loader className="w-4 h-4 animate-spin"/>
                    ) : (
                        <ArrowRight className="w-4 h-4" />
                    )} Proceed To Checkout
                </Button>
            </CardContent>
          </Card>


        </div>
      )}
    </div>
  );
};

export default CartTable;
