import React from 'react'
import {Trash2} from "lucide-react";

interface Props {
    onClick: () => void;
}

const DeleteButton = ({ onClick }: Props) => {
    return (
        <button onClick={onClick}>
            <Trash2 />
        </button>
    )
}
export default DeleteButton
