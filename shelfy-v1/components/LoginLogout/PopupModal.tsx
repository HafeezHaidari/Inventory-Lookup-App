import React, {useEffect} from 'react'
import ReactPortal from "@/components/ReactPortal";

interface PopupProps {
    children: React.ReactNode;
    isOpen: boolean;
    handleClose: () => void;
}

const PopupModal = ({
    children,
    isOpen,
    handleClose}: PopupProps) => {

    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => {
            e.key === 'Escape' ? handleClose() : null;
        }
        document.body.addEventListener("keydown", closeOnEscape);
        return (): void => {
            document.body.removeEventListener("keydown", closeOnEscape);
        }
    }, [handleClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return (): void => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ReactPortal wrapperId='react-portal-login-popup-container'>
            <>
                <div onClick={handleClose} className="fixed top-0 left-0 w-screen h-screen z-40 bg-neutral-800 opacity-50" aria-hidden="true"/>
                <div className="fixed rounded flex flex-col box-border min-w-fit overflow-hidden p-5 bg-white top-32 inset-x-12 sm:inset-x-24 md:inset-x-1/4 sm:top-1/5 z-50 opacity-100">
                    <div onClick={(e) => e.stopPropagation()} className="box-border h-5/6">{children}</div>
                </div>
            </>
        </ReactPortal>
    )
}
export default PopupModal
