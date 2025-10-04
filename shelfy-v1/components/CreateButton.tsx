import React from 'react';
import Link from "next/link";

const CreateButton = () => {

    return (
        <Link href="/create">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
                Create
            </button>
        </Link>
    )
}
export default CreateButton
