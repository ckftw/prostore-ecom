import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: 'Order Details'
}
const OrderDetailsPage = async(props:{
    params: Promise<{
        id:string
    }>
}) => {
    const {id} = await props.params;
    const order = await getOrderById(id);
    if(!order) notFound();
    console.log('id',id);
    const session = await auth();
    return (
        <div>
           <OrderDetailsTable isAdmin={session?.user?.role=='admin'||false} paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} order={{
            ...order,
            shippingAddress: order.shippingAddress as ShippingAddress
           }} />
        </div>
    );
}
 
export default OrderDetailsPage;