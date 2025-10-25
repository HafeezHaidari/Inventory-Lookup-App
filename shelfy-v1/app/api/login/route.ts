import { NextRequest, NextResponse } from 'next/server';
import { getApiBase, runtime } from '../_utils/base';
import { getSetCookies, rehostSetCookieForFrontend } from '../_utils/cookies';

export { runtime };

export async function POST(req: NextRequest) {
    const base = getApiBase();
    const body = await req.text(); // forward raw JSON body

    const spring = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            // forward browser cookies (if any)
            cookie: req.headers.get('cookie') ?? '',
        },
        body,
        cache: 'no-store',
    });

    const out = new NextResponse(null, { status: spring.status });

    // Re-emit cookies (access/refresh) for frontend origin
    getSetCookies(spring).forEach((c) => out.headers.append('set-cookie', rehostSetCookieForFrontend(c)));

    return out;
}
