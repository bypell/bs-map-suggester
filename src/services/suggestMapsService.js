import { getPlayerTopPlays } from '../api/players';
import { getLeaderboardPageScores } from '../api/leaderboards';

const LEADERBOARD_SCORES_PER_PAGE = 12; // TODO: could be fetched dynamically instead of hardcoded

export async function getMapSuggestionsForUser(playerId) {
    // 1. take top 30 plays of user
    const topScoresOfUser = await getPlayerTopPlays(playerId, 30);

    // 2. take first 30 players around positions in leaderboards. only scores max 30pp above or below
    for (let i = 0; i < topScoresOfUser.length; i++) {
        const leaderboardScore = topScoresOfUser[i];

        // going through a top score and getting page and placement on page on that leaderboard...
        const leaderboardId = leaderboardScore.leaderboard.id;
        const leaderboardPage = Math.ceil(leaderboardScore.score.rank / LEADERBOARD_SCORES_PER_PAGE);

        const leaderboardPageScoresWithMeta = await getLeaderboardPageScores(leaderboardId, leaderboardPage);
        const leaderboardScoresOnPageUserIsIn = leaderboardPageScoresWithMeta.scores;
        const totalScoresOnLeaderboard = leaderboardPageScoresWithMeta.metadata.total - 1;

        const userPlacementOnPage = Math.floor(leaderboardScore.score.rank % LEADERBOARD_SCORES_PER_PAGE);
        const userPlacementIndexOnPage = userPlacementOnPage === 0 ? LEADERBOARD_SCORES_PER_PAGE - 1 : userPlacementOnPage - 1;
        const userScore = leaderboardScore.score;

        await getPlayerJudgementsAroundUserOnLeaderboard(leaderboardId, leaderboardPage, leaderboardScoresOnPageUserIsIn, userPlacementIndexOnPage, userScore, totalScoresOnLeaderboard)
    }

}

async function getPlayerJudgementsAroundUserOnLeaderboard(leaderboardId, startLeaderboardPage, leaderboardScoresOnPageUserIsIn, userPlacementIndexOnPage, userScore, totalScoresOnLeaderboard) {
    let playersAbove = [];
    let playersBelow = [];

    let currentPlacementOnPageIndexChecking = userPlacementIndexOnPage;
    let currentPage = startLeaderboardPage;
    let currentPageScores = leaderboardScoresOnPageUserIsIn;
    let playersAdded = 0;

    goingUpLoop:
    while (currentPage > 0) {
        // go up through players until we reach start of page
        while (currentPlacementOnPageIndexChecking > -1) {

            // if score is more than 30pp above, we can stop looking
            const scorePP = currentPageScores[currentPlacementOnPageIndexChecking].pp;
            if (userScore.pp + 30 < scorePP) {
                break goingUpLoop;
            }

            playersAbove.push({
                ppDistanceToUser: Math.abs(userScore.pp - scorePP),
                playerName: currentPageScores[currentPlacementOnPageIndexChecking].leaderboardPlayerInfo.name,
                playerId: currentPageScores[currentPlacementOnPageIndexChecking].leaderboardPlayerInfo.id
            });

            // if we have added 15 players, we can stop looking
            playersAdded++;
            if (playersAdded >= 15) {
                break goingUpLoop;
            }

            currentPlacementOnPageIndexChecking--;
        }

        // if we are done with the first page, we stop here because there's no other scores above to check
        if (currentPage == 1) {
            break;
        }

        // otherwise, we fetch data for previous page and reset some variables
        currentPage--;
        const poopoo = await getLeaderboardPageScores(leaderboardId, currentPage);
        currentPageScores = poopoo.scores;
        totalScoresOnLeaderboard = poopoo.metadata.total;
        currentPlacementOnPageIndexChecking = LEADERBOARD_SCORES_PER_PAGE - 1; // set to last index because we have loaded a new page
    }

    playersAbove.shift(); // remove first element because it's the user itself

    currentPlacementOnPageIndexChecking = userPlacementIndexOnPage;
    currentPage = startLeaderboardPage;
    currentPageScores = leaderboardScoresOnPageUserIsIn;
    playersAdded = 0;

    let lastScoreRankChecked = userScore.rank;
    goingDownLoop:
    while (lastScoreRankChecked <= totalScoresOnLeaderboard) {

        // go down through players until we reach end of scores
        while (currentPlacementOnPageIndexChecking < LEADERBOARD_SCORES_PER_PAGE && lastScoreRankChecked <= totalScoresOnLeaderboard) {
            // if score is more than 30pp below, we can stop looking
            const scorePP = currentPageScores[currentPlacementOnPageIndexChecking].pp;
            if (userScore.pp - 30 > scorePP) {
                break goingDownLoop;
            }

            playersBelow.push({
                ppDistanceToUser: Math.abs(userScore.pp - scorePP),
                playerName: currentPageScores[currentPlacementOnPageIndexChecking].leaderboardPlayerInfo.name,
                playerId: currentPageScores[currentPlacementOnPageIndexChecking].leaderboardPlayerInfo.id
            });

            // if we have added 15 players, we can stop looking
            playersAdded++;
            if (playersAdded >= 15) {
                break goingDownLoop;
            }

            lastScoreRankChecked = currentPageScores[currentPlacementOnPageIndexChecking].rank;
            currentPlacementOnPageIndexChecking++;

        }

        // if we are done with the first page, we stop here because there's no other scores above to check
        // if (currentPage == 1) {
        //     break;
        // }

        if (lastScoreRankChecked >= totalScoresOnLeaderboard) {
            break;
        }

        // otherwise, we fetch data for previous page and reset some variables
        currentPage++;
        const poopoo = await getLeaderboardPageScores(leaderboardId, currentPage);
        currentPageScores = poopoo.scores;
        totalScoresOnLeaderboard = poopoo.metadata.total;
        currentPlacementOnPageIndexChecking = 0; // set to first index because we have loaded a new page
    }

    console.log("above", playersAbove);
    console.log("below", playersBelow);
}