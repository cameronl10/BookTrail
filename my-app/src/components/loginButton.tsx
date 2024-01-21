'use client';

import { useState } from "react";

export default function LoginButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    if(isAuthenticated) {
        return (
            <a href="/api/auth/logout" className="mr-5 font-body text-primary-ubc font-bold text-sm">
                Logout
            </a>
        )
    } else {
        return (
            <a href="/api/auth/login" className="mr-5 font-body text-primary-ubc font-bold text-sm">
                Login / Sign Up
            </a>
        )
    }
}
