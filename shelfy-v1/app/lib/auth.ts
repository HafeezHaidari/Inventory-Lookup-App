import {getApiBase} from "@/app/lib/base";

const base = getApiBase();

// Function to log in with form data
export const loginWithFormData = async (formData: FormData) => {

    // Extract username and password from form data
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    // Send login request to the server
    const response = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

    // Handle response
    if (!response.ok) {
        throw new Error("Login failed");
    }

    // Reload the page to reflect the new authentication state
    window.location.reload();
}

// Function to log out
export const logout = async () => {

    // Send logout request to the server
    await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    // Reload the page to reflect the new authentication state
    window.location.reload();
}