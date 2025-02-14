'use server';

import { auth } from "@/auth";
import { formatError } from "../utils";
import { insertReviewsSchema } from "../validators";
import { z } from 'zod';
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

//CREATE AND UPDATE REVIEWS
export async function createUpdateReview(data: z.infer<typeof insertReviewsSchema>) {
    try {
        const session = await auth();
        if (!session) throw new Error('user is not authenticated');
        //VALIDATE AND STORE REVIEW
        const review = insertReviewsSchema.parse({
            ...data,
            userId: session?.user?.id
        })
        //GET PRODUCT THAT IS BEING REVIEWD
        const product = await prisma.product.findFirst({
            where: { id: review.productId }
        })
        if (!product) throw new Error('product not found');

        //CHECK IF USER HAS ALREADY REVIEWD
        const reviewExist = await prisma.review.findFirst({
            where: { productId: review.productId, userId: review.userId }
        })

        await prisma.$transaction(async (tx) => {
            if (reviewExist) {
                //UPDATE REVIEW
                await tx.review.update({
                    where: { id: reviewExist.id },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating
                    }
                })
            } else {
                //CREATE REVIEW
                await tx.review.create({ data: review })
            }
            //GET AVG RATING
            const averageRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId }
            })
            //GET NUMBER OF REVIEWS
            const numReviews = await tx.review.count({
                where: { productId: review.productId }
            })
            //UPDATE THE RATING AND NUMREVIEWS IN PRODUCT TABLE
            await tx.product.update({
                where: { id: review.productId },
                data: {
                    rating: averageRating._avg.rating || 0,
                    numReviews
                }
            })
        })
        revalidatePath(`/product/${product.slug}`)
        return {
            success: true,
            message: 'Review updated successfully'
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

//GET ALL REVIEws FOR A PRODUCT
export async function getReviews({ productId }: { productId: string; }) {
    const data = await prisma.review.findMany({
        where: { productId: productId },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return {
        data
    }
}
//GET A REVIEW WRITTEN BY CURRENT USER
export async function getReviewByProductId({ productId }: { productId: string; }) {
    const session = await auth();
    if (!session) throw new Error('user is not authenticated');
    return await prisma.review.findFirst({
        where: {
            productId,
            userId: session.user.id
        }
    })
}