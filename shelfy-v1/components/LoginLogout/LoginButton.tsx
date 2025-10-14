import React from 'react'

interface LoginButtonProps {
    onClick: () => void;
}

// Component for a login button that triggers the provided onClick function when clicked
const LoginButton = ({ onClick }: LoginButtonProps) => {

    return (

        <button onClick={onClick} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
            Login
        </button>

    )
}
export default LoginButton
