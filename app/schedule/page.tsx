import { getSchedule } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// Вспомогательная функция для форматирования даты YYYY-MM-DD
function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

export default async function SchedulePage({
                                               searchParams,
                                           }: {
    searchParams: Promise<{ date?: string }>;
}) {
    const params = await searchParams;

    // Если дата не выбрана, берем "сегодня" (по UTC)
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = params.date || today;

    // Запрашиваем данные у NHL
    const scheduleData = await getSchedule(selectedDate);

    // NHL API возвращает неделю, нам нужно найти именно тот день, который мы запросили
    const currentDayData = scheduleData.gameWeek.find(day => day.date === selectedDate);
    const games = currentDayData?.games || [];

    // Вычисляем предыдущий и следующий день для навигации
    const curr = new Date(selectedDate);
    const prev = new Date(curr); prev.setDate(curr.getDate() - 1);
    const next = new Date(curr); next.setDate(curr.getDate() + 1);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Хедер с навигацией */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        ← Home
                    </Link>

                    <div className="flex items-center gap-6 bg-slate-900 p-2 rounded-full border border-slate-800">
                        <Link href={`/schedule?date=${formatDate(prev)}`} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            ←
                        </Link>
                        <h1 className="text-lg font-mono font-bold w-32 text-center">
                            {selectedDate}
                        </h1>
                        <Link href={`/schedule?date=${formatDate(next)}`} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            →
                        </Link>
                    </div>

                    <div className="w-20 hidden md:block"></div> {/* Spacer для центровки */}
                </div>

                {/* Список игр */}
                <div className="space-y-4">
                    {games.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 text-xl">
                            No games scheduled for this date.
                        </div>
                    ) : (
                        games.map((game) => (
                            <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all">
                                <div className="flex items-center justify-between">

                                    {/* AWAY TEAM */}
                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <Link href={`/team/${game.awayTeam.abbrev}`} className="relative w-16 h-16 hover:scale-110 transition-transform">
                                            <Image src={game.awayTeam.logo} alt={game.awayTeam.abbrev} fill className="object-contain" />
                                        </Link>
                                        <div className="text-xl font-bold">{game.awayTeam.abbrev}</div>
                                    </div>

                                    {/* SCORE BOARD */}
                                    <div className="flex flex-col items-center px-4 w-32 md:w-48">
                                        {game.gameState === "FUT" || game.gameState === "PRE" ? (
                                            <div className="bg-slate-800 px-4 py-2 rounded text-sm text-slate-300 font-mono">
                                                {new Date(game.startTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4 text-4xl font-black font-mono">
                            <span className={game.awayTeam.score! > game.homeTeam.score! ? "text-white" : "text-slate-500"}>
                                {game.awayTeam.score}
                            </span>
                                                <span className="text-slate-700">:</span>
                                                <span className={game.homeTeam.score! > game.awayTeam.score! ? "text-white" : "text-slate-500"}>
                                {game.homeTeam.score}
                            </span>
                                            </div>
                                        )}
                                        <div className="mt-2 text-xs uppercase text-slate-500 font-bold tracking-widest">
                                            {game.gameState === "OFF" || game.gameState === "FINAL" ? "FINAL" :
                                                game.gameState === "LIVE" || game.gameState === "CRIT" ? "LIVE" : "VS"}
                                        </div>
                                    </div>

                                    {/* HOME TEAM */}
                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <Link href={`/team/${game.homeTeam.abbrev}`} className="relative w-16 h-16 hover:scale-110 transition-transform">
                                            <Image src={game.homeTeam.logo} alt={game.homeTeam.abbrev} fill className="object-contain" />
                                        </Link>
                                        <div className="text-xl font-bold">{game.homeTeam.abbrev}</div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}