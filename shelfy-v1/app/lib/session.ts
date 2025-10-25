import { cookies } from 'next/headers';
import {getApiBase} from "@/app/lib/base";

const base = getApiBase();

// Type definition for the session user
export type SessionUser = {
    username: string;
    roles: string[];
};

// Function to get the current session user. Async, either returns a SessionUser or null
export const getSession = async (): Promise<SessionUser | null> => {

    // Get cookies from the request
    const cookieHeader = (await cookies()).toString();

    // Fetch the current user from the server
    let response = await fetch(`${base}/auth/me`, {
        headers: {
            cookie: cookieHeader
        }, cache: "no-cache", credentials: 'include'
    });

    // If the access token is expired, try to refresh it
    if (response.status === 401) {

        const refreshResponse = await fetch(`${base}/auth/refresh`, {
            method: "POST",
            headers: {
                cookie: cookieHeader
            }, cache: "no-cache", credentials: 'include'
        });

        // If refresh also fails, return null
        if (!refreshResponse.ok) {
            return null;
        }

        // Retry fetching the current user with the new access token
        response = await fetch(`${base}/auth/me`, {
            headers: {
                cookie: cookieHeader
            }, cache: "no-cache", credentials: 'include'
        });
    }

    // If fetching the user still fails, return null
    if (!response.ok) {
        return null;
    }

    // Return the user data
    return response.json();
}