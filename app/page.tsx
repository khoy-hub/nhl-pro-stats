import { getAllTeams } from "@/lib/nhl";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const teams = await getAllTeams();

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-widest text-slate-700">
                    National Hockey League
                </h1>

                <div className="flex justify-center gap-4 mb-12">
                    <Link href="/standings" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold uppercase tracking-widest text-sm transition-colors border border-slate-700">
                        🏆 Standings
                    </Link>
                    <Link href="/schedule" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold uppercase tracking-widest text-sm transition-colors border border-slate-700">
                        📅 Schedule
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {teams.map((team) => (
                        <Link
                            href={`/team/${team.teamAbbrev.default}`}
                            key={team.teamAbbrev.default}
                            className="group relative flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition-all duration-300"
                        >
                            <div className="relative w-24 h-24 mb-4 transform group-hover:scale-110 transition-transform">
                                <Image
                                    src={team.teamLogo}
                                    alt={team.teamName.default}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="font-bold text-center text-sm group-hover:text-blue-400 transition-colors">
                                {team.teamName.default}
                            </div>
                            <div className="mt-2 text-xs text-slate-500 font-mono">
                                {team.points} pts
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}