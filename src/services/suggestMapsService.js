import { getPlayerTopPlays } from '../api/players';
import { getLeaderboardPageScores, getLoaderboardFull } from '../api/leaderboards';
import { countDaysBetweenStringAndString } from '../utils/helpers';

const LEADERBOARD_SCORES_PER_PAGE = 12; // TODO: could be fetched dynamically instead of hardcoded
const MAX_PP_DISTANCE = 15;
const MAX_PLAYERS = 10;

export async function getMapSuggestionsForUser(playerId) {
    // 1. take top 30 plays of user
    const topScoresOfUser = await getPlayerTopPlays(playerId, 30);

    // 2. take first 30 players around positions in leaderboards. only scores max 15pp above or below
    let playersOfInterest = [];
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

        const playersAroundUser = await getPlayerJudgementsAroundUserOnLeaderboard(
            leaderboardId,
            leaderboardPage,
            leaderboardScoresOnPageUserIsIn,
            userPlacementIndexOnPage,
            userScore,
            totalScoresOnLeaderboard
        );

        // add parameter userScoreNum to each player
        playersAroundUser.forEach(player => {
            player.userScoreNum = i;
        });

        playersOfInterest.push(...playersAroundUser);
    }

    playersOfInterest = playersOfInterest.reduce((acc, current) => {
        const x = acc.find(item => item.playerId === current.playerId);
        if (!x) {
            current.nbRepeat = 1;
            return acc.concat([current]);
        } else {
            x.ppDistanceToUser = (x.ppDistanceToUser + current.ppDistanceToUser) / 2;
            x.userScoreNum = (x.userScoreNum + current.userScoreNum) / 2;
            x.nbRepeat = x.nbRepeat + 1;
            return acc;
        }
    }, []);

    // set ratingA of each player to 1 - (ppDistanceToUser / MAX_PP_DISTANCE)
    playersOfInterest.forEach(player => {
        player.ratingA = 1 - Math.min(1, player.ppDistanceToUser / MAX_PP_DISTANCE);
        delete player.ppDistanceToUser;
    });

    // set rating B of each player to 1 - (userScoreNum / maxScoreNum)
    const maxScoreNum = Math.max(...playersOfInterest.map(player => player.userScoreNum));
    playersOfInterest.forEach(player => {
        player.ratingB = 1 - (player.userScoreNum / maxScoreNum);
        delete player.userScoreNum;
    });

    // set rating C of each player to nbRepeat / maxNbRepeat
    const maxNbRepeat = Math.max(...playersOfInterest.map(player => player.nbRepeat));
    playersOfInterest.forEach(player => {
        player.ratingC = maxNbRepeat > 0 ? player.nbRepeat / maxNbRepeat : 0;
        delete player.nbRepeat;
    });

    // sort desc by (A*0.1 + B * 0.3 + C * 0.6)
    const SHARE_A = 0.2; // avg pp distance
    const SHARE_B = 0.3; // avg userscorenum
    const SHARE_C = 0.5; // nbRepeat
    playersOfInterest.sort((a, b) => {
        const ratingA = a.ratingA * SHARE_A;
        const ratingB = a.ratingB * SHARE_B;
        const ratingC = a.ratingC * SHARE_C;
        const totalRatingA = ratingA + ratingB + ratingC;

        const ratingA2 = b.ratingA * SHARE_A;
        const ratingB2 = b.ratingB * SHARE_B;
        const ratingC2 = b.ratingC * SHARE_C;
        const totalRatingB = ratingA2 + ratingB2 + ratingC2;

        return totalRatingB - totalRatingA;
    });
    console.log(playersOfInterest);

    // finding maps of interest on those players' profiles
    // get top 10 maps of top 5 players
    const mapsOfInterest = [];
    for (let i = 0; i < Math.min(5, playersOfInterest.length); i++) {
        const player = playersOfInterest[i];
        const topScoresOfPlayer = await getPlayerTopPlays(player.playerId, 10);
        const topMapsOfPlayer = topScoresOfPlayer.map(score => score.leaderboard);
        mapsOfInterest.push(...topMapsOfPlayer);
    }

    // remove duplicates, remove ones that are in top 30 of user
    const topScoresOfUserIds = topScoresOfUser.map(score => score.leaderboard.id);
    let filteredMaps = mapsOfInterest.filter(map => !topScoresOfUserIds.includes(map.id));



    // add star rating to each map by fetching the complete leaderboard data
    for (let i = 0; i < filteredMaps.length; i++) {
        const map = filteredMaps[i];
        const leaderboardData = await getLoaderboardFull(map.id);
        filteredMaps[i].stars = leaderboardData.stars;
    }

    // add star rating to each top play by user by fetching the complete leaderboard data
    for (let i = 0; i < topScoresOfUser.length; i++) {
        const score = topScoresOfUser[i];
        const leaderboardData = await getLoaderboardFull(score.leaderboard.id);
        topScoresOfUser[i].leaderboard.stars = leaderboardData.stars;
    }



    const maxStarRatingOfTopPlaysOfUser = Math.max(...topScoresOfUser.map(score => score.leaderboard.stars));
    const minStarRatingOfMapsOfInterest = Math.min(...mapsOfInterest.map(map => map.stars));

    // filter out maps that may be too hard or too easy
    filteredMaps = filteredMaps.filter(
        map => map.stars >= minStarRatingOfMapsOfInterest && map.stars <= maxStarRatingOfTopPlaysOfUser
    );

    console.log("filt ", filteredMaps);


    return filteredMaps;

}

