"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth-context";
import { AuditLog, User as UserType, Role, Permission } from "@/types";
import { apiService } from "@/services/api.service";
import { Modal } from "@/components/Modal";
import {
    ShieldCheck,
    ShieldAlert,
    RefreshCw,
    UserPlus,
    Users,
    Trash2,
    Edit,
    X,
    Shield,
    ChevronDown,
    ChevronUp
} from "lucide-react";

export default function AdminPage() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);

    const [managedUsers, setManagedUsers] = useState<UserType[]>([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditPermsModalOpen, setIsEditPermsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", password: "", role: "user" as Role, permissions: [] as Permission[] });
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [userToDelete, setUserToDelete] = useState<{ id?: string; name: string } | null>(null);

    // États de visibilité des sections
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);
    const [isAuditExpanded, setIsAuditExpanded] = useState(true);

    const refreshUsers = useCallback(async () => {
        try {
            const users = await apiService.getUsers();
            setManagedUsers(users);
        } catch (error) {
            console.error("Fetch Users Error:", error);
        }
    }, []);

    const refreshLogs = useCallback(async () => {
        setIsLoadingLogs(true);
        try {
            const result = await apiService.getAuditLogs();
            setLogs(result);
        } catch (error) {
            console.error("Audit Fetch Error:", error);
        } finally {
            setIsLoadingLogs(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            refreshLogs();
            refreshUsers();
        }
    }, [currentUser, refreshLogs, refreshUsers]);

    if (authLoading || isLoadingLogs) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-500 font-medium">Chargement des données d'audit...</p>
        </div>
    );

    if (!currentUser || currentUser.role !== 'admin') return null;

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.createUser({
                name: newUser.name,
                password: newUser.password,
                role: newUser.role,
                permissions: newUser.role === 'user' ? newUser.permissions : ['ALL']
            });
            await refreshUsers();
            setNewUser({ name: "", password: "", role: "user", permissions: [] });
            setIsAddUserModalOpen(false);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleUpdatePermissions = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            await apiService.updateUserPermissions(editingUser.name, editingUser.permissions || []);
            await refreshUsers();
            setIsEditPermsModalOpen(false);
            setEditingUser(null);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await apiService.deleteUser(userToDelete.name);
            await refreshUsers();
            setUserToDelete(null);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const lastSyncTime = logs.length > 0 ? new Date(logs[0].date_action).toLocaleString() : "N/A";
    const activeUsersCount = new Set(logs.map(l => l.nom_utilisateur)).size;

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
                    <p className="text-lg font-bold text-slate-700 truncate">{logs.length}</p>
                </div>
                <div className="card border-l-4 border-l-indigo-600 bg-indigo-50/30">
                    <p className="text-sm text-indigo-600 font-bold mb-1 uppercase tracking-wider">Utilisateurs Actifs</p>
                    <p className="text-lg font-bold text-slate-700 truncate">{activeUsersCount}</p>
                </div>
                <div className="card border-l-4 border-l-amber-600 bg-amber-50/30">
                    <p className="text-sm text-amber-600 font-bold mb-1 uppercase tracking-wider">Dernière Transaction</p>
                    <p className="text-lg font-bold text-slate-700 truncate">{lastSyncTime}</p>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Gestion des Utilisateurs */}
                <section className="space-y-4">
                    <button
                        onClick={() => setIsUsersExpanded(!isUsersExpanded)}
                        className="flex items-center justify-between w-full p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-300 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isUsersExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Users size={22} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Utilisateurs Plateforme</h2>
                                <p className="text-sm text-slate-500">{managedUsers.length} comptes configurés</p>
                            </div>
                        </div>
                        {isUsersExpanded ? <ChevronUp className="text-slate-400 group-hover:text-indigo-500" /> : <ChevronDown className="text-slate-400 group-hover:text-indigo-500" />}
                    </button>

                    {isUsersExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="card !p-0 overflow-hidden shadow-md">
                                <div className="table-container !border-0 !rounded-none">
                                    <table className="table">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th>Utilisateur</th>
                                                <th>Rôle & Droits</th>
                                                <th className="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {managedUsers.map(u => (
                                                <tr key={u.id || u.name}>
                                                    <td className="font-semibold text-slate-700">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                                                <Shield size={14} />
                                                            </div>
                                                            <span>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-wrap gap-1">
                                                            {u.role === 'admin' ? (
                                                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase ring-1 ring-indigo-200/50">
                                                                    Accès Total (Admin)
                                                                </span>
                                                            ) : Array.isArray(u.permissions) && u.permissions.length > 0 ? (
                                                                u.permissions.map(p => (
                                                                    <span key={p} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold border border-blue-100 shadow-sm">
                                                                        {p === 'SELECT' ? 'LECTURE' :
                                                                            p === 'INSERT' ? 'AJOUT' :
                                                                                p === 'UPDATE' ? 'MODIF' :
                                                                                    p === 'DELETE' ? 'SUPPR' : p}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded">Aucun droit spécifique</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {u.role === 'user' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingUser({ ...u });
                                                                        setIsEditPermsModalOpen(true);
                                                                    }}
                                                                    className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                                                                    title="Modifier les droits"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                            )}
                                                            {u.name !== 'admin' && u.name !== currentUser?.name && (
                                                                <button
                                                                    onClick={() => setUserToDelete(u)}
                                                                    className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Journal d'Audit */}
                <section className="space-y-4">
                    <button
                        onClick={() => setIsAuditExpanded(!isAuditExpanded)}
                        className="flex items-center justify-between w-full p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-amber-300 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isAuditExpanded ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                <ShieldAlert size={22} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Journal d'Audit Systémique</h2>
                                <p className="text-sm text-slate-500">{logs.length} événements enregistrés</p>
                            </div>
                        </div>
                        {isAuditExpanded ? <ChevronUp className="text-slate-400 group-hover:text-amber-500" /> : <ChevronDown className="text-slate-400 group-hover:text-amber-500" />}
                    </button>

                    {isAuditExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="card !p-0 overflow-hidden shadow-md">
                                <div className="table-container !border-0 !rounded-none max-h-[600px] overflow-y-auto">
                                    <table className="table">
                                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th>Opérateur</th>
                                                <th>Type</th>
                                                <th>Table</th>
                                                <th>Détails de l'Action</th>
                                                <th>Date & Heure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log) => (
                                                <tr key={log.id_audit} className="text-xs">
                                                    <td>
                                                        <div className="font-bold text-white text-slate-900">{log.nom_utilisateur}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono">{log.machine_hote || 'N/A'}</div>
                                                    </td>
                                                    <td>
                                                        <span className={`px-2 py-0.5 rounded font-bold ${log.type_action === 'INSERT' ? 'bg-emerald-100 text-emerald-700' :
                                                            log.type_action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                                                log.type_action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                                    'bg-indigo-100 text-indigo-700'
                                                            }`}>
                                                            {log.type_action}
                                                        </span>
                                                    </td>
                                                    <td className="font-medium text-slate-600">
                                                        {log.table_concernee}
                                                    </td>
                                                    <td className="font-mono bg-slate-50/50 p-2 text-slate-600 border-x border-slate-100 max-w-xs truncate" title={log.details}>
                                                        {log.details}
                                                    </td>
                                                    <td className="text-slate-500 whitespace-nowrap font-medium italic">
                                                        {new Date(log.date_action).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Modal Nouveau User */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Créer un Accès"
            >
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
                            onChange={e => setNewUser({ ...newUser, role: e.target.value as any, permissions: e.target.value === 'admin' ? ['ALL'] : [] })}
                        >
                            <option value="user">Utilisateur Standard</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>

                    {newUser.role === 'user' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold mb-1">Droits d'accès (Produits)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Lecture simple', value: 'SELECT' },
                                    { label: 'Ajout uniquement', value: 'INSERT' },
                                    { label: 'Modification', value: 'UPDATE' },
                                    { label: 'Suppression', value: 'DELETE' },
                                    { label: 'Tous les droits', value: 'ALL' }
                                ].map((p) => (
                                    <label key={p.value} className="flex items-center gap-2 text-sm p-2 rounded bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100">
                                        <input
                                            type="checkbox"
                                            checked={newUser.permissions.includes(p.value as Permission) || newUser.permissions.includes('ALL')}
                                            onChange={(e) => {
                                                if (p.value === 'ALL') {
                                                    setNewUser({ ...newUser, permissions: e.target.checked ? ['ALL'] : [] });
                                                } else {
                                                    let newPerms = e.target.checked
                                                        ? [...newUser.permissions.filter(x => x !== 'ALL'), p.value as Permission]
                                                        : newUser.permissions.filter(x => x !== p.value);
                                                    setNewUser({ ...newUser, permissions: newPerms });
                                                }
                                            }}
                                            disabled={newUser.permissions.includes('ALL') && p.value !== 'ALL'}
                                        />
                                        <span className="text-slate-700 ">{p.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary flex-1">Annuler</button>
                        <button type="submit" className="btn btn-primary flex-1">Générer Accès</button>
                    </div>
                </form>
            </Modal>

            {/* Modal Modification Permissions */}
            <Modal
                isOpen={isEditPermsModalOpen}
                onClose={() => setIsEditPermsModalOpen(false)}
                title={`Modifier les droits : ${editingUser?.name}`}
            >
                {editingUser && (
                    <form onSubmit={handleUpdatePermissions} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700">Sélectionnez les droits d'accès</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Lecture (SELECT)', value: 'SELECT' },
                                    { label: 'Ajout (INSERT)', value: 'INSERT' },
                                    { label: 'Modification (UPDATE)', value: 'UPDATE' },
                                    { label: 'Suppression (DELETE)', value: 'DELETE' },
                                    { label: 'Tous les droits (ALL)', value: 'ALL' }
                                ].map((p) => (
                                    <label key={p.value} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${(Array.isArray(editingUser.permissions) && (editingUser.permissions.includes(p.value as Permission) || editingUser.permissions.includes('ALL')))
                                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                        : 'bg-white border-slate-200 hover:bg-slate-50'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                            checked={Array.isArray(editingUser.permissions) && (editingUser.permissions.includes(p.value as Permission) || editingUser.permissions.includes('ALL'))}
                                            onChange={(e) => {
                                                const currentPerms = Array.isArray(editingUser.permissions) ? editingUser.permissions : [];
                                                if (p.value === 'ALL') {
                                                    setEditingUser({ ...editingUser, permissions: e.target.checked ? ['ALL'] : [] });
                                                } else {
                                                    let newPerms = e.target.checked
                                                        ? [...currentPerms.filter(x => x !== 'ALL'), p.value as Permission]
                                                        : currentPerms.filter(x => x !== p.value);
                                                    setEditingUser({ ...editingUser, permissions: newPerms });
                                                }
                                            }}
                                            disabled={Array.isArray(editingUser.permissions) && editingUser.permissions.includes('ALL') && p.value !== 'ALL'}
                                        />
                                        <span className="text-sm font-medium text-slate-700">{p.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsEditPermsModalOpen(false)} className="btn btn-secondary flex-1">Annuler</button>
                            <button type="submit" className="btn btn-primary flex-1">Enregistrer les modifications</button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Confirmation Suppression User */}
            <Modal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                title="Révoquer l'Accès ?"
            >
                {userToDelete && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert size={32} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            L'utilisateur <strong>{userToDelete.name}</strong> n'aura plus accès à la plateforme.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} className="btn btn-secondary flex-1">Garder</button>
                            <button onClick={confirmDeleteUser} className="btn btn-primary bg-red-600 hover:bg-red-700 border-none flex-1">Révoquer</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
