'use client';
import { useSession } from '@/app/lib/SessionProvider';
import { LoginButton } from '@/components/LoginForm';

export default function AuthSection() {
    const { isAuthenticated, user } = useSession();

    if (isAuthenticated) {
        return <div>Welcome, {user?.username}!</div>
    }

    return <LoginButton />;
}