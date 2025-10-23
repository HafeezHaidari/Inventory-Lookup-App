'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTransition } from "react";
import {SORT_OPTIONS} from "@/types/SORT_OPTIONS";
import {getApiBase} from "@/app/lib/base";

// Props for the FilterBar component, including optional tab and query parameters
type Props = {tab?: string, query?: string};

// Component to display a filter bar with brand checkboxes, price range inputs, sort dropdown, and reset button
export default function FilterBar({ tab, query }: Props) {
    // State to manage the list of brands fetched from the API
    const [brands, setBrands] = useState<string[]>([]);
    const base = getApiBase();

    // Fetch the list of brands from the API when the component mounts
    useEffect(() => {
        fetch(`${base}/products/brands`)
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to fetch brands", err));

        // Cleanup function (not strictly necessary here)
        return () => {
        }
    }, []);

    // Hooks to manage routing and search parameters
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    // Transition state to manage pending updates. useTransition is used to avoid blocking the UI during state updates.
    const [isPending, startTransition] = useTransition();

    // Function to set or remove a query parameter and update the URL
    const setParam = (key: string, value?: string) => {
        const params = new URLSearchParams(sp.toString());
        if (value == null || value === '') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        // When filters change, remove the "pin" parameter to reset pinned state
        params.delete("pin");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Function to toggle a value in an array-type query parameter (e.g., brand)
    const toggleArrayParam = (key: string, value: string) => {
        // Get all current values for the key
        const params = new URLSearchParams(sp.toString());
        const all = params.getAll(key);
        // If the value is already present, remove it; otherwise, add it
        if (all.includes(value)) {
            const next = all.filter(it => it !== value);
            params.delete(key);
            next.forEach(v => params.append(key, v));
        } else {
            params.append(key, value);
        }
        // When filters change, remove the "pin" parameter to reset pinned state
        params.delete("pin");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Get current filter values from search parameters
    const brandsSelected = sp.getAll("brand");
    const priceMin = sp.get("priceMin") ?? "";
    const priceMax = sp.get("priceMax") ?? "";
    // Default sort: name-asc if not set
    const sort = sp.get("sort") ?? "name-asc";

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-wrap items-center gap-4 justify-center w-full max-w-4xl mx-auto"
        >
            {/* Brand filters */}
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
                value={sort}
                onChange={(e) => setParam("sort", e.target.value || undefined)}
                className="border rounded px-2 py-1 text-sm"
            >

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