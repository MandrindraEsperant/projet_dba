import { Role } from "@/types";

const AUTH_URL = "http://localhost:4000/api/auth";

export const authService = {
    async login(username: string, password?: string): Promise<{ user: { username: string, role: Role, permissions: any[] } }> {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });


        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur de connexion");
        }
        const data = await response.json(); // lire UNE seule fois
        return data;

    },

    async logout(): Promise<void> {
        await fetch(`${AUTH_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
    }
};
