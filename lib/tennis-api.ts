import { RankingsResponse, LiveMatchesResponse, RankingItem, LiveMatch } from './types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    throw new Error('RapidAPI Key or Host is missing from environment variables');
}

const BASE_URL = `https://${RAPIDAPI_HOST}`;

async function fetchFromAPI(endpoint: string, cacheTime: number = 60) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY!,
            'x-rapidapi-host': RAPIDAPI_HOST!,
        },
        next: { revalidate: cacheTime },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
}

export async function getATPRankings(): Promise<RankingItem[]> {
    try {
        const data: RankingsResponse = await fetchFromAPI('/api/tennis/rankings/atp', 3600); // 1 hour cache
        return data.rankings || [];
    } catch (error) {
        console.error("Error fetching rankings:", error);
        return [];
    }
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
    try {
        const data: LiveMatchesResponse = await fetchFromAPI('/api/tennis/events/live', 30); // 30 seconds cache
        return data.events || [];
    } catch (error) {
        console.error("Error fetching live matches:", error);
        return [];
    }
}
