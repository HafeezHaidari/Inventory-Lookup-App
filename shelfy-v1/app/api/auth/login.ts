import {FormEvent} from "react";
import {useRouter} from "next/navigation";

export const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    const router = useRouter();

    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch(`${process.env.API_BASEURL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
        router.refresh();
    }
}