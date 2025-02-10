import ProductForm from "@/components/admin/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata= {
    title:'Create Product'
}

const CreateProductPage = () => {
    return (
        <div>
            <h1 className="h2-bold">Create Product</h1>
            <div className="my-8">
                <ProductForm type="Create" />
            </div>
            Create Product Page
        </div>
    );
}
 
export default CreateProductPage;