"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/app/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AuditSys
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-4">
                {(user.role === "user" || user.role === "admin") && (
                  <Link href="/user" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium">
                    Panel Utilisateur
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium">
                    Audit Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                  title="Déconnexion"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary text-sm py-1.5">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
         <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-500 bg-gray-50">
  &copy; {new Date().getFullYear()} AuditSystem Pro - Créé par Mandrindra, Andronique, Eisenhwoher et Fitahiana avec <span className="font-semibold">Next.js</span>
</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
