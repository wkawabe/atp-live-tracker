import { getATPRankings, getLiveMatches } from '@/lib/tennis-api';
import { LiveMatch, RankingItem } from '@/lib/types';

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
    const [rankings, liveMatches] = await Promise.all([
        getATPRankings(),
        getLiveMatches(),
    ]);

    // Create a Map of Player ID -> Live Match for efficient lookup
    const liveMatchMap = new Map<number, LiveMatch>();

    for (const match of liveMatches) {
        // Map both home and away players to the match
        liveMatchMap.set(match.homeTeam.id, match);
        liveMatchMap.set(match.awayTeam.id, match);

        // Also map subTeams if they exist (for doubles, though rankings are usually singles)
        // The API structure for rankings vs match players needs to be consistent.
    }

    // Filter to Top 100 and map status
    const playerStatuses = rankings
        .filter((r) => r.ranking <= 100)
        .map((r) => {
            const liveMatch = liveMatchMap.get(r.team.id);
            return {
                ...r,
                isLive: !!liveMatch,
                match: liveMatch
            };
        });

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 font-sans">
            <header className="mb-8 p-4 border-b border-gray-800 sticky top-0 bg-gray-950/90 backdrop-blur z-10">
                <h1 className="text-2xl font-bold text-center text-green-400 tracking-tight">
                    ATP Top 100 Live Tracker
                </h1>
                <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2 font-mono">
                    <span>Live Matches: {liveMatches.length}</span>
                    <span>Top 100 Players Live: {playerStatuses.filter(p => p.isLive).length}</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto space-y-4">
                {playerStatuses.map((item) => (
                    <PlayerCard key={item.team.id} item={item} />
                ))}
            </main>
        </div>
    );
}

function PlayerCard({ item }: { item: RankingItem & { isLive: boolean; match?: LiveMatch } }) {
    const { team, ranking, isLive, match } = item;

    return (
        <div className={`
        rounded-xl p-4 border transition-all duration-300
        ${isLive
                ? 'bg-gray-900 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                : 'bg-gray-900/50 border-gray-800 opacity-80 hover:opacity-100 hover:border-gray-700'}
    `}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-500 w-8">#{ranking}</span>
                    <div>
                        <h3 className={`font-bold text-lg ${isLive ? 'text-white' : 'text-gray-400'}`}>
                            {team.name}
                        </h3>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>{team.country.name}</span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    {isLive ? (
                        <span className="flex items-center gap-1.5 bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                            LIVE
                        </span>
                    ) : (
                        <span className="text-xs text-gray-600 px-2 py-1 bg-gray-800 rounded">
                            IDLE
                        </span>
                    )}
                </div>
            </div>

            {isLive && match && (
                <div className="mt-3 pt-3 border-t border-gray-800 bg-black/20 rounded p-3 text-sm">
                    <div className="flex justify-between items-center mb-1 text-gray-400 text-xs uppercase tracking-wider">
                        <span>VS</span>
                        <span>{match.status.description}</span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <div className="text-right flex-1 truncate">
                            {match.homeTeam.name === team.name ? 'You' : match.homeTeam.name}
                        </div>
                        <div className="font-mono font-bold text-lg bg-gray-800 px-2 py-1 rounded">
                            {match.homeScore.current} - {match.awayScore.current}
                        </div>
                        <div className="text-left flex-1 truncate">
                            {match.awayTeam.name === team.name ? 'You' : match.awayTeam.name}
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2 font-mono">
                        {match.homeScore.period1}-{match.awayScore.period1}
                        {match.homeScore.period2 !== undefined ? `, ${match.homeScore.period2}-${match.awayScore.period2}` : ''}
                        {match.homeScore.period3 !== undefined ? `, ${match.homeScore.period3}-${match.awayScore.period3}` : ''}
                    </div>
                </div>
            )}
        </div>
    );
}
