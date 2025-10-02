import ProductMasterList from "@/components/masterdetail/ProductMasterList";
import ProductDetailPane from "@/components/masterdetail/ProductDetailPane";
import ParamStripper from "@/app/search/ParamStripper";
import { Filters } from "@/types/Filters";

const parseFilters = (sp: { [k: string]: string | string[] | undefined }): Filters => {
    const brandParam = sp.brand;
    const brand = Array.isArray(brandParam) ? brandParam : brandParam ? [brandParam] : undefined;
    const priceMin = sp.priceMin ? Number(sp.priceMin) : undefined;
    const priceMax = sp.priceMax ? Number(sp.priceMax) : undefined;
    const sortParam = sp.sort;
    const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
    return { brand, priceMin, priceMax, sort };
};

const fetchProducts = async (query?: string, tab?: string, filters?: Filters) => {
    const params = new URLSearchParams();

    if (query) params.set("name", query);
    if (tab === "recommended") params.set("recommended", "true");

    if (filters?.priceMin != null) params.set("priceMin", String(filters.priceMin));
    if (filters?.priceMax != null) params.set("priceMax", String(filters.priceMax));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.brand?.length) for (const b of filters.brand) params.append("brand", b);

    const base = `${process.env.API_BASEURL}/products/search`;
    const qs = params.toString();
    const url = qs ? `${base}?${qs}` : base;

    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();

    const products = Array.isArray(data) ? data : (data?.content ?? []);
    return products as any[];
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{
        tab?: string;
        selected?: string;
        query?: string;
        pin?: string;
        brand?: string | string[];
        priceMin?: string;
        priceMax?: string;
        sort?: string;
    }>;
}) {
    // ✅ await ONCE
    const sp = await searchParams;

    const { tab, query, selected, pin, priceMin, priceMax, sort, brand } = sp;
    const selectedId = selected ? Number(selected) : undefined;

    const filters = parseFilters({ brand, priceMin, priceMax, sort });

    // use unified endpoint with tab + filters
    const products = await fetchProducts(query, tab, filters);

    // one-time pinning from landing
    const shouldPin = tab === "recommended" && pin === "1" && selectedId != null;
    if (shouldPin) {
        const idx = products.findIndex((p: any) => Number(p.id) === selectedId);
        if (idx > 0) {
            const [sel] = products.splice(idx, 1);
            products.unshift(sel);
        }
    }

    return (
        <div className="h-full flex min-h-0">
            <aside className="h-full min-h-0 border-r flex flex-col overflow-x-auto min-w-[350px] max-w-full" style={{ width: 370 }}>
                <div className="flex-1 min-h-0">
                    <ProductMasterList
                        products={products}
                        selectedId={selectedId}
                        extraQuery={{
                            tab,
                            query,
                            priceMin,
                            priceMax,
                            sort,
                            ...(filters.brand ? { brand: filters.brand } : {}),
                        }}
                    />
                </div>
            </aside>

            <section className="flex-1 h-full min-h-0 overflow-y-auto">
                <ProductDetailPane selected={selectedId} />
            </section>

            {pin === "1" && <ParamStripper />}
        </div>
    );
}
