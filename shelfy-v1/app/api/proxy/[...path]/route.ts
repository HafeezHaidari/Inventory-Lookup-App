import { NextRequest, NextResponse } from 'next/server';
import {getApiBase} from "@/app/api/_utils/base";
export const runtime = 'nodejs';

function backendUrl(req: NextRequest) {
    const base = getApiBase();
    const suffix = req.nextUrl.pathname.replace(/^\/api\/proxy/, '');
    const qs = req.nextUrl.search; // includes leading "?" if any
    return `${base}${suffix}${qs}`;
}

async function forward(req: NextRequest, method: string) {
    const url = backendUrl(req);
    const body = ['GET','HEAD'].includes(method) ? undefined : await req.text();


    const springRes = await fetch(url, {
        method,
        // @ts-expect-error
        headers: {
            // forward only safe headers; most important is Cookie
            'content-type': req.headers.get('content-type') ?? undefined,
            'cookie': req.headers.get('cookie') ?? '',
        },
        body,
        cache: 'no-store',
    });

    const data = await springRes.arrayBuffer();
    const out = new NextResponse(data, { status: springRes.status });

    // pass through any Set-Cookie (refresh/login/logout cycles)
    // @ts-ignore node/undici specific
    const raw = springRes.headers.raw?.();
    const setCookies: string[] = raw?.['set-cookie'] ?? (springRes.headers.get('set-cookie') ? [springRes.headers.get('set-cookie') as string] : []);
    setCookies.forEach((c) => {
        // re-emit for frontend origin
        let sc = c.replace(/;\s*Domain=[^;]+/i, '')
            .replace(/;\s*SameSite=[^;]+/i, '');
        if (!/;\s*SameSite=/i.test(sc)) sc += '; SameSite=Lax';
        if (!/;\s*Secure/i.test(sc)) sc += '; Secure';
        if (!/;\s*HttpOnly/i.test(sc)) sc += '; HttpOnly';
        if (!/;\s*Path=/i.test(sc)) sc += '; Path=/';
        out.headers.append('set-cookie', sc);
    });

    // mirror content-type if present
    const ct = springRes.headers.get('content-type');
    if (ct) out.headers.set('content-type', ct);

    return out;
}

export async function GET(req: NextRequest)    { return forward(req, 'GET'); }
export async function POST(req: NextRequest)   { return forward(req, 'POST'); }
export async function PUT(req: NextRequest)    { return forward(req, 'PUT'); }
export async function PATCH(req: NextRequest)  { return forward(req, 'PATCH'); }
export async function DELETE(req: NextRequest) { return forward(req, 'DELETE'); }
