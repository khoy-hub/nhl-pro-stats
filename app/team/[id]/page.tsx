import { getTeamRoster } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

// Словарик для расшифровки позиций
const positionMap: Record<string, string> = {
    C: "Center",
    L: "Left Wing",
    R: "Right Wing",
    D: "Defenseman",
    G: "Goalie",
};

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const teamAbbrev = id;
    const roster = await getTeamRoster(teamAbbrev);

    const allPlayers = [
        ...roster.forwards,
        ...roster.defensemen,
        ...roster.goalies,
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="text-slate-500 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors font-medium"
                >
                    ← Back to Teams
                </Link>

                <header className="mb-12 flex items-end justify-between border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">
                            {teamAbbrev}
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Roster 2025-2026</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {allPlayers.map((player) => (
                        <div
                            key={player.id}
                            className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300"
                        >
                            {/* Огромный номер на фоне справа */}
                            <div className="absolute -right-4 -bottom-6 text-[8rem] font-black text-slate-800/50 group-hover:text-slate-700/50 transition-colors z-0 select-none leading-none">
                                {player.sweaterNumber}
                            </div>

                            <div className="relative z-10 flex items-center gap-5">
                                {/* Фото игрока */}
                                <div className="relative w-20 h-20 flex-shrink-0 bg-slate-800 rounded-full border-2 border-slate-700 shadow-lg group-hover:border-blue-500/50 transition-colors">
                                    <Image
                                        src={player.headshot}
                                        alt={player.lastName.default}
                                        fill
                                        className="object-cover rounded-full p-1"
                                    />
                                </div>

                                {/* Инфо */}
                                <div>
                                    <h3 className="text-xl font-bold leading-tight">
                                        {player.firstName.default}
                                        <br />
                                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      {player.lastName.default}
                    </span>
                                    </h3>

                                    <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 uppercase tracking-wider">
                      {positionMap[player.positionCode] || player.positionCode}
                    </span>
                                        <span className="text-xs text-slate-500 font-mono">
                      {player.heightInInches}" / {player.weightInPounds} lbs
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}