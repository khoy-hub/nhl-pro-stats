import { getClubStats, getTeamRoster } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Параллельный запуск запросов для ускорения загрузки
    const [statsData, rosterData] = await Promise.all([
        getClubStats(id),
        getTeamRoster(id)
    ]);

    // === МАГИЯ СЛИЯНИЯ ===
    // Создаем "Словарь номеров": { id_игрока: номер }
    const numberMap = new Map<number, number>();

    // Пробегаем по всем игрокам в ростере (нападающие, защитники, вратари) и запоминаем их номера
    [...rosterData.forwards, ...rosterData.defensemen, ...rosterData.goalies].forEach(p => {
        numberMap.set(p.id, p.sweaterNumber);
    });

    // Добавляем номера к статистике полевых игроков
    const skatersWithNumbers = statsData.skaters.map(player => ({
        ...player,
        sweaterNumber: numberMap.get(player.playerId) ?? 0 // Если номера нет, ставим 0
    }));

    // Добавляем номера к статистике вратарей
    const goaliesWithNumbers = statsData.goalies.map(player => ({
        ...player,
        sweaterNumber: numberMap.get(player.playerId) ?? 0
    }));

    // Сортируем полевых по очкам (от большего к меньшему)
    const sortedSkaters = skatersWithNumbers.sort((a, b) => b.points - a.points);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="text-slate-500 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors font-medium"
                >
                    ← Back to Teams
                </Link>

                <header className="mb-12 border-b border-slate-800 pb-6">
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">
                        {id}
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Season Statistics 2025-2026</p>
                </header>

                {/* --- GOALIES SECTION --- */}
                <h2 className="text-2xl font-bold mb-6 text-blue-400 uppercase tracking-widest">Goalies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {goaliesWithNumbers.map((player) => (
                        <Link
                            href={`/player/${player.playerId}`}
                            key={player.playerId}
                            className="block group"
                        >
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all overflow-hidden h-full">
                                {/* Номер на фоне */}
                                <div className="absolute top-0 right-4 text-7xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none">
                                    {player.sweaterNumber}
                                </div>

                                <div className="relative z-10 flex items-center gap-4 mt-2">
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={player.headshot}
                                            alt={player.lastName.default}
                                            fill
                                            className="object-cover rounded-full border-2 border-slate-700 bg-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-blue-300 transition-colors">
                                            {player.firstName.default} {player.lastName.default}
                                        </h3>
                                        <div className="text-sm text-slate-400 mt-1 flex gap-3">
                                            <div>
                                                <span className="text-green-400 font-mono font-bold">{player.savePercentage.toFixed(3)}</span> SV%
                                            </div>
                                            <div>
                                                <span className="font-mono text-white">{player.goalsAgainstAverage.toFixed(2)}</span> GAA
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* --- SKATERS SECTION --- */}
                <h2 className="text-2xl font-bold mb-6 text-red-400 uppercase tracking-widest">Skaters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedSkaters.map((player) => (
                        <Link
                            href={`/player/${player.playerId}`}
                            key={player.playerId}
                            className="block group"
                        >
                            <div
                                className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 h-full"
                            >
                                {/* Номер справа снизу */}
                                <div className="absolute -right-6 -bottom-8 text-[8rem] font-black text-white/5 group-hover:text-white/10 transition-colors z-0 select-none leading-none pointer-events-none">
                                    {player.sweaterNumber}
                                </div>

                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 flex-shrink-0 bg-slate-800 rounded-full border border-slate-700 overflow-hidden shadow-lg">
                                            <Image
                                                src={player.headshot}
                                                alt={player.lastName.default}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-0.5">{player.positionCode}</div>
                                            <h3 className="text-lg font-bold leading-tight group-hover:text-blue-200 transition-colors">
                                                {player.firstName.default} <br/>
                                                <span className="text-blue-400">{player.lastName.default}</span>
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Блок PTS */}
                                    <div className="text-right bg-slate-800/50 p-2 rounded-lg backdrop-blur-sm border border-slate-700/50">
                                        <div className="text-2xl font-black text-white">{player.points}</div>
                                        <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">PTS</div>
                                    </div>
                                </div>

                                {/* Нижняя полоска статистики */}
                                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex justify-between text-sm font-mono text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-bold text-lg">{player.goals}</span>
                                        <span className="text-[10px] uppercase">G</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-bold text-lg">{player.assists}</span>
                                        <span className="text-[10px] uppercase">A</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-bold text-lg">{player.gamesPlayed}</span>
                                        <span className="text-[10px] uppercase">GP</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                      <span className={`font-bold text-lg ${player.plusMinus >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {player.plusMinus > 0 ? "+" : ""}{player.plusMinus}
                      </span>
                                        <span className="text-[10px] uppercase">+/-</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}