import { getStandings } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

export default async function StandingsPage() {
    const teams = await getStandings();

    // Группируем команды по дивизионам
    const divisions: Record<string, typeof teams> = {
        "Metropolitan": teams.filter(t => t.divisionName === "Metropolitan"),
        "Atlantic": teams.filter(t => t.divisionName === "Atlantic"),
        "Central": teams.filter(t => t.divisionName === "Central"),
        "Pacific": teams.filter(t => t.divisionName === "Pacific"),
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-black uppercase tracking-widest text-white">Standings</h1>
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        ← Home
                    </Link>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {Object.entries(divisions).map(([divName, divTeams]) => (
                        <div key={divName} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                                <h2 className="text-xl font-bold uppercase tracking-wider text-blue-400">{divName} Division</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs font-mono">
                                    <tr>
                                        <th className="p-4 w-12">#</th>
                                        <th className="p-4">Team</th>
                                        <th className="p-4 text-center">GP</th>
                                        <th className="p-4 text-center">W</th>
                                        <th className="p-4 text-center">L</th>
                                        <th className="p-4 text-center">OT</th>
                                        <th className="p-4 text-center font-bold text-white">PTS</th>
                                        <th className="p-4 text-center hidden sm:table-cell">Diff</th>
                                        <th className="p-4 text-center hidden sm:table-cell">STRK</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                    {divTeams.map((team, index) => (
                                        <tr key={team.teamAbbrev.default} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-slate-500 font-mono">{index + 1}</td>
                                            <td className="p-4">
                                                <Link href={`/team/${team.teamAbbrev.default}`} className="flex items-center gap-3 group">
                                                    <div className="relative w-8 h-8 flex-shrink-0">
                                                        <Image src={team.teamLogo} alt={team.teamName.default} fill className="object-contain" />
                                                    </div>
                                                    <span className="font-bold group-hover:text-blue-400 transition-colors hidden sm:inline">
                                {team.teamName.default}
                            </span>
                                                    <span className="font-bold group-hover:text-blue-400 transition-colors sm:hidden">
                                {team.teamAbbrev.default}
                            </span>
                                                </Link>
                                            </td>
                                            <td className="p-4 text-center text-slate-400">{team.gamesPlayed}</td>
                                            <td className="p-4 text-center text-green-400 font-medium">{team.wins}</td>
                                            <td className="p-4 text-center text-red-400">{team.losses}</td>
                                            <td className="p-4 text-center text-slate-400">{team.otLosses}</td>
                                            <td className="p-4 text-center font-black text-xl text-white">{team.points}</td>
                                            <td className={`p-4 text-center font-mono hidden sm:table-cell ${team.goalDifferential > 0 ? "text-green-500" : "text-red-500"}`}>
                                                {team.goalDifferential > 0 ? "+" : ""}{team.goalDifferential}
                                            </td>
                                            <td className="p-4 text-center font-mono text-xs hidden sm:table-cell">
                            <span className={`px-2 py-1 rounded ${team.streakCode.startsWith('W') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                {team.streakCode}
                            </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}