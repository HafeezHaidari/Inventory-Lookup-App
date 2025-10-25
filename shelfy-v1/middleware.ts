import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const hasAccess = Boolean(req.cookies.get('accessToken'));
    const isProtected = req.nextUrl.pathname.startsWith('/create');

    if (isProtected && !hasAccess) return NextResponse.redirect(new URL('/', req.url));

    return NextResponse.next();
}