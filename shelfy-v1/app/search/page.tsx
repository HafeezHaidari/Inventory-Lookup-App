import ProductMasterList from "@/components/masterdetail/ProductMasterList";

const fetchProducts = async (q?: string) => {
    if (q === null){
        const response = await fetch(`http://localhost:8080/api/products`);
        const products = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch products.");
        }
        return products;
    } else {
        const response = await fetch(`http://localhost:8080/api/products/search?name=${q}`);
        const products = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch products.");
        }
        return products;
    }
}

export default async function Page({ searchParams }: { searchParams: { tab?: string, selected?: number, query?: string } }) {

    const products = (searchParams.query !== undefined) ? await fetchProducts(searchParams.query) : await fetchProducts();
    return (
        <div className="h-full flex min-h-0">
            <section className="w-1/4 h-full min-h-0">
                <ProductMasterList products={products} />
            </section>

            <section className="flex-1 h-full min-h-0 overflow-hidden">
                {/* ... */}
            </section>
        </div>
    )
}
