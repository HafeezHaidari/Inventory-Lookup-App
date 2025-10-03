// app/lib/SessionProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SessionState = { isAuthenticated: boolean; user: { username: string; roles: string[] } | null };
const SessionContext = createContext<SessionState>({ isAuthenticated: false, user: null });

export default function SessionProvider({ initialSession, children }: { initialSession: SessionState; children: React.ReactNode }) {
    const [session, setSession] = useState(initialSession);

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch('/api/session', { cache: 'no-store' });
                if (res.ok) setSession({ isAuthenticated: true, user: (await res.json()).user });
                else setSession({ isAuthenticated: false, user: null });
            } catch {}
        };
        const onFocus = () => document.visibilityState === 'visible' && check();
        document.addEventListener('visibilitychange', onFocus);
        return () => document.removeEventListener('visibilitychange', onFocus);
    }, []);

    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
export const useSession = () => useContext(SessionContext);