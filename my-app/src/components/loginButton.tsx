'use client';

import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { TailSpin } from "react-loader-spinner";

export default function LoginButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user, error, isLoading } = useUser();


    useEffect(() => {
        setIsAuthenticated(!!user)
    }, [user])

    if (error) {
        return (
            <p className="text-red-500">AUTH ERROR</p>
        )
    }
    else if (isLoading) {
        return (
            <TailSpin
                height="20"
                width="20"
                color="#002145"
                ariaLabel="tail-spin-loading"
                radius={1}
            />
        )
    }
    
    let bodyText: string;
    let endPoint: string;
    if (isAuthenticated) {
        bodyText = "Logout"
        endPoint = "/api/auth/logout"
    }
    else {
        bodyText = "Login / Register"
        endPoint = "/api/auth/login"
    }
    return (
        <a href={endPoint} className="font-body text-primary-ubc font-bold text-sm hover:text-blue-500">
            {bodyText}
        </a>
    )
}
