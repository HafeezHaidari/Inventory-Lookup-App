import { cookies } from 'next/headers';

const base = process.env.NEXT_PUBLIC_API_BASE;

export type SessionUser = {
    username: string;
    roles: string[];
};

export const getSession = async (): Promise<SessionUser | null> => {
    const cookieHeader = (await cookies()).toString();

    let response = await fetch(`${base}/auth/me`, {
        headers: {
            cookie: cookieHeader
        }, cache: "no-cache"
    });

    if (response.status === 401) {
        const refreshResponse = await fetch(`${base}/auth/refresh`, {
            method: "POST",
            headers: {
                cookie: cookieHeader
            }, cache: "no-cache"
        });

        if (!refreshResponse.ok) {
            return null;
        }

        response = await fetch(`${base}/auth/me`, {
            headers: {
                cookie: cookieHeader
            }, cache: "no-cache"
        });
    }

    if (!response.ok) {
        return null;
    }

    return response.json();
}