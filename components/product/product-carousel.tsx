'use client'

import { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import AutoPlay from 'embla-carousel-autoplay';
import Link from "next/link";
import Image from "next/image";

const ProductCarousel = ({ data }: { data: Product[] }) => {
    return (
        <div className="w-full overflow-hidden"> {/* Prevents horizontal scrolling */}
            <Carousel 
                className="w-full mb-12" 
                opts={{ loop: true }}
                plugins={[
                    AutoPlay({
                        delay: 10000,
                        stopOnInteraction: true,
                        stopOnMouseEnter: true
                    })
                ]} 
            >
                <CarouselContent className="flex"> {/* Ensures proper flex behavior */}
                    {data.map((product: Product) => (
                        <CarouselItem key={product.id} className="w-full flex-shrink-0">
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative mx-auto w-full">
                                    <Image 
                                        className="w-full h-auto object-cover" 
                                        sizes="100vw" 
                                        width={1200} 
                                        height={600} 
                                        src={product.banner!} 
                                        alt="banner" 
                                    />
                                    <div className="absolute inset-0 flex items-end justify-center">
                                        <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                                            {product.name}
                                        </h2>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default ProductCarousel;
