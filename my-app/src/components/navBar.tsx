import LoginButton from "./loginButton";

export default function navBar() {
    return (
        <div className="fixed top-0 inset-x-0 flex justify-between items-center z-10 p-2 px-6">
            <img className="w-32" src='logo.png' alt="Logo Image" />
            <LoginButton />
        </div>
    )
};