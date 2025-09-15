'use client';

const LoginButton = () => {

    const handleLogin = () => {
        // Implement login logic here
        console.log("Login button clicked");
    }
    return (
        <div>
            <button onClick={handleLogin} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
                Login
            </button>
        </div>
    )
}
export default LoginButton
