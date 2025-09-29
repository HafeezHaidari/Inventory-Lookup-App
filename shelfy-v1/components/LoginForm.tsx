'use client';

import {useState} from "react";
import LoginPopup from "@/components/LoginPopup";

export const LoginButton = () => {

    const [openPopup, setOpenPopup] = useState(false)

    return (
        <>
            <button onClick={() => setOpenPopup(true)} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
                Login
            </button>

            <LoginPopup isOpen={openPopup} handleClose={() => setOpenPopup(false)}>
                <div>
                    <h2>Welcome</h2>
                    <form
                        className="space-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // handle login here
                            setOpenPopup(false);
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

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setOpenPopup(false)}
                                type="submit"
                                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </LoginPopup>
        </>
    )
}

