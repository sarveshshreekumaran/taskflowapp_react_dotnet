import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service.js";
import type { LoginDto } from "../types/index.js";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    loginUser: (credentials: LoginDto) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children} : {children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>{
        const verifySession = async () => {
            const valid = await authService.checkSessionStatus();
            setIsAuthenticated(valid);
            setLoading(false);
        }

        verifySession();
    }, []);

    const loginUser = async (credentials: LoginDto) => {
        await authService.login(credentials);
        setIsAuthenticated(true);

    }

    const logoutUser = async () => {
        await authService.logout();
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be executed within an AuthProvider compent wrapper');
    }
    return context
}