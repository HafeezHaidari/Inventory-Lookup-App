// app/search/layout.tsx
import React from "react";
import FilterBar from "@/components/masterdetail/FilterBar";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* FilterBar lives directly under the global SearchBar */}
            <div className="px-4 py-2">
                <div className="sticky top-0 z-10 bg-white border-b px-4 py-2">
                    <FilterBar />
                </div>
            </div>
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    );
}
