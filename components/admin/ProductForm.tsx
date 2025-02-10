/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from 'slugify';
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/products.actions";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({ type, product, productId }: { type: 'Create' | 'Update', product?: Product; productId?: string }) => {
    const router = useRouter()
    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type == 'Update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
        defaultValues: product && type == 'Update' ? product : productDefaultValues,
    })

    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
        if (type == 'Create') {
            const res = await createProduct(values);
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message
                })
            } else {
                toast({
                    description: res.message
                })
                router.push('/admin/products')
            }
        } else {
            if (!productId) {
                router.push('/admin/products');
                return;
            }
            const res = await updateProduct({ ...values, id: productId });
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message
                })
            } else {
                toast({
                    description: res.message
                })
                router.push('/admin/products')
            }
        }
    }
    const images = form.watch('images');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');
    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'> }) => <FormItem className="w-full">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Product Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />

                    <FormField
                        control={form.control}
                        name='slug'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'> }) => <FormItem className="w-full">
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Enter Slug" {...field} />
                                    <Button onClick={() => {
                                        form.setValue('slug', slugify(form.getValues('name'), {
                                            lower: true
                                        }))
                                    }} type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2">
                                        Generate</Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                </div>

                {/*CATEGORY AND BRAND */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name='category'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'> }) => <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Category" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />

                    <FormField
                        control={form.control}
                        name='brand'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'> }) => <FormItem className="w-full">
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Brand Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                </div>

                {/*PRICE AND STOCK */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'> }) => <FormItem className="w-full">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Price " {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />

                    <FormField
                        control={form.control}
                        name='stock'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'> }) => <FormItem className="w-full">
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Stock" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                </div>

                {/*IMAGES */}
                <div className="flex upload-field flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name='images'
                        render={() => <FormItem className="w-full">
                            <FormLabel>Images</FormLabel>
                            <Card>
                                <CardContent className="space-y-2 mt-2 min-h-48">
                                    <div className="flex-start space-x-2">
                                        {images.map((image: string) => (
                                            <Image
                                                className="w-20 h-20 object-cover object-center rounded-sm"
                                                key={image}
                                                height={100}
                                                width={100}
                                                alt='product'
                                                src={image} />
                                        ))}
                                        <FormControl>
                                            <UploadButton
                                                endpoint='imageUploader'
                                                onClientUploadComplete={(res: { url: string }[]) => {
                                                    form.setValue('images', [...images, res[0].url])
                                                }}
                                                onUploadError={(error: Error) => {
                                                    toast({
                                                        variant: 'destructive',
                                                        description: error.message
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                </CardContent>
                            </Card>
                            <FormMessage />
                        </FormItem>}
                    />
                </div>

                {/*is featured */}
                <div className="upload-field">
                    Featured Product
                    <Card>
                        <CardContent className="space-y-2 mt-2">
                            <FormField
                                control={form.control}
                                name='isFeatured'
                                render={({ field }) => (<FormItem className="space-x-2 items-center">
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Is Featured?</FormLabel>
                                </FormItem>)}
                            />
                            {isFeatured && banner && (
                                <Image src={banner} alt="banner-image" width={1920} height={680}
                                    className="w-full rounded-sm object-cover object-center" />
                            )}
                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('banner',  res[0].url)
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                            variant: 'destructive',
                                            description: error.message
                                        })
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'> }) => <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none" placeholder="Enter Product Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                </div>
                <div>
                    <Button className="button col-span-2" size={'lg'} disabled={form.formState.isSubmitting} type="submit">
                        {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default ProductForm;