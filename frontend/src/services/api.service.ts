import { Compte, AuditLog, User as UserType, Permission } from "@/types";
import { url } from "inspector";

const API_BASE_URL = "http://localhost:4000/api";

export const apiService = {
    // Products
    async getComptes(): Promise<Compte[]> {
        const response = await fetch(`${API_BASE_URL}/compte`, { credentials: "include" });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la récupération des comptes");
        }

        const data = await response.json(); // lire UNE seule fois
        return data;
    },

    async addCompte(compte: Omit<Compte, 'id'>): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/compte`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(compte),
            credentials: "include"
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            if (data.message) {
                throw new Error(data.message);
            }
            throw new Error("Erreur lors de l'ajout du compte");
        }
    },

    async updateCompte(id: number, compte: Partial<Compte>): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/compte/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(compte),
            credentials: "include"
        });
        const data = await response.json();

        if (!response.ok) {
            // On utilise 'data' qui contient déjà le JSON extrait
            throw new Error(data.message || "Erreur lors de la mise à jour");
        }

        return data;

    },

    async deleteCompte(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/compte/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la suppression du compte");
        }
    },

    // Audit
    async getAuditLogs(): Promise<AuditLog[]> {
        const response = await fetch(`${API_BASE_URL}/audit`, { credentials: "include" });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la récupération des audits");
        }
        return response.json();
    },

    // User Management
    async getUsers(): Promise<UserType[]> {
        const response = await fetch(`${API_BASE_URL}/auth/users`, { credentials: "include" });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la récupération des utilisateurs");
        }
        return response.json();
    },

    async createUser(user: Omit<UserType, 'id'> & { password?: string }): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/create-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la création de l'utilisateur");
        }
    },

    async updateUserPermissions(username: string, permissions: Permission[]): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/users/${username}/permissions`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ permissions }),
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la mise à jour des permissions");
        }
    },

    async deleteUser(username: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/users/${username}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la suppression de l'utilisateur");
        }
    }
};
