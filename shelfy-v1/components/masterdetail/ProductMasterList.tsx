'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from "@/types/Product";
import ProductCardMaster from "@/components/masterdetail/ProductCardMaster";

type Props = { products: Product[]; selectedId?: number };

export default function ProductMasterList({ products, selectedId }: Props) {
    const sp = useSearchParams();
    const tab = sp.get('tab') ?? undefined;
    const query = sp.get('query') ?? undefined;

    return (
        <div className="h-full overflow-y-auto px-1 pt-2">
            <ul className="space-y-2"> {/* single column */}
                {products.map((it) => {
                    const isActive = selectedId != null && Number(it.id) === selectedId;
                    return (
                        <li key={it.id}>
                            <Link
                                prefetch
                                href={{
                                    pathname: '/search',
                                    query: { tab, query, selected: it.id },
                                }}
                                scroll={false}
                                className={`block rounded-md ${isActive ? "ring-2 ring-emerald-500" : ""}`}
                            >
                                <ProductCardMaster product={it}/>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}