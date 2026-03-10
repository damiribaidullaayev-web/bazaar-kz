"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profile/listings")
        .then((res) => res.json())
        .then((data) => {
          setListings(data.listings || []);
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Загрузка...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Профиль */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
              <p className="text-slate-400 mt-1">{session?.user?.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm">
              Выйти
            </button>
          </div>
        </div>

        {/* Мои объявления */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Мои объявления</h2>
          <Link href="/listings/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm">
            + Новое объявление
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400">Загрузка...</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-xl">
            <p className="text-slate-400 mb-4">У вас пока нет объявлений</p>
            <Link href="/listings/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors">
              Подать первое объявление
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-all">
                  <h3 className="text-white font-semibold truncate mb-1">{listing.title}</h3>
                  <p className="text-blue-400 font-bold">{listing.price.toLocaleString()} ₸</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-500 text-sm">{listing.city}</span>
                    <span className="text-slate-500 text-sm">{categoryLabels[listing.category]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}