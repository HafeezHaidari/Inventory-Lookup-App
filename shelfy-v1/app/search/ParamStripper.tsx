'use client';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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