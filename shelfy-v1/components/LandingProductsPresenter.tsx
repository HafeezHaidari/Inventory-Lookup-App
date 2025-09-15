import ProductCard from "@/components/ProductCard";
import {Product} from "@/types/Product";
import Link from "next/link";

const getLandingPageProducts = async () => {
    const response = await fetch('http://localhost:8080/api/products/search', {next: { revalidate: 120 }});
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Fetch failed");
    }
    const products = Array.isArray(data) ? data : (data?.content ?? []);
    return products as any[]; // or your Product[] type
}


const LandingProductsPresenter = async () => {

    const products = await getLandingPageProducts();

    return (
        <section className="h-full min-h-0 overflow-y-auto"> {/* <- owns the scroll */}
            {/* use padding instead of margin to create space */}
            <div className="pt-8 px-4 pb-6">
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
                    {products.map((product: Product) => (
                        <li key={product.id}>
                            <Link href={{ pathname: '/search', query: { tab: 'recommended', selected: product.id, pin: '1' } }} prefetch>
                                <ProductCard product={product} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default LandingProductsPresenter;
