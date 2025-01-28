import { insertProductSchema } from '@/lib/validators';
import { z } from 'zod';


//IMPORT ALL FIELDS FROM VALIDATORS
export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}