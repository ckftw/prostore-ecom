/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { insertProductSchema, insertCartSchema, cartItemSchema, shippingAddressSchema, insertOrderSchema, insertOrderItemSchema, paymentResultSchema } from '@/lib/validators';
import { z } from 'zod';


//IMPORT ALL FIELDS FROM VALIDATORS
export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}


//NO NEED TO REPEAT CREATING TYPE, JUST USE IT FROM ZOD.
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: Boolean;
    paidAt: Date | null;
    isDelivered: Boolean;
    deliveredAt: Date | null;
    orderitems: OrderItem[];
    user: { name: string, email: string };

}
export type PaymentResult = z.infer<typeof paymentResultSchema>
