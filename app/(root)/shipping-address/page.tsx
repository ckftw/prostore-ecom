/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingForm from "./shipping-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";

export const metadata: Metadata={
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if(!cart || cart.items.length===0) redirect('/cart');
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) throw new Error('No user Id');
    const user = await getUserById(userId);
    return (
        <div>
            <CheckoutSteps current={1} />
            <ShippingForm address={user.address as ShippingAddress} />
        </div>
    );
}
 
export default ShippingAddressPage;