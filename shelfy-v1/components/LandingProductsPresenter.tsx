import ProductCard from "@/components/ProductCard";
import {Product} from "@/types/types";

const getLandingPageProducts = async () => {
    const response = await fetch('http://localhost:8080/api/products', {next: { revalidate: 120 }});
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Fetch failed");
    }
    return data;
}


const LandingProductsPresenter = async () => {

    const products = await getLandingPageProducts();

    return (
        <div className="flex justify-center mt-30">
            <ul className="flex flex-wrap gap-5">
                {products.map((product: Product, i: number) => (
                    <li key={i}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default LandingProductsPresenter;
