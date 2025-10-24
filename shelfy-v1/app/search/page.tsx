import ProductMasterList from "@/components/masterdetail/ProductMasterList";
import ProductDetailPane from "@/components/masterdetail/ProductDetailPane";
import { Filters } from "@/types/Filters";
import {Suspense} from "react";
import {getApiBase} from "@/app/lib/base";


// Parse filters from search params.
// The filters are optional and can include
// brand (string or array of strings), priceMin (number), priceMax (number), and sort (string).
const parseFilters = (sp: { [k: string]: string | string[] | undefined }): Filters => {

    // Normalize brand to an array if it's a single string
    const brandParam = sp.brand;
    const brand = Array.isArray(brandParam) ? brandParam : brandParam ? [brandParam] : undefined;
    // Convert priceMin and priceMax to numbers if they exist
    const priceMin = sp.priceMin ? Number(sp.priceMin) : undefined;
    const priceMax = sp.priceMax ? Number(sp.priceMax) : undefined;
    // Normalize sort to a single string if it's an array
    const sortParam = sp.sort;
    const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
    // Return the parsed filters
    return { brand, priceMin, priceMax, sort };
};

// Fetch products from the API based on query, tab, and filters
const fetchProducts = async (query?: string, tab?: string, filters?: Filters) => {
    // Build query parameters
    const params = new URLSearchParams();

    // Add query and tab parameters if they exist
    if (query) params.set("name", query);
    if (tab === "recommended") params.set("recommended", "true");

    // Add filter parameters if they exist
    if (filters?.priceMin != null) params.set("priceMin", String(filters.priceMin));
    if (filters?.priceMax != null) params.set("priceMax", String(filters.priceMax));
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.brand?.length) for (const b of filters.brand) params.append("brand", b);

    // Construct the full URL with query parameters
    const base = getApiBase();
    const baseSearch = `${base}/products/search`;
    const qs = params.toString();
    const url = qs ? `${baseSearch}?${qs}` : base;

    // Fetch products from the API with revalidation every second
    const res = await fetch(url, { next: { revalidate: 1 } });
    if (!res.ok) throw new Error("Fetch failed: " + res.statusText);
    const data = await res.json();

    // Handle different response formats (array or paginated content)
    const products = Array.isArray(data) ? data : (data?.content ?? []);
    // Return the products array
    return products as any[];
};

// Main page component for the search page
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
    // Await the search parameters
    const sp = await searchParams;

    // Destructure relevant parameters
    const { tab, query, selected, pin, priceMin, priceMax, sort, brand } = sp;
    // Convert selected to a number if it exists
    const selectedId = selected ? Number(selected) : undefined;

    // Parse filters from search parameters
    const filters = parseFilters({ brand, priceMin, priceMax, sort });

    // Fetch products based on query, tab, and filters from the API
    const products = await fetchProducts(query, tab, filters);

    // If pin is set and tab is "recommended", move the selected product to the top of the list
    const shouldPin = tab === "recommended" && pin === "1" && selectedId != null;
    if (shouldPin) {
        // Find the index of the selected product
        const idx = products.findIndex((p: any) => Number(p.id) === selectedId);
        // If found, move it to the front of the array
        if (idx > 0) {
            const [sel] = products.splice(idx, 1);
            products.unshift(sel);
        }
    }

    return (
        <div className="h-full flex min-h-0">
            <aside className="h-full min-h-0 border-r flex flex-col overflow-x-auto min-w-[350px] max-w-full" style={{ width: 370 }}>
                <div className="flex-1 min-h-0">
                    <Suspense fallback={null}>
                        {/* Master list of products with the ability to highlight the selected product */}
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
                    </Suspense>
                </div>
            </aside>

            <section className="flex-1 h-full min-h-0 overflow-y-auto">
                <Suspense fallback={null}>
                    {/* Detail pane showing details of the selected product */}
                    <ProductDetailPane selected={selectedId} />
                </Suspense>
            </section>

            {/* Bug in which the selected item does not get moved to the top of the list, currently commented out */}
            {/* {pin === "1" && <ParamStripper />} */}
        </div>
    );
}
