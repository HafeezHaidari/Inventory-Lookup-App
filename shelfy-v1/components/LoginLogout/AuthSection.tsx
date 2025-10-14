'use client';
import { useSession } from '@/app/lib/SessionProvider';
import { LoginForm } from "@/components/LoginLogout/LoginForm";
import { logout } from "@/app/lib/auth";
import LogoutButton from "@/components/LoginLogout/LogoutButton";
import CreateButton from "@/components/CreateButton";

// Component that conditionally renders login form or logout/create buttons based on authentication state
export default function AuthSection() {

    // Get the authentication status from the session context
    const { isAuthenticated } = useSession();

    // If a session exists (user is authenticated), show logout and create buttons
    if (isAuthenticated) {
        return (
            <div className="flex items-center justify-center gap-3">
                <LogoutButton onClick={logout} />
                <CreateButton />
            </div>
        );
    }

    // If no session exists (user is not authenticated), show the login form
    return <LoginForm />;
}