const base = process.env.NEXT_PUBLIC_API_BASE;

export const loginWithFormData = async (formData: FormData) => {

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    const response = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    window.location.reload();
}

export const logout = async () => {

    await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });
    window.location.reload();
}