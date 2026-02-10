const BASE_URL = "https://api-web.nhle.com/v1";

// === ТИПЫ ДАННЫХ ===

export interface PlayerProfile {
    playerId: number;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    position: string;
    headshot: string;
    heroImage?: string;
    heightInInches: number;
    weightInPounds: number;
    birthDate: string;
    birthCity: { default: string };
    teamId?: number;
}

export interface RosterPlayer {
    id: number;
    headshot: string;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    positionCode: string;
    shootsCatches: string;
    heightInInches: number;
    weightInPounds: number;
    birthDate: string;
    birthCity: { default: string };
}

export interface TeamRoster {
    forwards: RosterPlayer[];
    defensemen: RosterPlayer[];
    goalies: RosterPlayer[];
}

// === ФУНКЦИИ ===

export async function getPlayerById(id: number): Promise<PlayerProfile> {
    const res = await fetch(`${BASE_URL}/player/${id}/landing`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch player ${id}`);
    return res.json();
}

export async function getTeamRoster(teamAbbrev: string): Promise<TeamRoster> {
    // WSH = Washington, TOR = Toronto, etc.
    const res = await fetch(`${BASE_URL}/roster/${teamAbbrev}/current`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch roster for ${teamAbbrev}`);
    return res.json();
}


export interface TeamStandings {
    teamName: { default: string };
    teamAbbrev: { default: string };
    teamLogo: string;
    wins: number;
    losses: number;
    otLosses: number;
    points: number;
}

// ... (старые функции getPlayerById и getTeamRoster оставляем)

// НОВАЯ ФУНКЦИЯ: Получаем таблицу (и список команд заодно)
export async function getAllTeams(): Promise<TeamStandings[]> {
    const res = await fetch(`${BASE_URL}/standings/now`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch standings");

    const data = await res.json();

    // API возвращает данные странно, нам нужно вытащить только список команд
    // Обычно они лежат в standings -> и там массив.
    // Но структура НХЛ сложная, давай упростим её:
    return data.standings.map((team: any) => ({
        teamName: team.teamName,
        teamAbbrev: team.teamAbbrev,
        teamLogo: team.teamLogo,
        wins: team.wins,
        losses: team.losses,
        otLosses: team.otLosses,
        points: team.points,
    }));
}