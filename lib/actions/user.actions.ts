/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { auth, signIn, signOut } from "@/auth"
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema, updateUserSchema } from "../validators"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { prisma } from "@/db/prisma"
import { formatError } from "../utils"
import { ShippingAddress } from "@/types"
import { z } from 'zod';
import { hash } from '../encrypt';
import { PAGE_SIZE } from "../constants"
import { revalidatePath } from "next/cache"


//SIGN IN USER WITH CREDENTIALS
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        })
        await signIn('credentials', user);
        return { success: true, message: 'signed in successfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            success: false, message: 'invalid email or password'
        }
    }
}

//SIGN USER OUT
export async function signOutUser() {
    await signOut();
}

//SIGN UP USER.
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        })
        const plainPassword = user.password;
        user.password = await hash(user.password);
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword

        })

        return {
            success: true,
            message: 'user registered successfully'
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            success: false, message: formatError(error)
        }
    }
}

//GET USER BY ID
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    if (!user) throw new Error('User Not Found');
    return user;
}

//UPDATE USER ADDRESS
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: {
                id: session?.user?.id
            }
        })
        if (!currentUser) throw new Error('user not found');
        const address = shippingAddressSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                address
            }
        })
        return {
            success: true,
            message: 'User updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE USER PAYMENT METHOD
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })
        if (!currentUser) throw new Error('User not Found');
        const paymentMethod = paymentMethodSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                paymentMethod: paymentMethod.type
            }
        })
        return {
            success: true,
            message: 'User updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE USER PROFILE
export async function updateUserProfile(user: { name: string; email: string; }) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        })
        if (!currentUser) throw new Error('user not found');
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { name: user.name }
        })

        return {
            success: true,
            message: 'user updated successfully'
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//GET ALL USERS
export async function getAllUsers({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
    const data = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
    })
    const dataCount = await prisma.user.count();
    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    }
}

//DELETE USER
export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: ({ id: id })
        })
        revalidatePath('/admin/users')
        return {
            success: true,
            message: 'User deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE USER
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                role: user.role
            }
        })
        revalidatePath('/admin/users');
        return {
            success: true,
            message: 'user updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}