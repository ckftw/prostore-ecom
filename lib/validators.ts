import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
    .string()
    .refine((val) =>
        /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val)))
    );

//SCHEMA FOR INSERTING PRODUCTS
export const insertProductSchema = z.object({
    name: z.string().min(3, " Name must be atleast 3 characters"),
    slug: z.string().min(3, " Slug must be atleast 3 characters"),
    category: z.string().min(3, " Category must be atleast 3 characters"),
    brand: z.string().min(3, " Brand must be atleast 3 characters"),
    description: z.string().min(3, "Description must be atleast 3 characters"),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, "Product must have atleast 1 image"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});

//SCHEMA FOR SIGN IN USERS
export const signInFormSchema = z.object({
    email: z.string().email('Invalid Email Address'),
    password: z.string().min(6, 'Password must be atleast 6 characters')
})

//SCHEMA FOR SIGN UP USERS
export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.string().email('Invalid Email Address'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be atleast 6 characters'),

}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword']
})

//CART SCHEMAS
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency
})

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable()
})