"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Role = "admin" | "user" | null;

interface AuthContextType {
    user: { name: string; role: Role } | null;
    login: (name: string, role: Role) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ name: string; role: Role } | null>(null);
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

    const login = (name: string, role: Role) => {
        const newUser = { name, role };
        setUser(newUser);
        localStorage.setItem("auth_user", JSON.stringify(newUser));

        // Audit log for login
        const { addAuditLog } = require("./audit-store");
        addAuditLog({
            user: name,
            action: "LOGIN",
            details: `Connexion utilisateur réussie (Rôle: ${role})`
        });

        router.push(role === "admin" ? "/admin" : "/user");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
        router.push("/");
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
