/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="space-y-4">
            <Image
                className="min-h-[300px] object-cover object-center"
                width={1000}
                height={1000}
                src={images[current]}
                alt="product-image"
            />

            <div className="flex">
                {images.map((image, index) => {
                    return (
                        <div
                            className={cn(
                                "border mr-2 cursor-pointer hover:border-orange-600",
                                current === index && "border-orange-500"
                            )}
                            key={image}
                            onClick={() => setCurrent(index)}
                        >
                            <Image src={image} alt={image} width={100} height={100} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductImages;
