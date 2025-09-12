'use client';

import Link from 'next/link';
import {Product} from "@/types/Product";
import ProductCardMaster from "@/components/masterdetail/ProductCardMaster";

type Props = {
    products: Product[];
}

export default function ProductMasterList({ products }: Props) {

    return (
        <div className="h-full overflow-y-auto px-1 pt-2">
            <ul className="flex flex-wrap gap-2.5">
                {products.map((it: Product) => {
                    return (
                        <li key={it.id}>
                            <Link
                                prefetch
                                href={`/`}
                                scroll={false}
                                className="block">
                                <ProductCardMaster product={it}/>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}