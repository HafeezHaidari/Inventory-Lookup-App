import React from 'react'
import {Trash2} from "lucide-react";

// Define the props for the DeleteButton component
interface Props {
    onClick: () => void;
}

// Component for a delete button that triggers the provided onClick function when clicked
const DeleteButton = ({ onClick }: Props) => {
    return (
        <button onClick={onClick}>
            <Trash2 />
        </button>
    )
}
export default DeleteButton
