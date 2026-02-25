import { Product, AuditLog, User as UserType, Permission } from "@/types";

const API_BASE_URL = "http://localhost:4000/api";

export const apiService = {
    // Products
    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${API_BASE_URL}/produits`, { credentials: "include" });


        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Status: ${response.status}, Body: ${errorText}`);
            throw new Error(`Erreur lors de la récupération des produits (${response.status})`);
        }

        const data = await response.json(); // lire UNE seule fois
        return data;
    },

    async addProduct(product: Omit<Product, 'id'>): Promise<void> {

        const response = await fetch(`${API_BASE_URL}/produits`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
            credentials: "include"
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
    },

    async updateProduct(id: number, product: Partial<Product>): Promise<void> {

        const response = await fetch(`${API_BASE_URL}/produits/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
            credentials: "include"
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

    },

    async deleteProduct(id: number): Promise<void> {
        
        const response = await fetch(`${API_BASE_URL}/produits/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
         const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
    },

    // Audit
    async getAuditLogs(): Promise<AuditLog[]> {
        const response = await fetch(`${API_BASE_URL}/audit`, { credentials: "include" });
        if (!response.ok) throw new Error("Erreur lors de la récupération des audits");
        return response.json();
    },

    // User Management
    async getUsers(): Promise<UserType[]> {
        const response = await fetch(`${API_BASE_URL}/auth/users`, { credentials: "include" });
        if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
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
        if (!response.ok) throw new Error("Erreur lors de la mise à jour des permissions");
    },

    async deleteUser(username: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/users/${username}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
};
