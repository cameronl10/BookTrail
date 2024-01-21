import LoginButton from "./loginButton";

export default function navBar() {
    return (
    <div>
        <div className="w-screen flex justify-between content-center items-center">
            <img className="ml-3 w-32" src='logo.png' alt="../logo.png"/>
            <LoginButton />
        </div>
    </div>
    )
};