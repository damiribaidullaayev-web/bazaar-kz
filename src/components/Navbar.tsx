"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-bold">
          Bazaar <span className="text-blue-400">KZ</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/listings" className="text-slate-300 hover:text-white transition-colors">
            Объявления
          </Link>

          {session ? (
            <>
              <Link href="/listings/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                + Подать объявление
              </Link>
              <Link href="/profile" className="text-slate-300 hover:text-white transition-colors">
                {session.user?.name}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-slate-400 hover:text-white transition-colors text-sm">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
                Войти
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}