import Image from "next/image";
import React from "react";

type Props = { selected?: number };

export default async function ProductDetailPane({ selected }: Props) {
    if (selected == null) {
        return (
            <div className="h-full grid place-items-center p-6 text-muted-foreground">
                Select a product from the list.
            </div>
        );
    }

    const res = await fetch(`http://localhost:8080/api/products/${selected}`, { cache: 'no-store' });
    if (!res.ok) {
        return (
            <div className="p-6 text-red-600">
                Failed to load product {selected}.
            </div>
        );
    }
    const p = await res.json();

    return (
        <div className="p-6 space-y-6">
            <div className="flex gap-6 items-start">
                <Image src={p.imageUrl} alt={p.name} width={240} height={240} className="rounded-xl border" />
                <div>
                    <h1 className="text-2xl font-semibold">{p.name}</h1>
                    <p className="text-gray-500">{p.brand}</p>
                    <p className="mt-3 text-xl font-medium">{p.defaultPrice} € / {p.unit}</p>
                </div>
            </div>

            {/* nutrition / origin / info as your schema allows */}
            {/* ... */}
        </div>
    );
}
