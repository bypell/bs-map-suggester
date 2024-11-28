import { getPlayerTopPlays } from '../api/players';
import { getLeaderboardPageScores } from '../api/leaderboards';

const LEADERBOARD_SCORES_PER_PAGE = 12; // TODO: could be fetched dynamically instead of hardcoded

export async function getMapSuggestionsForUser(playerId) {
    // 1. take top 30 plays of user
    const topScoresOfUser = await getPlayerTopPlays(playerId, 30);

    // 2. take first 30 players around positions in leaderboards. only scores max 30pp above or below
    for (let i = 0; i < topScoresOfUser.length; i++) {
        // going through a top score and getting page and placement on page on that leaderboard...
        const leaderboardId = topScoresOfUser[i].leaderboard.id;
        const leaderboardPage = Math.ceil(topScoresOfUser[i].score.rank / LEADERBOARD_SCORES_PER_PAGE);
        const leaderboardScoresOnPageUserIsIn = await getLeaderboardPageScores(leaderboardId, leaderboardPage);
        const userPlacementOnPage = Math.floor(topScoresOfUser[i].score.rank % LEADERBOARD_SCORES_PER_PAGE);
        const userPlacementIndexOnPage = userPlacementOnPage === 0 ? LEADERBOARD_SCORES_PER_PAGE - 1 : userPlacementOnPage - 1;




    }

}