const BASE_URL = "https://api-web.nhle.com/v1";

// === ТИПЫ ДАННЫХ ===

export interface PlayerProfile {
    playerId: number;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    position: string;
    headshot: string;
    heroImage?: string; // Большая красивая фотка
    heightInInches: number;
    weightInPounds: number;
    birthDate: string;
    birthCity: { default: string };
    teamId?: number;

    // Новые данные для личной страницы
    featuredStats?: {
        season: number;
        regularSeason: {
            subSeason: {
                gamesPlayed: number;
                goals: number;
                assists: number;
                points: number;
                plusMinus: number;
                pim: number; // штрафные минуты
                gameWinningGoals: number;
            };
        };
    };
    last5Games?: {
        gameDate: string;
        opponentAbbrev: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        homeRoadFlag: "H" | "R";
        gameOutcome: "W" | "L" | "OTL";
    }[];
}

// Статистика полевого игрока (ВОТ ОНА БЫЛА ПОТЕРЯНА)
export interface SkaterStats {
    playerId: number;
    headshot: string;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    positionCode: string;
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
}

export interface GoalieStats {
    playerId: number;
    headshot: string;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    positionCode: string;
    gamesPlayed: number;
    wins: number;
    losses: number;
    goalsAgainstAverage: number;
    savePercentage: number;
}

export interface ClubStats {
    skaters: SkaterStats[];
    goalies: GoalieStats[];
}

// Для состава (нужен, чтобы взять номера, если их нет в статистике)
export interface RosterPlayer {
    id: number;
    headshot: string;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    positionCode: string;
}

export interface TeamRoster {
    forwards: RosterPlayer[];
    defensemen: RosterPlayer[];
    goalies: RosterPlayer[];
}

// Для таблицы команд
export interface TeamStandings {
    teamName: { default: string };
    teamAbbrev: { default: string };
    teamLogo: string;
    wins: number;
    losses: number;
    otLosses: number;
    points: number;
}

// === ФУНКЦИИ ===

// 1. Получаем список всех команд (Главная страница)
export async function getAllTeams(): Promise<TeamStandings[]> {
    const res = await fetch(`${BASE_URL}/standings/now`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch standings");
    const data = await res.json();

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

// 2. Получаем полную статистику (Страница команды - очки)
export async function getClubStats(teamAbbrev: string): Promise<ClubStats> {
    const res = await fetch(`${BASE_URL}/club-stats/${teamAbbrev}/now`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch stats for ${teamAbbrev}`);
    return res.json();
}

// 3. Получаем состав (Страница команды - номера джерси)
export async function getTeamRoster(teamAbbrev: string): Promise<TeamRoster> {
    const res = await fetch(`${BASE_URL}/roster/${teamAbbrev}/current`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch roster for ${teamAbbrev}`);
    return res.json();
}

// 4. Получаем данные одного игрока (на будущее)
export async function getPlayerById(id: number): Promise<PlayerProfile> {
    const res = await fetch(`${BASE_URL}/player/${id}/landing`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch player ${id}`);
    return res.json();
}