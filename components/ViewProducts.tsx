import Link from "next/link";
import { Button } from "./ui/button";


const ViewProducts = ()=>{
    return(
        <div className="flex justify-center items-center my-8">
            <Button className="px-8 py-4 text-lg font-semibold" asChild>
                <Link href={'/search'}>View All Products</Link>
            </Button>
        </div>
    )
}

export default ViewProducts;