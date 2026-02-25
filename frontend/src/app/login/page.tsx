"use client";

import React, { useState } from "react";
import { useAuth } from "../auth-context";
// import { Role } from "@/types";

export default function LoginPage() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    // const [role, setRole] = useState<Exclude<Role, null>>("user");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && password) {
            await login(name, password);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="card shadow-xl border-t-4 border-blue-600">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Connexion Système</h1>
                    <p className="text-gray-500 text-sm mt-2">Veuillez vous authentifier pour continuer</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                        <input
                            type="text"
                            className="input bg-white"
                            placeholder="Ex: Jean Dupont"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de Passe</label>
                        <input
                            type="password"
                            className="input bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle d'Accès</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${role === "user"
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                                    : "border-gray-100 bg-gray-50 text-gray-500"
                                    }`}
                            >
                                Utilisateur
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${role === "admin"
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                                    : "border-gray-100 bg-gray-50 text-gray-500"
                                    }`}
                            >
                                Administrateur
                            </button>
                        </div>
                    </div> */}

                    <button type="submit" className="btn btn-primary w-full py-3 text-lg mt-4">
                        Se Connecter
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-slate-500">
                        Nouveau sur la plateforme ? {" "}
                        <a href="/signup" className="text-blue-600 font-bold hover:underline">
                            Créer un compte
                        </a >
                    </p>
                    <div className="text-[10px] text-gray-400 mt-4">
                        Sécurisé par le protocole AuditSys Pro v1.0
                    </div>
                </div>
            </div>
        </div>
    );
}
