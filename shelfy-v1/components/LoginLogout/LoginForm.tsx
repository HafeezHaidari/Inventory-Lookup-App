'use client';

import React, {useState} from "react";
import {loginWithFormData} from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import PopupModal from "@/components/LoginLogout/PopupModal";
import LoginButton from "@/components/LoginLogout/LoginButton";

export const LoginForm = () => {

    const [openPopup, setOpenPopup] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    return (
        <>
            <LoginButton onClick={() => setOpenPopup(true)}/>

            <PopupModal isOpen={openPopup} handleClose={() => setOpenPopup(false)}>
                <div>
                    <h2>Welcome</h2>
                    <form
                        className="space-y-3"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError(null);
                            setSubmitting(true)
                            try {
                                const formData = new FormData(e.currentTarget);
                                await loginWithFormData(formData);
                                setOpenPopup(false);
                                router.refresh();
                            } catch (err: any) {
                                setError(err?.message ?? "Login failed");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <label className="block">
                            <span className="text-sm">Username</span>
                            <input
                                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
                                name="username"
                                autoFocus
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm">Password</span>
                            <input
                                className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
                                type="password"
                                name="password"
                            />
                        </label>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => setOpenPopup(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </PopupModal>
        </>
    )
}

