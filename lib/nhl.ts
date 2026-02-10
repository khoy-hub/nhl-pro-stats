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