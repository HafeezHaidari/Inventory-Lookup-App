import React, {useEffect} from 'react'
import ReactPortal from "@/components/ReactPortal";

// Props for the PopupModal component, including children elements, open state, and close handler
interface PopupProps {
    children: React.ReactNode;
    isOpen: boolean;
    handleClose: () => void;
}

// Component to display a popup modal with overlay, handling escape key and body scroll lock
const PopupModal = ({
    children,
    isOpen,
    handleClose}: PopupProps) => {

    // Effect to handle closing the modal when the Escape key is pressed
    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => {
            e.key === 'Escape' ? handleClose() : null;
        }
        document.body.addEventListener("keydown", closeOnEscape);
        return (): void => {
            document.body.removeEventListener("keydown", closeOnEscape);
        }
    }, [handleClose]);

    // Effect to lock body scroll when the modal is open and restore it when closed
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return (): void => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // If the modal is not open, render nothing
    if (!isOpen) return null;

    // Render the modal with overlay and content inside a React portal
    return (
        <ReactPortal wrapperId='react-portal-login-popup-container'>
            <>
                <div onClick={handleClose} className="fixed top-0 left-0 w-screen h-screen z-40 bg-neutral-800 opacity-50" aria-hidden="true"/>
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl bg-white p-5 shadow-xl w-fit min-w-[100px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
                    <div onClick={(e) => e.stopPropagation()} className="box-border">{children}</div>
                </div>
            </>
        </ReactPortal>
    )
}
export default PopupModal
