// app/lib/SessionProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiBase } from '@/app/lib/base';

// Define the shape of the session state as an authentication status and user details
type SessionState = { isAuthenticated: boolean; user: { username: string; roles: string[] } | null };

// Create a context to hold the session state (of type SessionState), defaulting to unauthenticated with no user
const SessionContext = createContext<SessionState>({ isAuthenticated: false, user: null });

export default function SessionProvider({ initialSession, children }: { initialSession: SessionState; children: React.ReactNode }) {
    // useState hook to manage the session state, initialized with the provided initialSession
    const [session, setSession] = useState(initialSession);
    const base = getApiBase();

    // useEffect hook to check the session status when the component mounts and when the document visibility changes
    useEffect(() => {
        const check = async () => {
            try {
                // Fetch the current session status from the API backend directly from the client
                // Use credentials: 'include' so the browser will attach HttpOnly/Secure cookies for the API domain
                const res = await fetch(`${base}/auth/me`, { cache: 'no-store', credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.username === 'string' && Array.isArray(data.roles)) {
                        setSession({ isAuthenticated: true, user: { username: data.username, roles: data.roles } });
                    } else {
                        setSession({ isAuthenticated: false, user: null });
                    }
                } else {
                    setSession({ isAuthenticated: false, user: null });
                }
            } catch (err) {
                // On error, treat as unauthenticated
                setSession({ isAuthenticated: false, user: null });
            }
        };
        // Initial session check on component mount
        check().then();

        // Add an event listener to check the session when the document visibility changes (e.g., tab focus)
        const onFocus = () => document.visibilityState === 'visible' && check();
        document.addEventListener('visibilitychange', onFocus);

        // Cleanup the event listener on component unmount
        return () => document.removeEventListener('visibilitychange', onFocus);
    }, []);

    // Provide the session state to child components via the SessionContext
    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

// Custom hook to access the session context easily in other components
export const useSession = () => useContext(SessionContext);