'use client';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Component that removes the 'pin' query parameter from the URL if it exists
// This is useful to clean up the URL after a pin action has been performed
// Currently not used, as it affects the pin state in the UI
// but could be reintroduced with a more sophisticated state management approach
export default function ParamStripper() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    useEffect(() => {
        if (sp.has('pin')) {
            const params = new URLSearchParams(sp.toString());
            params.delete('pin');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [sp, pathname, router]);

    return null;
}