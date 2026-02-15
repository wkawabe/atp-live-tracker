export interface Player {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    country: {
        alpha2: string;
        name: string;
    };
    ranking?: number;
}

export interface RankingItem {
    ranking: number;
    points: number;
    team: Player;
}

export interface RankingsResponse {
    rankings: RankingItem[];
}

export interface Score {
    current: number;
    display: number;
    period1?: number;
    period2?: number;
    period3?: number;
    period4?: number;
    period5?: number;
    point?: string;
}

export interface MatchTeam extends Player {
    seed?: string;
}

export interface LiveMatch {
    id: number;
    slug: string;
    tournament: {
        name: string;
        category: {
            name: string;
            flag: string;
        };
    };
    status: {
        code: number;
        description: string;
        type: string;
    };
    homeTeam: MatchTeam;
    awayTeam: MatchTeam;
    homeScore: Score;
    awayScore: Score;
}

export interface LiveMatchesResponse {
    events: LiveMatch[];
}
