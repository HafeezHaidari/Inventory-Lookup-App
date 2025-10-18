// app/search/layout.tsx
import React, { Suspense } from "react";
import FilterBar from "@/components/masterdetail/FilterBar";

// Layout for the search page, includes the FilterBar at the top
export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* FilterBar lives directly under the SearchBar */}
            <div className="px-4 py-2">
                <div className="sticky top-0 z-10 bg-white border-b px-4 py-2">
                    {/* Wrap client component in Suspense to avoid useSearchParams SSR bailout */}
                    <Suspense fallback={<div className="h-10" aria-hidden /> }>
                        <FilterBar />
                    </Suspense>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    );
}
