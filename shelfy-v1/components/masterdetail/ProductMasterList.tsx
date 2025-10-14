'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from "@/types/Product";
import ProductCardMaster from "@/components/masterdetail/ProductCardMaster";

// Props for the ProductMasterList component
type Props = { products: Product[]; selectedId?: number; extraQuery?: Record<string, string | string[] | undefined>; };

// Master list component displaying a list of products with links to their details
export default function ProductMasterList({ products, selectedId, extraQuery }: Props) {

    // Get current search parameters to maintain query state
    const sp = useSearchParams();
    const query = sp.get('query') ?? undefined;

    return (
        <div className="h-full overflow-y-auto px-1 pt-2">
            <ul className="space-y-2">

                {/* Render each product as a list item with a link to its detail view */}
                {products.length > 0 ? products.map((it) => {
                    // Determine if the current product is the selected one
                    const isActive = selectedId != null && Number(it.id) === selectedId;
                    // Construct query parameters for the link, preserving any extra query parameters
                    const query: Record<string, any> = { ...(extraQuery || {}), selected: it.id };
                    // Preserve the search query if it exists
                    Object.keys(query).forEach(k => (query as any)[k] == null && delete (query as any)[k]);
                    return (
                        <li key={it.id}>
                            <Link
                                prefetch
                                href={{
                                    pathname: '/search', query
                                }}
                                scroll={false}
                                className={`block rounded-md ${isActive ? "ring-2 ring-emerald-500" : ""}`}
                            >
                                <ProductCardMaster product={it}/>
                            </Link>
                        </li>
                    );
                }) : <li className="p-4 text-gray-500">No products found{query ? ` for "${query}"` : "."}</li>}
            </ul>
        </div>
    );
}