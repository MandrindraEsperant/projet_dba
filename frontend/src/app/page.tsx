import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestion d'Audit
          </span>
          <br /> Sécurisée
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Un système de supervision haute performance incluant la journalisation d'audit en temps réel et des interfaces de base de données intuitives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <Link
          href="/user"
          className="group relative p-8 card bg-white hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="mb-4 h-12 w-12 rounded-lg bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Interface Utilisateur</h3>
          <p className="text-gray-500">Effectuez des actions CRUD. Chaque action est automatiquement tracée dans le journal d'audit.</p>
          <div className="mt-6 font-semibold text-blue-600 flex items-center gap-2">
            Entrer sur le Panel
            <span>&rarr;</span>
          </div>
        </Link>

        <Link
          href="/admin"
          className="group relative p-8 card bg-zinc-900 border-zinc-800 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="mb-4 h-12 w-12 rounded-lg bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Panel Administrateur</h3>
          <p className="text-zinc-400">Supervisez les activités des utilisateurs et parcourez les journaux complets des transactions SQL.</p>
          <div className="mt-6 font-semibold text-indigo-400 flex items-center gap-2">
            Surveiller le Système
            <span>&rarr;</span>
          </div>
        </Link>
      </div>

      <div className="pt-12 text-sm text-gray-400 font-mono">
        v1.1.0-secure // système opérationnel
      </div>
    </div>
  );
}
