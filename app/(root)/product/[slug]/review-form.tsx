/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createUpdateReview, getReviewByProductId } from "@/lib/actions/review.actions";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewsSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof insertReviewsSchema>>({
        resolver: zodResolver(insertReviewsSchema),
        defaultValues: reviewFormDefaultValues,
    }); 

    //GET AND SET REVIEWS WHEN FORM IS OPENED.
    const handleOpenForm = async() => {
        form.setValue('productId', productId)
        form.setValue('userId', userId)
        const review = await getReviewByProductId({productId})
        if(review){
            form.setValue('title',review.title);
            form.setValue('description',review.description);
            form.setValue('rating',review.rating);

        }
        setOpen(true);
    };
    const onSubmit: SubmitHandler<z.infer<typeof insertReviewsSchema>> = async (values) => {
        const res = await createUpdateReview({ ...values, productId });
        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message
            })
        }
        setOpen(false);
        console.log('reviewsubmitted')
        onReviewSubmitted();
        toast({
            description: res.message
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant={"default"}>
                Write a Review
            </Button>

            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts with other customers
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter title" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter description" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={(index + 1).toString()}
                                                    >
                                                        {index + 1} <StarIcon className="inline h-4 w-4" />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button disabled={form.formState.isSubmitting} type="submit" size='lg' className="w-full">
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
export default ReviewForm;