async function getPlayerJudgementsAroundUserOnLeaderboard(
    leaderboardId,
    startLeaderboardPage,
    leaderboardScoresOnPageUserIsIn,
    userPlacementIndexOnPage,
    userScore,
    totalScoresOnLeaderboard
) {
    const playersAbove = [];
    const playersBelow = [];

    async function fetchLeaderboardPage(page) {
        try {
            const pageData = await getLeaderboardPageScores(leaderboardId, page);
            return {
                scores: pageData.scores,
                totalScores: pageData.metadata.total,
            };
        } catch (error) {
            console.error(`Error fetching leaderboard page ${page}:`, error);
            return { scores: [], totalScores: totalScoresOnLeaderboard };
        }
    }

    async function findPlayersAbove() {
        let currentPage = startLeaderboardPage;
        let currentPlacement = userPlacementIndexOnPage;
        let playersAdded = -1;
        let currentPageScores = leaderboardScoresOnPageUserIsIn;

        while (currentPage > 0) {
            while (currentPlacement >= 0) {
                const score = currentPageScores[currentPlacement];
                const ppDistance = userScore.pp - score.pp;

                if (ppDistance < -MAX_PP_DISTANCE) return; // too far above
                playersAbove.push(formatPlayerData(score, ppDistance));
                playersAdded++;

                if (playersAdded >= MAX_PLAYERS) return; // reached max players
                currentPlacement--;
            }

            if (currentPage === 1) break; // no more pages above

            currentPage--;
            const pageData = await fetchLeaderboardPage(currentPage);
            currentPageScores = pageData.scores;
            currentPlacement = currentPageScores.length - 1; // start at the last index
        }
    }

    async function findPlayersBelow() {
        let currentPage = startLeaderboardPage;
        let currentPlacement = userPlacementIndexOnPage;
        let playersAdded = -1;
        let currentPageScores = leaderboardScoresOnPageUserIsIn;
        let lastScoreRankChecked = userScore.rank;

        while (lastScoreRankChecked <= totalScoresOnLeaderboard) {
            while (
                currentPlacement < currentPageScores.length &&
                lastScoreRankChecked <= totalScoresOnLeaderboard
            ) {
                const score = currentPageScores[currentPlacement];
                const ppDistance = score.pp - userScore.pp;

                if (countDaysBetweenStringAndString(score.timeSet, userScore.timeSet) > 250) return; // too far in time compared to time of user's score

                if (ppDistance > MAX_PP_DISTANCE) return; // too far below
                playersBelow.push(formatPlayerData(score, ppDistance));
                playersAdded++;

                if (playersAdded >= MAX_PLAYERS) return; // reached max players
                lastScoreRankChecked = score.rank;
                currentPlacement++;
            }

            if (lastScoreRankChecked >= totalScoresOnLeaderboard) break; // no more players below

            currentPage++;
            const pageData = await fetchLeaderboardPage(currentPage);
            currentPageScores = pageData.scores;
            currentPlacement = 0; // start at the first index
        }
    }

    function formatPlayerData(score, ppDistance) {
        return {
            ppDistanceToUser: Math.abs(ppDistance),
            playerName: score.leaderboardPlayerInfo.name,
            playerId: score.leaderboardPlayerInfo.id,
        };
    }

    await findPlayersAbove();
    await findPlayersBelow();

    // first of each array is the user
    playersAbove.shift();
    playersBelow.shift();

    // return list of players COMBINED
    return playersAbove.concat(playersBelow);
}