import LoginButton from "./loginButton";

export default function navBar() {
    return (
        <div className="fixed top-0 inset-x-0 flex justify-between items-center z-10 py-4 px-6 pointer-events-none">
            <img className="w-32" src='logo.png' alt="Logo Image" />
            <div className="pointer-events-auto">
                <LoginButton />
            </div>
        </div>
    )
};