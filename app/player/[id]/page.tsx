import { getPlayerById } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const player = await getPlayerById(Number(id));

    // Безопасный доступ к статистике (на случай если это новичок без статы)
    const stats = player.featuredStats?.regularSeason.subSeason;
    const lastGames = player.last5Games || [];

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* --- HERO SECTION --- */}
            <div className="relative h-[60vh] w-full overflow-hidden flex items-end">
                {/* Фон (если есть heroImage - ставим его, иначе градиент) */}
                <div className="absolute inset-0 z-0">
                    {player.heroImage ? (
                        <Image
                            src={player.heroImage}
                            alt="Hero"
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}
                    {/* Градиент снизу, чтобы текст читался */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                {/* Контент поверх фона */}
                <div className="relative z-10 w-full max-w-7xl mx-auto p-8 flex flex-col md:flex-row items-end gap-8 pb-12">
                    {/* Аватарка в круге */}
                    <div className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 border-4 border-white/20 rounded-full bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-2xl">
                        <Image
                            src={player.headshot}
                            alt={player.lastName.default}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">
                            <span>#{player.sweaterNumber}</span>
                            <span>•</span>
                            <span>{player.position}</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter">
                            {player.firstName.default} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                {player.lastName.default}
              </span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* --- INFO & STATS GRID --- */}
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Левая колонка: Биография */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-slate-400 uppercase tracking-widest text-sm">Profile</h3>
                        <ul className="space-y-4 text-lg">
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Born</span>
                                <span>{player.birthDate}</span>
                            </li>
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">City</span>
                                <span>{player.birthCity.default}</span>
                            </li>
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Height</span>
                                <span>{player.heightInInches}"</span>
                            </li>
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Weight</span>
                                <span>{player.weightInPounds} lbs</span>
                            </li>
                        </ul>
                    </div>

                    <Link href="/" className="inline-block text-blue-400 hover:text-blue-300 transition-colors">
                        ← Back to Home
                    </Link>
                </div>

                {/* Правая колонка: Статистика */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Главные цифры сезона */}
                    {stats ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Games" value={stats.gamesPlayed} />
                            <StatCard label="Goals" value={stats.goals} highlight />
                            <StatCard label="Assists" value={stats.assists} />
                            <StatCard label="Points" value={stats.points} highlight />
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-900 rounded-xl text-slate-500">No stats available</div>
                    )}

                    {/* Таблица последних 5 игр */}
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-xl font-bold">Last 5 Games</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Opponent</th>
                                    <th className="p-4 text-center">G</th>
                                    <th className="p-4 text-center">A</th>
                                    <th className="p-4 text-center">PTS</th>
                                    <th className="p-4 text-right">Result</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                {lastGames.map((game, i) => (
                                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-mono">{game.gameDate}</td>
                                        <td className="p-4 flex items-center gap-2">
                                            <span className="font-bold">{game.opponentAbbrev}</span>
                                            <span className="text-xs text-slate-500">{game.homeRoadFlag === 'H' ? 'Home' : 'Away'}</span>
                                        </td>
                                        <td className="p-4 text-center font-bold text-slate-300">{game.goals}</td>
                                        <td className="p-4 text-center font-bold text-slate-300">{game.assists}</td>
                                        <td className="p-4 text-center font-black text-white">{game.points}</td>
                                        <td className="p-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            game.gameOutcome === 'W' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {game.gameOutcome}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Компонент для красивой карточки с цифрой
function StatCard({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-2xl border ${highlight ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/50 border-slate-800'}`}>
            <div className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-2">{label}</div>
            <div className={`text-4xl font-black ${highlight ? 'text-white' : 'text-slate-300'}`}>
                {value}
            </div>
        </div>
    )
}