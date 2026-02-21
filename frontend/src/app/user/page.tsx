"use client";

import { useState } from "react";
import { addAuditLog } from "../audit-store";
import { useAuth } from "../auth-context";
import {
    Plus,
    Pencil,
    Trash2,
    Database,
    PlusCircle,
    X,
    CheckCircle2,
    AlertCircle,
    AlertTriangle
} from "lucide-react";

interface Item {
    id: number;
    name: string;
    hardware: string;
    count: number;
}

export default function UserPage() {
    const { user, isLoading } = useAuth();
    const [data, setData] = useState<Item[]>([
        { id: 1, name: "Jean Dupont", hardware: "Ordinateur HP", count: 2 },
        { id: 2, name: "Marie Curie", hardware: "Écran Dell 24\"", count: 1 },
    ]);

    const [newItem, setNewItem] = useState({ name: "", hardware: "", count: 0 });
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Confirmation States
    const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
    const [confirmUpdate, setConfirmUpdate] = useState<Item | null>(null);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Chargement du panneau...</p>
        </div>
    );

    if (!user) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.hardware) return;

        const id = Date.now();
        const entry = { id, ...newItem };
        setData([...data, entry]);

        addAuditLog({
            user: user.name,
            action: "INSERT",
            details: `Attribution matos : [${newItem.hardware}] à [${newItem.name}] (Qté: ${newItem.count})`
        });

        setNewItem({ name: "", hardware: "", count: 0 });
        setIsAddModalOpen(false);
    };

    const executeDelete = () => {
        if (!confirmDelete) return;
        setData(data.filter(item => item.id !== confirmDelete.id));
        addAuditLog({
            user: user.name,
            action: "DELETE",
            details: `Suppression de l'attribution ID: ${confirmDelete.id} (${confirmDelete.hardware})`
        });
        setConfirmDelete(null);
    };

    const triggerUpdateConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setConfirmUpdate(editingItem);
        }
    };

    const executeUpdate = () => {
        if (!confirmUpdate) return;
        setData(data.map(item => item.id === confirmUpdate.id ? confirmUpdate : item));
        addAuditLog({
            user: user.name,
            action: "UPDATE",
            details: `Modification attribution ID: ${confirmUpdate.id} (${confirmUpdate.hardware})`
        });
        setEditingItem(null);
        setConfirmUpdate(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
                        <Database size={16} />
                        <span>Inventaire & Matériel</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Panneau de Contrôle</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Gérez les attributions de matériel aux utilisateurs.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    Ajouter Attribution
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <div className="card overflow-hidden !p-0">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Liste des Attributions</h2>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                            {data.length} Enregistrements
                        </span>
                    </div>

                    <div className="table-container !border-0 !rounded-none">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom Utilisateur</th>
                                    <th>Matériel</th>
                                    <th>Nombre</th>
                                    <th className="text-right px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="font-mono text-xs text-slate-400">{item.id}</td>
                                        <td>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                                        </td>
                                        <td>
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">{item.hardware}</span>
                                        </td>
                                        <td>
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-bold">
                                                {item.count}
                                            </span>
                                        </td>
                                        <td className="text-right px-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(item)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20">
                                            <div className="flex flex-col items-center text-slate-400">
                                                <AlertCircle size={48} className="mb-4 opacity-20" />
                                                <p className="italic text-lg">Aucune donnée disponible</p>
                                                <button
                                                    onClick={() => setIsAddModalOpen(true)}
                                                    className="mt-4 text-blue-600 hover:underline font-medium"
                                                >
                                                    Ajouter la première attribution
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Ajout */}
            {isAddModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <PlusCircle className="text-blue-600" />
                                Nouvelle Attribution
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nom de l'utilisateur</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: Babity Eisenhower"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Matériel</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: Souris, Clavier, PC..."
                                    value={newItem.hardware}
                                    onChange={(e) => setNewItem({ ...newItem, hardware: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nombre</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="1"
                                    value={newItem.count}
                                    onChange={(e) => setNewItem({ ...newItem, count: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary flex-1">
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Modification */}
            {editingItem && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <Pencil size={20} className="text-blue-600" />
                                Modifier l'attribution
                            </h3>
                            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={triggerUpdateConfirmation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nom Utilisateur</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Matériel</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editingItem.hardware}
                                    onChange={(e) => setEditingItem({ ...editingItem, hardware: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nombre</label>
                                <input
                                    type="number"
                                    className="input"
                                    min="1"
                                    value={editingItem.count}
                                    onChange={(e) => setEditingItem({ ...editingItem, count: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary flex-1">
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmation Suppression */}
            {confirmDelete && (
                <div className="modal-backdrop z-[60]">
                    <div className="modal-content !max-w-sm text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirmer la suppression</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Voulez-vous vraiment supprimer l'attribution de <strong>{confirmDelete.hardware}</strong> à <strong>{confirmDelete.name}</strong> ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="btn btn-secondary flex-1">Retour</button>
                            <button onClick={executeDelete} className="btn btn-primary bg-red-600 hover:bg-red-700 border-none flex-1">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmation Modification */}
            {confirmUpdate && (
                <div className="modal-backdrop z-[60]">
                    <div className="modal-content !max-w-sm text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirmer les changements</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Les modifications pour l'attribution ID: {confirmUpdate.id} vont être enregistrées. Continuer ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmUpdate(null)} className="btn btn-secondary flex-1">Retour</button>
                            <button onClick={executeUpdate} className="btn btn-primary flex-1">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
