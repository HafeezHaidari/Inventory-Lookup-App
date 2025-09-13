import ProductMasterList from "@/components/masterdetail/ProductMasterList";
import ProductDetailPane from "@/components/masterdetail/ProductDetailPane";
import ParamStripper from "@/app/search/ParamStripper";

const fetchProducts = async (q?: string) => {
    if (!q){
        const res = await fetch(`http://localhost:8080/api/products/recommended`);
        const products = await res.json();
        if (!res.ok) throw new Error("Failed to fetch products.");
        return products;
    } else {
        const res = await fetch(`http://localhost:8080/api/products/search?name=${encodeURIComponent(q)}`);
        const products = await res.json();
        if (!res.ok) throw new Error("Failed to fetch products.");
        return products;
    }
};

export default async function Page({
                                       searchParams,
                                   }: { searchParams: { tab?: string; selected?: string; query?: string; pin?: string } }) {
    const selectedId = searchParams.selected ? Number(searchParams.selected) : undefined;
    const products = await fetchProducts(searchParams.query);

    const shouldPin =
        searchParams.tab === 'recommended' &&
        searchParams.pin === '1' &&
        selectedId != null;

    if (shouldPin) {
        const idx = products.findIndex((p: any) => Number(p.id) === selectedId);
        if (idx > 0) {
            const [sel] = products.splice(idx, 1);
            products.unshift(sel);
        }
    }

    return (
        <div className="h-full flex min-h-0">
            <section className="w-1/4 h-full min-h-0">
                <ProductMasterList products={products} selectedId={selectedId}/>
            </section>
            <section className="flex-1 h-full min-h-0 overflow-y-auto">
                <ProductDetailPane selected={selectedId} />
            </section>
            {searchParams.pin === '1' && <ParamStripper />}
        </div>
    );
}
