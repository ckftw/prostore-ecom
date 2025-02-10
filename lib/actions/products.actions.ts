/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from 'zod';

// GET LATEST PRODUCTS
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' }
    })
    return convertToPlainObject(data);
}

//GET SINGLE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug }
    })
}

//GET SINGLE PRODUCT BY PRODUCT ID
export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
        where: { id: productId }
    })
    return convertToPlainObject(data);
}

//GET ALL PRODUCTS
export async function getAllProducts({ query, limit = PAGE_SIZE, page, category }: {
    query: string; limit?: number; page: number; category?: string
}) {
    const data = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
    });
    const dataCount = await prisma.product.count();
    return {
        data, totalPages: Math.ceil(dataCount / limit)
    }
}

//DELETE A PRODUCT
export async function deleteProduct(id: string) {
    try {
        const productExist = await prisma.product.findFirst({
            where: { id: id }
        })
        if (!productExist) throw new Error('Product not found');
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products')
        return {
            success: true,
            message: 'Product deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//CREATE A PRODUCT
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data)
        await prisma.product.create({ data: product })
        revalidatePath('/admin/products')
        return {
            success: true,
            message: 'Product created successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//UPDATE A PRODUCT
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data)
        const productExist = await prisma.product.findFirst({
            where: { id: product.id }
        })
        if (!productExist) throw new Error('Product not found');
        await prisma.product.update({
            where: { id: product.id },
            data: product
        })
        revalidatePath('/admin/products')
        return {
            success: true,
            message: 'Product updated successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//GET ALL CATEGORIES
export async function getAllCategories() {
    const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    })
    return data;
}

//GET FEATURED PRODUCT
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4
    })
    return convertToPlainObject(data);
}