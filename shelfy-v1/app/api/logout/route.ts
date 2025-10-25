import { NextRequest, NextResponse } from 'next/server';
import { getApiBase, runtime } from '../_utils/base';
import { getSetCookies, rehostSetCookieForFrontend } from '../_utils/cookies';

export { runtime };

export async function POST(req: NextRequest) {
    const base = getApiBase();
    const spring = await fetch(`${base}/auth/logout`, {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') ?? '' },
        cache: 'no-store',
    });

    const out = new NextResponse(null, { status: spring.status });
    // Spring sends Max-Age=0 cookies — re-emit for frontend too
    getSetCookies(spring).forEach((c) => out.headers.append('set-cookie', rehostSetCookieForFrontend(c)));
    return out;
}
