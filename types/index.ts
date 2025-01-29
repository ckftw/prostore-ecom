import { insertProductSchema, insertCartSchema, cartItemSchema } from '@/lib/validators';
import { z } from 'zod';


//IMPORT ALL FIELDS FROM VALIDATORS
export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;