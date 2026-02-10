import { getTeamRoster } from "@/lib/nhl";
import Image from "next/image";

export default async function Home() {
    // Запрашиваем состав Вашингтона (WSH)
    const roster = await getTeamRoster("WSH");

    // Объединяем всех в один массив для простоты отображения,
    // но можно и разделять по секциям
    const allPlayers = [
        ...roster.forwards,
        ...roster.defensemen,
        ...roster.goalies,
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                        Washington Capitals
                    </h1>
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-sm text-slate-400">
            Season 2025-2026
          </span>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allPlayers.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors"
                        >
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                    src={player.headshot}
                                    alt={player.lastName.default}
                                    fill
                                    className="object-contain rounded-full bg-slate-800"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    {player.firstName.default} {player.lastName.default}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-white font-mono bg-red-900/30 px-2 py-0.5 rounded text-xs border border-red-900/50">
                    #{player.sweaterNumber}
                  </span>
                                    <span>{player.positionCode}</span>
                                    <span>
                    {player.heightInInches}" / {player.weightInPounds} lbs
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}