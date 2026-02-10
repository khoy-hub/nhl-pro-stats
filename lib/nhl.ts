const BASE_URL = "https://api-web.nhle.com/v1";

// === ТИПЫ ДАННЫХ ===

// Профиль игрока
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
    featuredStats?: {
        season: number;
        regularSeason: {
            subSeason: {
                gamesPlayed: number;
                goals: number;
                assists: number;
                points: number;
                plusMinus: number;
                pim: number;
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

// Статистика полевого
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

// Статистика вратаря
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

// Турнирная таблица (расширенная)
export interface TeamStandings {
    teamName: { default: string };
    teamAbbrev: { default: string };
    teamLogo: string;
    divisionName: string;
    conferenceName: string;
    wins: number;
    losses: number;
    otLosses: number;
    points: number;
    gamesPlayed: number;
    goalDifferential: number;
    goalFor: number;
    goalAgainst: number;
    streakCode: string; // "W2", "L1" и т.д.
}

// Расписание игр
export interface GameSchedule {
    id: number;
    startTimeUTC: string;
    gameState: "FUT" | "PRE" | "LIVE" | "CRIT" | "FINAL" | "OFF"; // OFF = Final
    awayTeam: {
        abbrev: string;
        score?: number;
        logo: string;
    };
    homeTeam: {
        abbrev: string;
        score?: number;
        logo: string;
    };
}

export interface ScheduleResponse {
    currentDate: string;
    gameWeek: {
        date: string;
        dayAbbrev: string;
        numberOfGames: number;
        games: GameSchedule[];
    }[];
}

// === ФУНКЦИИ ===

// 1. Получаем таблицу (Standings)
export async function getStandings(): Promise<TeamStandings[]> {
    const res = await fetch(`${BASE_URL}/standings/now`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch standings");
    const data = await res.json();

    return data.standings.map((team: any) => ({
        teamName: team.teamName,
        teamAbbrev: team.teamAbbrev,
        teamLogo: team.teamLogo,
        divisionName: team.divisionName,
        conferenceName: team.conferenceName,
        wins: team.wins,
        losses: team.losses,
        otLosses: team.otLosses,
        points: team.points,
        gamesPlayed: team.gamesPlayed,
        goalDifferential: team.goalDifferential,
        goalFor: team.goalFor,
        goalAgainst: team.goalAgainst,
        streakCode: team.streakCode,
    }));
}

// 2. Получаем расписание (Schedule) на конкретную дату (или "now")
export async function getSchedule(date: string): Promise<ScheduleResponse> {
    const res = await fetch(`${BASE_URL}/schedule/${date}`, {
        next: { revalidate: 600 }, // кэшируем на 10 минут, так как игры идут лайв
    });
    if (!res.ok) throw new Error(`Failed to fetch schedule for ${date}`);
    return res.json();
}

// Обертки для совместимости
export async function getAllTeams() { return getStandings(); }

export async function getClubStats(teamAbbrev: string): Promise<ClubStats> {
    const res = await fetch(`${BASE_URL}/club-stats/${teamAbbrev}/now`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch stats for ${teamAbbrev}`);
    return res.json();
}

export async function getTeamRoster(teamAbbrev: string): Promise<TeamRoster> {
    const res = await fetch(`${BASE_URL}/roster/${teamAbbrev}/current`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch roster for ${teamAbbrev}`);
    return res.json();
}

export async function getPlayerById(id: number): Promise<PlayerProfile> {
    const res = await fetch(`${BASE_URL}/player/${id}/landing`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch player ${id}`);
    return res.json();
}