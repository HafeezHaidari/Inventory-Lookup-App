'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function NotFound() {
    return (
        <Suspense fallback={null}>
            <NotFoundContent />
        </Suspense>
    );
}

function NotFoundContent() {
    const search = useSearchParams(); // safe now
    return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p>Sorry, we can’t find that page.</p>
        </main>
    );
}
