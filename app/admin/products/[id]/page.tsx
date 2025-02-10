import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/actions/products.actions";
import { Metadata } from "next"
import { notFound } from "next/navigation";

export const metadata:Metadata = {
    title:'Update Product'
}
const AdminProductUpdatePage = async (props:{
    params: Promise<{id:string}>
})=>{
    const {id} = await props.params;
    const product = await getProductById(id);
    if(!product) return notFound();


    return(
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">Update Product</h1>
            <ProductForm type="Update" productId={product.id} product={product} />
        </div>
    )
}

export default AdminProductUpdatePage