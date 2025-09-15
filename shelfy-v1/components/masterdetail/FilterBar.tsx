'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTransition } from "react";
import {SORT_OPTIONS} from "@/types/SORT_OPTIONS";

type Props = {tab?: string, query?: string};

export default function FilterBar({ tab, query }: Props) {
    const [brands, setBrands] = useState<string[]>([]);
    useEffect(() => {
        fetch("http://localhost:8080/api/products/brands")
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to fetch brands", err));
        return () => {

        }
    }, []);

    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const setParam = (key: string, value?: string) => {
        const params = new URLSearchParams(sp.toString());
        if (value == null || value === '') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.delete("pin");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const toggleArrayParam = (key: string, value: string) => {
        const params = new URLSearchParams(sp.toString());
        const all = params.getAll(key);
        if (all.includes(value)) {
            const next = all.filter(it => it !== value);
            params.delete(key);
            next.forEach(v => params.append(key, v));
        } else {
            params.append(key, value);
        }
        params.delete("pin");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const brandsSelected = sp.getAll("brand");
    const priceMin = sp.get("priceMin") ?? "";
    const priceMax = sp.get("priceMax") ?? "";
    const sort = sp.get("sort") ?? "";

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-wrap items-center gap-4" // changed from space-y-3
        >
            {/* Example brand checkboxes */}
            <fieldset className="flex items-center gap-2">
                <legend className="sr-only">Brand</legend>
                {brands.map((b) => (
                    <label key={b} className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            checked={sp.getAll("brand").includes(b)}
                            onChange={() => startTransition(() => toggleArrayParam("brand", b))}
                        />
                        {b}
                    </label>
                ))}
            </fieldset>

            {/* Price range */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    placeholder="Min"
                    value={sp.get("priceMin") ?? ""}
                    onChange={(e) => startTransition(() => setParam("priceMin", e.target.value))}
                    className="w-20 border rounded px-2 py-1 text-sm"
                />
                <span className="text-xs text-gray-500">—</span>
                <input
                    type="number"
                    placeholder="Max"
                    value={sp.get("priceMax") ?? ""}
                    onChange={(e) => startTransition(() => setParam("priceMax", e.target.value))}
                    className="w-20 border rounded px-2 py-1 text-sm"
                />
            </div>

            {/* Sort */}
            <select
                value={sp.get("sort") ?? ""}
                onChange={(e) => setParam("sort", e.target.value || undefined)}
                className="border rounded px-2 py-1 text-sm"
            >
                <option value="">Sort: default</option>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Reset */}
            <button
                type="button"
                onClick={() => {
                    const params = new URLSearchParams();
                    if (tab) params.set("tab", tab);
                    if (query) params.set("query", query);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                }}
                className="text-xs text-gray-600 underline"
                disabled={isPending}
            >
                Reset
            </button>
        </form>
    );
}