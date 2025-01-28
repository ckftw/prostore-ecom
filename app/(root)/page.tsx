import ProductList from "@/components/product/product-list";
import { getLatestProducts } from "@/lib/actions/products.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  console.log('sampleData', latestProducts)
  return <>
    <div>
      <ProductList limit={4} data={latestProducts} title="Newest Arrivals" />
    </div>
  </>;
};

export default Homepage;
