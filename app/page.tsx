// Обрати внимание: теперь импортируем из @/lib/nhl
// Собачка (@) в Next.js обычно указывает на корень проекта
import { getPlayerById } from "@/lib/nhl";
import Image from "next/image";

export default async function Home() {
  const player = await getPlayerById(8471214); // Овечкин

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            NHL Pro Stats v0.1
          </p>
        </div>

        <div className="mt-10 relative flex place-items-center">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
            <Image
                src={player.headshot}
                alt={`${player.firstName.default} ${player.lastName.default}`}
                width={200}
                height={200}
                className="rounded-full mx-auto border-4 border-red-600 shadow-lg mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">
              {player.firstName.default} {player.lastName.default}
            </h1>
            <div className="text-6xl font-black text-red-500 mb-4">
              #{player.sweaterNumber}
            </div>
            <p className="text-slate-400 text-xl">
              {player.position} | {player.heightInInches} inches | {player.weightInPounds} lbs
            </p>
          </div>
        </div>
      </main>
  );
}