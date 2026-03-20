"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Role } from "@/types";
import { authService } from "@/services/auth.service";
import { useToast } from "./toast-context";

interface AuthContextType {
    user: User | null;
    login: (name: string, password?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { showToast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const savedUser = localStorage.getItem("auth_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password?: string) => {
        try {
            const data = await authService.login(username, password);
            const newUser: User = {
                name: data.user.username,
                role: data.user.role as Role,
                permissions: data.user.permissions
            };
            setUser(newUser);
            localStorage.setItem("auth_user", JSON.stringify(newUser));
            showToast(`Bienvenue, ${newUser.name} !`, "success");
            router.push(newUser.role === "admin" ? "/admin" : "/user");
        } catch (error: any) {
            console.error("Login Error:", error.message);
            showToast(error.message || "Erreur lors de la connexion", "error");
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            localStorage.removeItem("auth_user");
            showToast("Déconnexion réussie", "info");
            router.push("/login"); // Fixed path
        } catch (error) {
            console.error("Logout Error:", error);
            showToast("Erreur lors de la déconnexion", "error");
        }
    };

    useEffect(() => {
        if (!isLoading) {
            if (!user && pathname !== "/" && pathname !== "/login" && pathname !== "/signup") {
                router.push("/login");
            } else if (user && pathname === "/admin" && user.role !== "admin") {
                router.push("/user");
            }
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
