import React, {useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom';

// Function to create a wrapper element and append it to the body
const createWrapperAndAppendToBody = (wrapperId: string) => {
    if (!document) return null;
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('id', wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
}

// ReactPortal component to render children into a DOM node outside the main React app
const ReactPortal = ({
    children,
    wrapperId
}: {
    children: React.ReactElement;
    wrapperId: string
}) => {

    // State to hold the wrapper element
    const [wrapperElement, setWrapperElement] = useState<HTMLElement>();

    // useLayoutEffect to create or find the wrapper element when the component mounts
    useLayoutEffect(() => {

        // Ensure the code runs only in a browser environment
        if (typeof document === 'undefined') return;

        // Check if an element with the specified ID already exists
        let element = document.getElementById(wrapperId);
        let systemCreated = false;

        // If the element doesn't exist, create it and append to the body
        if (!element) {
            systemCreated = true;
            element = createWrapperAndAppendToBody(wrapperId);
        }
        setWrapperElement(element!);

        // Cleanup function to remove the element if it was created by this component
        return () => {
            if (systemCreated && element?.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }, [wrapperId]);

    // If the wrapper element is not ready, return null
    if (!wrapperElement) return null;

    // Use createPortal to render children into the wrapper element
    return createPortal(children, wrapperElement);
}
export default ReactPortal
