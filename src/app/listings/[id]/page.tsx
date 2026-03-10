"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  ELECTRONICS: "Электроника",
  TRANSPORT: "Транспорт",
  REAL_ESTATE: "Недвижимость",
  JOBS: "Работа",
  SERVICES: "Услуги",
  CLOTHING: "Одежда",
  HOME: "Для дома",
  OTHER: "Другое",
};

export default function ListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    if (!confirm("Удалить объявление?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    router.push("/listings");
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Загрузка...</p>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Объявление не найдено</p>
    </div>
  );

  const isOwner = session?.user?.email && listing.author?.email === session.user.email;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/listings" className="text-slate-400 hover:text-white mb-6 inline-block">
          ← Назад к объявлениям
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          {/* Фото */}
          <div className="bg-slate-700 rounded-xl h-64 flex items-center justify-center mb-6">
            <span className="text-slate-500">Нет фото</span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">{listing.title}</h1>
            {isOwner && (
              <button onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors text-sm">
                Удалить
              </button>
            )}
          </div>

          <p className="text-blue-400 font-bold text-3xl mb-6">
            {listing.price?.toLocaleString()} ₸
          </p>

          <p className="text-slate-300 leading-relaxed mb-8">{listing.description}</p>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6">
            <div>
              <p className="text-slate-500 text-sm">Город</p>
              <p className="text-white">{listing.city}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Категория</p>
              <p className="text-white">{listing.category}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Продавец</p>
              <p className="text-white">{listing.author?.name}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Дата</p>
              <p className="text-white">
                {new Date(listing.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}