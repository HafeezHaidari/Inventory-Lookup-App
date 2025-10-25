import { NextRequest, NextResponse } from 'next/server';
import { getApiBase, runtime } from '../_utils/base';
import { getSetCookies, rehostSetCookieForFrontend } from '../_utils/cookies';

export { runtime };

export async function GET(req: NextRequest) {
    const base = getApiBase();
    const cookieHeader = req.headers.get('cookie') ?? '';

    // 1) Try /auth/me with the cookies the browser sent to Next
    let me = await fetch(`${base}/auth/me`, {
        headers: { cookie: cookieHeader },
        cache: 'no-store',
    });

    // 2) If 401 → ask Spring to refresh by cookie (not body)
    if (me.status === 401) {
        const refresh = await fetch(`${base}/auth/refresh`, {
            method: 'POST',
            headers: { cookie: cookieHeader },
            cache: 'no-store',
        });

        // Re-emit any refreshed cookies
        const refreshOut = new Headers();
        getSetCookies(refresh).forEach((c) =>
            refreshOut.append('set-cookie', rehostSetCookieForFrontend(c))
        );

        if (!refresh.ok) {
            // clear frontend cookies if you like (optional)
            const res401 = NextResponse.json({ user: null }, { status: 401, headers: refreshOut });
            return res401;
        }

        // Retry /auth/me with same cookie header; Spring should accept the refreshed cookie values
        me = await fetch(`${base}/auth/me`, {
            headers: { cookie: cookieHeader },
            cache: 'no-store',
        });

        if (!me.ok) return NextResponse.json({ user: null }, { status: 401, headers: refreshOut });

        const user = await me.json();
        return NextResponse.json({ user }, { headers: refreshOut });
    }

    if (!me.ok) return NextResponse.json({ user: null }, { status: me.status });

    // Also forward any cookies set during /auth/me (rare but safe)
    const out = NextResponse.json({ user: await me.json() });
    getSetCookies(me).forEach((c) => out.headers.append('set-cookie', rehostSetCookieForFrontend(c)));
    return out;
}
