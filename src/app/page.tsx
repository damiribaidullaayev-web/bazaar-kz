import Link from "next/link";

const categories = [
  { label: "Электроника", value: "ELECTRONICS", emoji: "📱" },
  { label: "Транспорт", value: "TRANSPORT", emoji: "🚗" },
  { label: "Недвижимость", value: "REAL_ESTATE", emoji: "🏠" },
  { label: "Работа", value: "JOBS", emoji: "💼" },
  { label: "Услуги", value: "SERVICES", emoji: "🔧" },
  { label: "Одежда", value: "CLOTHING", emoji: "👗" },
  { label: "Для дома", value: "HOME", emoji: "🛋️" },
  { label: "Другое", value: "OTHER", emoji: "📦" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Купи и продай всё что угодно
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Бесплатная доска объявлений Казахстана
          </p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Поиск объявлений..."
              className="flex-1 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link href="/listings"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold">
              Найти
            </Link>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/listings?category=${cat.value}`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-slate-700 transition-all group"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                {cat.label}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Хочешь продать что-то?
          </h3>
          <p className="text-slate-400 mb-6">
            Подай объявление бесплатно за 2 минуты
          </p>
          <Link href="/listings/create"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold inline-block">
            Подать объявление
          </Link>
        </div>
      </div>
    </div>
  );
}