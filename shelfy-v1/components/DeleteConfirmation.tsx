'use client';

import React, {useState} from 'react'
import DeleteButton from "@/components/DeleteButton";
import PopupModal from "@/components/LoginLogout/PopupModal";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
//import {getApiBase} from "@/app/api/_utils/base";

interface Props {
    id: number;
}
//const base = getApiBase();

// Component for confirming the deletion of a product
const DeleteConfirmation = ({ id }: Props) => {

    // State to manage the visibility of the confirmation popup
    const [openPopUp, setOpenPopUp] = useState(false);

    // Hooks to manage routing and search parameters
    const router = useRouter();
    const pathName = usePathname();
    const sp = useSearchParams();

    // Function to handle the deletion of the product
    const handleDelete = async () => {
        const response = await fetch(`/api/proxy/products/${id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        // Close the popup after attempting to delete. If deletion fails, log an error.
        // If successful, update the URL to remove the selected product and refresh the page.
        if (!response.ok) {
            console.error('Failed to delete the product');
        } else {
            const newParams = sp
                .toString()
                .split("&")
                .filter(pair => !pair.startsWith("selected="))
                .join("&");
            router.replace(`${pathName}?${newParams}`, { scroll: false });
            router.refresh();
        }
    }



    return (
        <>
            <DeleteButton onClick={() => setOpenPopUp(true)}/>
            <PopupModal isOpen={openPopUp} handleClose={() => setOpenPopUp(false)}>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="m-4">Delete this product?</h2>
                    <div className="flex flex-row gap-6 mt-4">
                        <button onClick={() => setOpenPopUp(false)} className="rounded-xl p-2" >
                            Cancel
                        </button>
                        <button onClick={handleDelete} className="bg-red-300 border border-red-500 rounded-xl p-2" >
                            Delete
                        </button>
                    </div>
                </div>
            </PopupModal>
        </>

    )
}
export default DeleteConfirmation
