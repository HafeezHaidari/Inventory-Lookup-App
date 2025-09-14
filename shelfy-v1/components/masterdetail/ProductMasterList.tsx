'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from "@/types/Product";
import ProductCardMaster from "@/components/masterdetail/ProductCardMaster";

type Props = { products: Product[]; selectedId?: number; extraQuery?: Record<string, string | string[] | undefined>; };

export default function ProductMasterList({ products, selectedId, extraQuery }: Props) {
    const sp = useSearchParams();
    const tab = sp.get('tab') ?? undefined;
    const query = sp.get('query') ?? undefined;

    return (
        <div className="h-full overflow-y-auto px-1 pt-2">
            <ul className="space-y-2"> {/* single column */}
                {products.length > 0 ? products.map((it) => {
                    const isActive = selectedId != null && Number(it.id) === selectedId;
                    // Merge current filters into the link
                    const query: Record<string, any> = { ...(extraQuery || {}), selected: it.id };
                    // remove undefined entries
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
                }) : <li className="p-4 text-gray-500">No products found{query ? ` for "${query}"` : ""}.</li>}
            </ul>
        </div>
    );
}