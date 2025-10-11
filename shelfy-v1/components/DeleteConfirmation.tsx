import React, {useState} from 'react'
import DeleteButton from "@/components/DeleteButton";
import PopupModal from "@/components/LoginLogout/PopupModal";

interface Props {
    id: number;

}

const DeleteConfirmation = ({ id }: Props) => {
    const [openPopUp, setOpenPopUp] = useState(false);

    const handleClick = () => setOpenPopUp(false);


    return (
        <>
            <DeleteButton onClick={() => setOpenPopUp(true)}/>
            <PopupModal isOpen={openPopUp} handleClose={() => setOpenPopUp(false)}>
                <div className="space-x-5">
                    <button onClick={() => setOpenPopUp(false)}>
                        Cancel
                    </button>
                    <button onClick={handleClick}>
                        Delete
                    </button>
                </div>
            </PopupModal>
        </>

    )
}
export default DeleteConfirmation
