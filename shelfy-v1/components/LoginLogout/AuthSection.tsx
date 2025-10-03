'use client';
import { useSession } from '@/app/lib/SessionProvider';
import {LoginForm} from "@/components/LoginLogout/LoginForm";

export default function AuthSection() {
    const { isAuthenticated } = useSession();

    if (isAuthenticated) {
        return <div>Welcome!</div>
    }

    return <LoginForm />;
}