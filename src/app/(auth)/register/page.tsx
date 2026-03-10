"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка регистрации");
    }
    setLoading(false);
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-600">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Имя" required
            className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" placeholder="Email" required
            className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" placeholder="Пароль" required
            className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-semibold transition-colors">
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-400">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}