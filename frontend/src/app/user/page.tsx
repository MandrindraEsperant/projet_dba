"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { Product } from "@/types";
import { apiService } from "@/services/api.service";
import { Modal } from "@/components/Modal";
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash,
    AlertTriangle,
    X,
    Database,
    Pencil,
    Trash2,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

export default function UserPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [newItem, setNewItem] = useState<Omit<Product, 'id'>>({ nom: "", prix: 0, stock: 0 });
    const [editingItem, setEditingItem] = useState<Product | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Confirmation States
    const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
    const [confirmUpdate, setConfirmUpdate] = useState<Product | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await apiService.getProducts();
            setData(result);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    if (authLoading || isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Chargement du panneau...</p>
        </div>
    );

    if (!user) return null;

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.nom) return;

        try {
            await apiService.addProduct(newItem);
            fetchData();
            setNewItem({ nom: "", prix: 0, stock: 0 });
            setIsAddModalOpen(false);
        } catch (error: any) {
            console.error("Add Error:", error);
            alert(error.message || "Action refusée : Vous n'avez pas les droits nécessaires.");
        }
    };

    const executeDelete = async () => {
        if (!confirmDelete) return;
        try {
            await apiService.deleteProduct(confirmDelete.id);
            fetchData();
            setConfirmDelete(null);
        } catch (error: any) {
            console.error("Delete Error:", error);
            alert(error.message || "Action refusée : Vous n'avez pas les droits nécessaires.");
            setConfirmDelete(null);
        }
    };

    const triggerUpdateConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setConfirmUpdate(editingItem);
        }
    };

    const executeUpdate = async () => {
        if (!confirmUpdate) return;
        try {
            await apiService.updateProduct(confirmUpdate.id, confirmUpdate);
            fetchData();
            setEditingItem(null);
            setConfirmUpdate(null);
        } catch (error: any) {
            console.error("Update Error:", error);
            alert(error.message || "Action refusée : Vous n'avez pas les droits nécessaires.");
            setConfirmUpdate(null);
        }
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
                {(user.role === 'admin' || (user.permissions?.some(p => p === 'INSERT' || p === 'ALL'))) && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        Ajouter Attribution
                    </button>
                )}
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
                                    <th>Nom du Produit</th>
                                    <th>Prix</th>
                                    <th>Stock</th>
                                    <th className="text-right px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="font-mono text-xs text-slate-400">{item.id}</td>
                                        <td>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.nom}</span>
                                        </td>
                                        <td>
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">{item.prix} €</span>
                                        </td>
                                        <td>
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-bold">
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td className="text-right px-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(user.role === 'admin' || (user.permissions?.some(p => p === 'UPDATE' || p === 'ALL'))) && (
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                )}
                                                {(user.role === 'admin' || (user.permissions?.some(p => p === 'DELETE' || p === 'ALL'))) && (
                                                    <button
                                                        onClick={() => setConfirmDelete(item)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
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
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Nouvelle Attribution"
            >
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nom du produit</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ex: Clavier Mécanique"
                            value={newItem.nom}
                            onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Prix</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input"
                            placeholder="0.00"
                            value={newItem.prix}
                            onChange={(e) => setNewItem({ ...newItem, prix: parseFloat(e.target.value) || 0 })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Stock</label>
                        <input
                            type="number"
                            className="input"
                            min="0"
                            value={newItem.stock}
                            onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
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
            </Modal>

            {/* Modal Modification */}
            <Modal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                title="Modifier l'attribution"
            >
                {editingItem && (
                    <form onSubmit={triggerUpdateConfirmation} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Nom du Produit</label>
                            <input
                                type="text"
                                className="input"
                                value={editingItem.nom}
                                onChange={(e) => setEditingItem({ ...editingItem, nom: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Prix</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={editingItem.prix}
                                onChange={(e) => setEditingItem({ ...editingItem, prix: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Stock</label>
                            <input
                                type="number"
                                className="input"
                                min="0"
                                value={editingItem.stock}
                                onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
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
                )}
            </Modal>

            {/* Confirmation Suppression */}
            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Confirmer la suppression"
            >
                {confirmDelete && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Voulez-vous vraiment supprimer le produit <strong>{confirmDelete.nom}</strong> ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="btn btn-secondary flex-1">Retour</button>
                            <button onClick={executeDelete} className="btn btn-primary bg-red-600 hover:bg-red-700 border-none flex-1">Supprimer</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirmation Modification */}
            <Modal
                isOpen={!!confirmUpdate}
                onClose={() => setConfirmUpdate(null)}
                title="Confirmer les changements"
            >
                {confirmUpdate && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Les modifications pour l'attribution ID: {confirmUpdate.id} vont être enregistrées. Continuer ?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmUpdate(null)} className="btn btn-secondary flex-1">Retour</button>
                            <button onClick={executeUpdate} className="btn btn-primary flex-1">Confirmer</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
