"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const categories = [
  { label: "Все", value: "" },
  { label: "Электроника", value: "ELECTRONICS" },
  { label: "Транспорт", value: "TRANSPORT" },
  { label: "Недвижимость", value: "REAL_ESTATE" },
  { label: "Работа", value: "JOBS" },
  { label: "Услуги", value: "SERVICES" },
  { label: "Одежда", value: "CLOTHING" },
  { label: "Для дома", value: "HOME" },
  { label: "Другое", value: "OTHER" },
];

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  async function fetchListings() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    const res = await fetch(`/api/listings?${params.toString()}`);
    const data = await res.json();
    setListings(data.listings || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchListings();
  }, [category]);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Объявления</h1>

        {/* Поиск */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchListings()}
            className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={fetchListings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            Найти
          </button>
        </div>

        {/* Категории */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Список объявлений */}
        {loading ? (
          <div className="text-slate-400 text-center py-20">Загрузка...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">Объявлений пока нет</p>
            <Link href="/listings/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors">
              Подать первое объявление
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-all cursor-pointer">
{listing.images && listing.images.length > 0 ? (
  <img src={listing.images[0]} alt={listing.title}
    className="w-full h-40 object-cover rounded-lg mb-4" />
) : (
  <div className="bg-slate-700 rounded-lg h-40 mb-4 flex items-center justify-center">
    <span className="text-slate-500 text-sm">Нет фото</span>
  </div>
)}
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">{listing.title}</h3>
                  <p className="text-blue-400 font-bold text-xl mb-2">
                    {listing.price.toLocaleString()} ₸
                  </p>
                  <p className="text-slate-400 text-sm">{listing.city}</p>
                  <p className="text-slate-500 text-xs mt-1">{listing.author?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}