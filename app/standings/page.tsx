import { getStandings, TeamStandings } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

export default async function StandingsPage() {
    const teams = await getStandings();

    // 1. Делим на Конференции
    const easternConf = teams.filter((t) => t.conferenceName === "Eastern");
    const westernConf = teams.filter((t) => t.conferenceName === "Western");

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-black uppercase tracking-widest text-white">
                        NHL Standings <span className="text-blue-500 text-lg align-top">Wild Card</span>
                    </h1>
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        ← Home
                    </Link>
                </header>

                {/* --- EASTERN CONFERENCE --- */}
                <ConferenceBlock title="Eastern Conference" teams={easternConf} divisions={["Atlantic", "Metropolitan"]} />

                <div className="h-12"></div>

                {/* --- WESTERN CONFERENCE --- */}
                <ConferenceBlock title="Western Conference" teams={westernConf} divisions={["Central", "Pacific"]} />
            </div>
        </main>
    );
}

// === КОМПОНЕНТ ДЛЯ КОНФЕРЕНЦИИ ===
function ConferenceBlock({ title, teams, divisions }: { title: string, teams: TeamStandings[], divisions: string[] }) {
    // Сортировка по очкам (desc) -> победам -> разнице шайб
    const sortFn = (a: TeamStandings, b: TeamStandings) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.goalDifferential - a.goalDifferential;
    };

    // Собираем Топ-3 для каждого дивизиона
    const div1Teams = teams.filter(t => t.divisionName === divisions[0]).sort(sortFn);
    const div2Teams = teams.filter(t => t.divisionName === divisions[1]).sort(sortFn);

    const top3_Div1 = div1Teams.slice(0, 3);
    const top3_Div2 = div2Teams.slice(0, 3);

    // Собираем Wild Card (все остальные)
    const rest_Div1 = div1Teams.slice(3);
    const rest_Div2 = div2Teams.slice(3);

    // Объединяем "остальных" и сортируем их вместе для Wild Card гонки
    const wildCardTeams = [...rest_Div1, ...rest_Div2].sort(sortFn);

    return (
        <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase text-slate-700 border-b border-slate-800 pb-2">{title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Левый Дивизион */}
                <StandingsTable title={divisions[0]} teams={top3_Div1} />

                {/* Правый Дивизион */}
                <StandingsTable title={divisions[1]} teams={top3_Div2} />
            </div>

            {/* Wild Card Таблица (на всю ширину) */}
            <StandingsTable title="Wild Card" teams={wildCardTeams} isWildCard />
        </section>
    )
}

// === КОМПОНЕНТ ТАБЛИЦЫ ===
function StandingsTable({ title, teams, isWildCard = false }: { title: string, teams: TeamStandings[], isWildCard?: boolean }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className={`text-lg font-bold uppercase tracking-wider ${isWildCard ? "text-orange-400" : "text-blue-400"}`}>
                    {title}
                </h3>
                {isWildCard && <span className="text-xs text-slate-400 uppercase font-mono">Top 2 Qualify</span>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950/30 text-slate-500 uppercase text-[10px] font-mono tracking-wider">
                    <tr>
                        <th className="p-3 w-8">#</th>
                        <th className="p-3">Team</th>
                        <th className="p-3 text-center" title="Games Played">GP</th>
                        <th className="p-3 text-center text-white" title="Wins">W</th>
                        <th className="p-3 text-center" title="Losses">L</th>
                        <th className="p-3 text-center" title="OT Losses">OT</th>
                        <th className="p-3 text-center font-bold text-white text-base" title="Points">PTS</th>
                        <th className="p-3 text-center hidden sm:table-cell" title="Goals For">GF</th>
                        <th className="p-3 text-center hidden sm:table-cell" title="Goals Against">GA</th>
                        <th className="p-3 text-center hidden sm:table-cell" title="Difference">Diff</th>
                        <th className="p-3 text-center hidden sm:table-cell" title="Streak">Strk</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {teams.map((team, index) => {
                        // Линия отсечения плей-офф для Wild Card (после 2-го места)
                        const isPlayoffLine = isWildCard && index === 1;

                        return (
                            <tr key={team.teamAbbrev.default} className={`transition-colors group ${
                                isPlayoffLine ? "border-b-2 border-orange-500/50" : ""
                            } hover:bg-slate-800/50`}>
                                <td className="p-3 text-slate-500 font-mono text-xs">
                                    {isWildCard && index > 1 ? <span className="text-slate-700">{index + 1}</span> : <span className="text-white">{index + 1}</span>}
                                </td>
                                <td className="p-3">
                                    <Link href={`/team/${team.teamAbbrev.default}`} className="flex items-center gap-3">
                                        <div className="relative w-6 h-6 flex-shrink-0 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                            <Image src={team.teamLogo} alt={team.teamName.default} fill className="object-contain" />
                                        </div>
                                        <span className="font-bold text-slate-300 group-hover:text-blue-400 transition-colors hidden sm:inline truncate max-w-[120px]">
                                                {team.teamName.default}
                                            </span>
                                        <span className="font-bold text-slate-300 group-hover:text-blue-400 transition-colors sm:hidden">
                                                {team.teamAbbrev.default}
                                            </span>
                                        {/* Маркер зоны плей-офф */}
                                        {(!isWildCard || index < 2) && (
                                            <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-500 ml-auto hidden md:inline-block">
                                                    x
                                                </span>
                                        )}
                                    </Link>
                                </td>
                                <td className="p-3 text-center text-slate-400 font-mono">{team.gamesPlayed}</td>
                                <td className="p-3 text-center text-green-400 font-mono font-bold">{team.wins}</td>
                                <td className="p-3 text-center text-slate-400 font-mono">{team.losses}</td>
                                <td className="p-3 text-center text-slate-400 font-mono">{team.otLosses}</td>
                                <td className="p-3 text-center font-black text-lg text-white bg-slate-800/30 rounded">{team.points}</td>
                                <td className="p-3 text-center hidden sm:table-cell font-mono text-slate-300">{team.goalFor}</td>
                                <td className="p-3 text-center hidden sm:table-cell font-mono text-slate-400">{team.goalAgainst}</td>
                                <td className={`p-3 text-center font-mono hidden sm:table-cell ${team.goalDifferential > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {team.goalDifferential > 0 ? "+" : ""}{team.goalDifferential}
                                </td>
                                <td className="p-3 text-center font-mono text-xs hidden sm:table-cell">
                                        <span className={`px-1.5 py-0.5 rounded ${team.streakCode.startsWith('W') ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                                            {team.streakCode}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}