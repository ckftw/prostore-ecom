'use client'

import { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import AutoPlay from 'embla-carousel-autoplay';
import Link from "next/link";
import Image from "next/image";

const ProductCarousel = ({ data }: { data: Product[] }) => {
    return (
        <div>
            <Carousel className="w-full mb-12" opts={{
                loop: true,
            }} plugins={[
                AutoPlay({
                    delay: 10000,
                    stopOnInteraction: true,
                    stopOnMouseEnter: true
                })
            ]} >
                <CarouselContent>
                    {data.map((product: Product) => (
                        <CarouselItem key={product.id}>
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative mx-auto">
                                    <Image className="w-full h-auto"
                                        sizes="100vw"
                                        height={0}
                                        width={0}
                                        src={product.banner!} alt="banner" />
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

export default ProductCarousel