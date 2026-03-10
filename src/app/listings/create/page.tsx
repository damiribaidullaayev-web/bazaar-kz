"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const categories = [
  { label: "Электроника", value: "ELECTRONICS" },
  { label: "Транспорт", value: "TRANSPORT" },
  { label: "Недвижимость", value: "REAL_ESTATE" },
  { label: "Работа", value: "JOBS" },
  { label: "Услуги", value: "SERVICES" },
  { label: "Одежда", value: "CLOTHING" },
  { label: "Для дома", value: "HOME" },
  { label: "Другое", value: "OTHER" },
];

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Нужно войти чтобы подать объявление</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const city = (form.elements.namedItem("city") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price, city, category }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/listings/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Новое объявление</h1>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Заголовок</label>
              <input name="title" type="text" required placeholder="Например: iPhone 13 Pro Max"
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Описание</label>
              <textarea name="description" required rows={4} placeholder="Опишите товар подробно..."
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">Цена (₸)</label>
                <input name="price" type="number" required min="0" placeholder="50000"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-2 block">Город</label>
                <input name="city" type="text" required placeholder="Алматы"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Категория</label>
              <select name="category" required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-semibold transition-colors">
              {loading ? "Публикация..." : "Опубликовать объявление"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}