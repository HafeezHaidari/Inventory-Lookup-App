import {FormEvent} from "react";

export const loginWithFormData = async (formData: FormData) => {
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    const base = process.env.NEXT_PUBLIC_API_BASE; // expose to client
    const response = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if your backend sets cookies
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    } else {
        console.log(response);
    }
}
