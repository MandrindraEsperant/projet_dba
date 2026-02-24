export interface Product {
    id: number;
    nom: string;
    prix: number;
    stock: number;
}

export interface AuditLog {
    id_audit: number;
    nom_utilisateur: string;
    type_action: string;
    table_concernee: string;
    date_action: string;
    machine_hote: string;
    details: string;
}

export type Role = "admin" | "user";

export type Permission = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";

export interface User {
    id?: string;
    name: string;
    role: Role;
    permissions?: Permission[];
}
