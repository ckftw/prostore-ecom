import { auth } from "@/auth"
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next"
import PaymentMethodForm from "./payment-form";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";

export const metadata: Metadata = {
    title: 'Select Payment Method'
}
const PaymentMethodPage = async ()=>{
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) throw new Error('User not Found');

    const user = await getUserById(userId);
    return(
        <div>
            <CheckoutSteps current={2}/>
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
        </div>
    )
}

export default PaymentMethodPage