import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

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

//SCHEMA FOR SHIPPING ADDRESS
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Street Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal Code must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional()
})

//SCHEMA FOR PAYMENT METHOD
export const paymentMethodSchema = z.object({
    type: z.string().min(1, ' Payment Method Is Required')
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid Payment Method'
})

//SCEMA FOR INSERT ORDER
export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'The user is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: 'invalid payment method'
    }),
    shippingAddress: shippingAddressSchema
})

export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number()
})

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
})

export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.string().min(3, 'Email must be atleast 3 characters'),
})

export const updateProductSchema = insertProductSchema.extend({
    id: z.string().min(1, 'Id is required'),

})


//SCHEMA TO UPDATE USERS
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'Id is required'),
    role: z.string().min(1, 'Role is required').nullable()
})