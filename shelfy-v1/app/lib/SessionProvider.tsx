// app/lib/SessionProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of the session state as an authentication status and user details
type SessionState = { isAuthenticated: boolean; user: { username: string; roles: string[] } | null };

// Create a context to hold the session state (of type SessionState), defaulting to unauthenticated with no user
const SessionContext = createContext<SessionState>({ isAuthenticated: false, user: null });

export default function SessionProvider({ initialSession, children }: { initialSession: SessionState; children: React.ReactNode }) {
    // useState hook to manage the session state, initialized with the provided initialSession
    const [session, setSession] = useState(initialSession);

    // useEffect hook to check the session status when the component mounts and when the document visibility changes
    useEffect(() => {
        const check = async () => {
            try {

                // Fetch the current session status from the server without caching
                // api/session is a proxy endpoint to the backend session check
                // If the response is OK, update the session state to authenticated with user details
                // If not, set the session state to unauthenticated with no user
                const res = await fetch('/api/session', { cache: 'no-store' });
                if (res.ok) setSession({ isAuthenticated: true, user: (await res.json()).user });
                else setSession({ isAuthenticated: false, user: null });
            } catch {}
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