const BASE_URL = "https://api-web.nhle.com/v1";

export interface PlayerProfile {
    playerId: number;
    firstName: { default: string };
    lastName: { default: string };
    sweaterNumber: number;
    position: string;
    headshot: string;
    heroImage: string;
    heightInInches: number;
    weightInPounds: number;
    birthDate: string;
    birthCity: { default: string };
    teamId?: number;
}

export async function getPlayerById(id: number): Promise<PlayerProfile> {
    const res = await fetch(`${BASE_URL}/player/${id}/landing`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch player data for ID: ${id}`);
    }

    return res.json();
}