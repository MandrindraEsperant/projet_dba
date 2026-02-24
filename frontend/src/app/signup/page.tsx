"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation d'inscription locale
        // Dans une vraie app, on enverrait ça au back via authService.signup
        setTimeout(() => {
            const newUser = { name, email, role: "user" };

            // On pourrait stocker temporairement pour la démo
            const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
            localStorage.setItem("mock_users", JSON.stringify([...existingUsers, { ...newUser, password }]));

            setIsLoading(false);
            router.push("/login?signup_success=true");
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto py-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="card shadow-2xl border-t-4 border-indigo-600">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Créer un Compte</h1>
                    <p className="text-slate-500 mt-2 font-medium">Rejoignez la plateforme AuditSys Pro</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <User size={14} /> Nom Complet
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Jean Dupont"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Mail size={14} /> Adresse Email
                        </label>
                        <input
                            type="email"
                            className="input"
                            placeholder="jean.dupont@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Lock size={14} /> Mot de Passe
                        </label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-3.5 text-lg font-bold shadow-lg shadow-indigo-200 mt-6 group"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Création en cours...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                S'inscrire <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Déjà un compte ? {" "}
                        <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
