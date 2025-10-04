'use client';
import { useSession } from '@/app/lib/SessionProvider';
import { LoginForm } from "@/components/LoginLogout/LoginForm";
import { logout } from "@/app/lib/auth";
import LogoutButton from "@/components/LoginLogout/LogoutButton";
import CreateButton from "@/components/CreateButton";

export default function AuthSection() {
    const { isAuthenticated } = useSession();

    if (isAuthenticated) {
        return (
            <div className="flex items-center justify-center gap-3">
                <LogoutButton onClick={logout} />
                <CreateButton />
            </div>
        );
    }

    return <LoginForm />;
}