const BASE_URL = "https://api-web.nhle.com/v1";

// === ТИПЫ ДАННЫХ ===

// 1. Профиль игрока (Личная страница)
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
    birthCountry: string; // <--- НОВОЕ ПОЛЕ (для флага)
    teamId?: number;

    // Статистика сезона (объединяем поля полевого и вратаря через ?)
    featuredStats?: {
        season: number;
        regularSeason: {
            subSeason: {
                gamesPlayed: number;
                // Полевые игроки
                goals: number;
                assists: number;
                points: number;
                plusMinus: number;
                pim: number;
                gameWinningGoals: number;
                // Вратари (опционально)
                wins?: number;
                losses?: number;
                otLosses?: number;
                savePctg?: number;
                goalsAgainstAvg?: number;
                shutouts?: number;
            };
        };
    };

    // Последние 5 игр
    last5Games?: {
        gameDate: string;
        opponentAbbrev: string;
        homeRoadFlag: "H" | "R";
        gameOutcome: "W" | "L" | "OTL";

        // Полевые
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;

        // Вратари (опционально)
        shotsAgainst?: number;
        goalsAgainst?: number;
        savePctg?: number;
    }[];
}

// 2. Статистика полевого (для списка команды)
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

// 3. Статистика вратаря (для списка команды)
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

// 4. Состав (Roster)
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

// 5. Турнирная таблица (Standings)
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
    streakCode: string;
}

// 6. Расписание (Schedule)
export interface GameSchedule {
    id: number;
    startTimeUTC: string;
    gameState: "FUT" | "PRE" | "LIVE" | "CRIT" | "FINAL" | "OFF";
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

export async function getStandings(): Promise<TeamStandings[]> {
    const res = await fetch(`${BASE_URL}/standings/now`, { next: { revalidate: 3600 } });
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

export async function getSchedule(date: string): Promise<ScheduleResponse> {
    const res = await fetch(`${BASE_URL}/schedule/${date}`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Failed to fetch schedule for ${date}`);
    return res.json();
}

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