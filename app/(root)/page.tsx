import DealCountdown from "@/components/DealCountdown";
import IconBoxes from "@/components/IconBoxes";
import ProductCarousel from "@/components/product/product-carousel";
import ProductList from "@/components/product/product-list";
import ViewProducts from "@/components/ViewProducts";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/products.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  console.log('sampleData', latestProducts)
  return <>
    <div>
      {featuredProducts.length>0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList limit={6} data={latestProducts} title="Newest Arrivals" />
      <ViewProducts/>
      <DealCountdown/>
      <IconBoxes/>
    </div>
  </>;
};

export default Homepage;
