"use client";

import React from "react";
import { useToast } from "@/app/toast-context";
import { 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    AlertTriangle, 
    X,
    Trash2
} from "lucide-react";

export function ToastContainer() {
    const { toasts, hideToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 min-w-[350px] max-w-lg">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl shadow-2xl border animate-toast-down
                        ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100/50 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400" : ""}
                        ${toast.type === "danger" ? "bg-red-50 border-red-200 text-red-900 shadow-red-100/50 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400" : ""}
                        ${toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400" : ""}
                        ${toast.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400" : ""}
                        ${toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400" : ""}
                    `}
                >
                    <div className={`
                        shrink-0 p-2 rounded-xl
                        ${toast.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50" : ""}
                        ${toast.type === "danger" ? "bg-red-100 text-red-600 dark:bg-red-900/50" : ""}
                        ${toast.type === "error" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50" : ""}
                        ${toast.type === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50" : ""}
                        ${toast.type === "info" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50" : ""}
                    `}>
                        {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                        {toast.type === "danger" && <Trash2 className="w-5 h-5" />}
                        {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
                        {toast.type === "warning" && <AlertTriangle className="w-5 h-5" />}
                        {toast.type === "info" && <Info className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-grow font-bold text-sm tracking-tight">
                        {toast.message}
                    </div>

                    <button
                        onClick={() => hideToast(toast.id)}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <X className="w-4 h-4 opacity-40" />
                    </button>

                    <div className="toast-progress-bar" />
                </div>
            ))}
        </div>
    );
}
