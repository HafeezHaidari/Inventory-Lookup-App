import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';


// GET /api/session, proxy endpoint to get the current session from the server
export async function GET() {
    const user = await getSession();
    return user ? NextResponse.json({ user }) : NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
}
