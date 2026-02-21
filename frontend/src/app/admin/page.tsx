"use client";

import { useEffect, useState } from "react";
import { getAuditLogs, AuditEntry, addAuditLog } from "../audit-store";
import { useAuth } from "../auth-context";
import {
    Users,
    ShieldCheck,
    Trash2,
    Plus,
    Search,
    RefreshCw,
    ShieldAlert,
    X,
    UserPlus
} from "lucide-react";

interface ManagedUser {
    id: string;
    name: string;
    role: "admin" | "user";
    password?: string;
}

export default function AdminPage() {
    const { user: currentUser, isLoading } = useAuth();
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([
        { id: "100", name: "admin", role: "admin" },
        { id: "101", name: "user", role: "user" },
    ]);

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", password: "", role: "user" as const });
    const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

    const refreshLogs = () => {
        setLogs(getAuditLogs());
    };

    useEffect(() => {
        refreshLogs();
        window.addEventListener('audit-update', refreshLogs);
        return () => window.removeEventListener('audit-update', refreshLogs);
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
        </div>
    );

    if (!currentUser || currentUser.role !== 'admin') return null;

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const id = (100 + managedUsers.length).toString();
        const createdUser = { id, ...newUser };
        setManagedUsers([...managedUsers, createdUser]);

        addAuditLog({
            user: currentUser.name,
            action: "ADMIN_ACTION",
            details: `Création utilisateur : ${newUser.name} (Role: ${newUser.role})`
        });

        setNewUser({ name: "", password: "", role: "user" });
        setIsAddUserModalOpen(false);
    };

    const confirmDeleteUser = () => {
        if (!userToDelete) return;
        setManagedUsers(managedUsers.filter(u => u.id !== userToDelete.id));

        addAuditLog({
            user: currentUser.name,
            action: "ADMIN_ACTION",
            details: `Suppression utilisateur : ${userToDelete.name} (ID: ${userToDelete.id})`
        });

        setUserToDelete(null);
    };

    const lastSyncTime = logs.length > 0 ? logs[0].timestamp : "N/A";
    const activeUsersCount = new Set(logs.map(l => l.user)).size;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
                        <ShieldCheck size={18} />
                        <span>Console d'Administration</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Supervision Centrale</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Gérez les accès et surveillez l'intégrité du système.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={refreshLogs} className="btn btn-secondary !py-2">
                        <RefreshCw size={18} />
                        Actualiser
                    </button>
                    <button onClick={() => setIsAddUserModalOpen(true)} className="btn btn-primary">
                        <UserPlus size={18} />
                        Nouvel Utilisateur
                    </button>
                </div>
            </header>

            {/* Statistiques Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-l-4 border-l-blue-600 bg-blue-50/30">
                    <p className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Total des Actions</p>
                    <p className="text-4xl font-black text-slate-900">{logs.length}</p>
                </div>
                <div className="card border-l-4 border-l-indigo-600 bg-indigo-50/30">
                    <p className="text-sm text-indigo-600 font-bold mb-1 uppercase tracking-wider">Utilisateurs Actifs</p>
                    <p className="text-4xl font-black text-slate-900">{activeUsersCount}</p>
                </div>
                <div className="card border-l-4 border-l-amber-600 bg-amber-50/30">
                    <p className="text-sm text-amber-600 font-bold mb-1 uppercase tracking-wider">Dernière Transaction</p>
                    <p className="text-lg font-bold text-slate-700 truncate">{lastSyncTime}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gestion des Utilisateurs */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Users size={20} className="text-slate-400" />
                        <h2 className="text-xl font-bold text-slate-800">Utilisateurs Plateforme</h2>
                    </div>
                    <div className="card !p-0 overflow-hidden">
                        <div className="table-container !border-0 !rounded-none">
                            <table className="table">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th>ID / Nom</th>
                                        <th>Rôle</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managedUsers.map(u => (
                                        <tr key={u.id}>
                                            <td className="font-semibold text-slate-700">
                                                <div className="flex flex-col">
                                                    <span>{u.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">UID: {u.id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {u.name !== 'admin' && (
                                                    <button
                                                        onClick={() => setUserToDelete(u)}
                                                        className="text-slate-400 hover:text-red-600 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Journal d'Audit */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <ShieldAlert size={20} className="text-slate-400" />
                        <h2 className="text-xl font-bold text-slate-800">Journal d'Audit Systémique</h2>
                    </div>
                    <div className="card !p-0 overflow-hidden">
                        <div className="table-container !border-0 !rounded-none max-h-[500px] overflow-y-auto">
                            <table className="table">
                                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th>Opérateur</th>
                                        <th>Type</th>
                                        <th>Détails de l'Action</th>
                                        <th>Date & Heure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="text-xs">
                                            <td>
                                                <div className="font-bold text-slate-900">{log.user}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">{log.host}</div>
                                            </td>
                                            <td>
                                                <span className={`px-2 py-0.5 rounded font-bold ${log.action === 'INSERT' ? 'bg-emerald-100 text-emerald-700' :
                                                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                                            log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                                log.action === 'SIGNUP' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-indigo-100 text-indigo-700'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="font-mono bg-slate-50/50 p-2 text-slate-600 border-x border-slate-100">
                                                {log.details}
                                            </td>
                                            <td className="text-slate-500 whitespace-nowrap font-medium italic">
                                                {log.timestamp}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nouveau User */}
            {isAddUserModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Créer un Accès</h3>
                            <button onClick={() => setIsAddUserModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Identifiant / Nom</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Rôle Système</label>
                                <select
                                    className="input"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                                >
                                    <option value="user">Utilisateur Standard</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary flex-1">Annuler</button>
                                <button type="submit" className="btn btn-primary flex-1">Générer Accès</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmation Suppression User */}
            {userToDelete && (
                <div className="modal-backdrop">
                    <div className="modal-content !max-w-sm text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Révoquer l'Accès ?</h3>
                        <p className="text-slate-500 mb-6">L'utilisateur <strong>{userToDelete.name}</strong> n'aura plus accès à la plateforme.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} className="btn btn-secondary flex-1">Garder</button>
                            <button onClick={confirmDeleteUser} className="btn btn-primary bg-red-600 border-none flex-1">Révoquer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
