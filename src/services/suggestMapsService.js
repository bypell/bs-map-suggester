import * as playersApi from '../api/players';

export async function getMapSuggestionsForUser(playerId) {
    const userBasicData = await playersApi.getPlayerBasic(playerId);

    // take top 20 plays of user
    const topScoresOfUser = await playersApi.getPlayerTopPlays(playerId, 20);
    if (!topScoresOfUser) {
        return [];
    }

    // get 50 players above user on global leaderboard
    const playersToGet = 100;
    const userRank = userBasicData.rank;
    const playersPerPage = 50; // TODO: unlikely to change in the future so I'm hardcoding this for now. WE LOVE MAGIC NUMBERS!
    let userPlacementOnPage = userRank % playersPerPage;
    if (userPlacementOnPage === 0) {
        userPlacementOnPage = playersPerPage;
    }
    const startPage = Math.ceil(userRank / playersPerPage);
    const playerIds = [];
    let passedPlayerInLoop = false;
    pagesLoop:
    for (let i = startPage; i > 0; i--) {
        const players = await playersApi.getPlayersOnPage(i);
        for (let j = players.length - 1; j >= 0; j--) {
            if (!passedPlayerInLoop && players[j].rank >= userRank) {
                continue;
            }
            else {
                passedPlayerInLoop = true;
            }
            playerIds.push(players[j].id);
            if (playerIds.length >= playersToGet) {
                break pagesLoop;
            }
        }
    }
    // console.log("playerIds ", playerIds);

    // get top 20 plays of each player above user on global leaderboard
    let topScoresOfPlayers = await Promise.all(
        playerIds.map(playerId => playersApi.getPlayerTopPlays(playerId, 20))
    );

    const playersToTopScores = {};
    for (let i = 0; i < playerIds.length; i++) {
        playersToTopScores[playerIds[i]] = topScoresOfPlayers[i];

        playersToTopScores[playerIds[i]].forEach(score => {
            score.playerDistanceToUser = playerIds.length - i;
        });
    }
    // console.log("playersToTopScores ", playersToTopScores);

    // give each score a number for the number of maps the player has in common with the user
    let maxNbCommonMaps = 0;
    for (const playerId in playersToTopScores) {
        const nbCommonMaps = playersToTopScores[playerId].filter(score => topScoresOfUser.some(playerTopScore => playerTopScore.leaderboard.id === score.leaderboard.id)).length;
        if (nbCommonMaps > maxNbCommonMaps) {
            maxNbCommonMaps = nbCommonMaps;
        }

        playersToTopScores[playerId].forEach(score => {
            score.playerNbCommonMaps = nbCommonMaps;
        });
    }
    // console.log("playersToTopScores ", playersToTopScores);

    // remove playerNbCommonMaps and replace it with a rating from 0 to 1
    for (const playerId in playersToTopScores) {
        playersToTopScores[playerId].forEach(score => {
            score.playerSimilarityToUserRating = score.playerNbCommonMaps / maxNbCommonMaps;
            if (!score.playerSimilarityToUserRating) {
                score.playerSimilarityToUserRating = 0;
            }
            delete score.playerNbCommonMaps;
        });
    }
    // console.log("playersToTopScores ", playersToTopScores);

    // flatten each array in the dictionary's values
    const topScoresOfPlayersFlattened = Object.values(playersToTopScores).flat();
    // console.log("topScoresOfPlayersFlattened ", topScoresOfPlayersFlattened);

    // give each score leaderboard a counter for the number of times it appears, removing duplicates along the way
    const topScoresDictionary = {};
    let maxCount = 1;
    for (let i = 0; i < topScoresOfPlayersFlattened.length; i++) {
        const score = topScoresOfPlayersFlattened[i];
        if (topScoresDictionary[score.leaderboard.id]) {
            topScoresDictionary[score.leaderboard.id].count += 1;
            if (topScoresDictionary[score.leaderboard.id].count > maxCount) {
                maxCount = topScoresDictionary[score.leaderboard.id].count;
            }
        }
        else {
            topScoresDictionary[score.leaderboard.id] = { ...score, count: 1 };
        }
    }
    const topScores = Object.values(topScoresDictionary);
    // console.log("topScores ", topScores);

    // replace count with rating
    for (let i = 0; i < topScores.length; i++) {
        topScores[i].mapPopularityRating = topScores[i].count / maxCount;
        delete topScores[i].count;
    }
    // console.log("topScores ", topScores);

    // replace playerDifferenceToUser with rating
    const maxPlayerDistanceToUser = topScores.map(score => score.playerDistanceToUser).reduce((a, b) => Math.max(a, b));
    for (let i = 0; i < topScores.length; i++) {
        topScores[i].playerDistanceToUserRating = topScores[i].playerDistanceToUser / maxPlayerDistanceToUser;
        delete topScores[i].playerDistanceToUser;
    }
    // console.log("topScores ", topScores);

    // sort using ratings
    const mapPopularityWeight = 0.3;
    const playerDistanceWeight = 0.3;
    const playerSimilarityWeight = 0.3;

    const topScoresSorted = topScores.sort((a, b) => {
        const aWeightedScore = (a.mapPopularityRating * mapPopularityWeight) +
            (a.playerDistanceToUserRating * playerDistanceWeight) +
            (a.playerSimilarityToUserRating * playerSimilarityWeight);

        const bWeightedScore = (b.mapPopularityRating * mapPopularityWeight) +
            (b.playerDistanceToUserRating * playerDistanceWeight) +
            (b.playerSimilarityToUserRating * playerSimilarityWeight);

        return bWeightedScore - aWeightedScore;
    });
    // console.log("topScoresSorted ", topScoresSorted);

    // cap star rating
    const userMaxStarRatingInTopPlays = topScoresOfUser.map(score => score.leaderboard.stars).reduce((a, b) => Math.max(a, b));
    const maxStarRating = userMaxStarRatingInTopPlays * 1.05;
    const topScoresSortedCapped = topScoresSorted.filter(score => score.leaderboard.stars <= maxStarRating);
    // console.log("topScoresSortedCapped ", topScoresSortedCapped);

    // remove maps that the user already has a decent score on or played recently
    const [userTopScoresLonger, userRecentScores] = await Promise.all([
        playersApi.getPlayerTopPlays(playerId, 50),
        playersApi.getPlayerRecentPlays(playerId, 50)
    ]);

    const mapsUserHasPlayed = new Set([
        ...userTopScoresLonger.map(score => score.leaderboard.id),
        ...userRecentScores.map(score => score.leaderboard.id)
    ]);

    const topScoresSortedCappedFiltered = topScoresSortedCapped.filter(score => !mapsUserHasPlayed.has(score.leaderboard.id));
    console.log("topScoresSortedCappedFiltered ", topScoresSortedCappedFiltered);


    const suggestions = [];
    for (let i = 0; i < topScoresSortedCappedFiltered.length; i++) {
        const suggestion = {
            leaderboard: topScoresSortedCappedFiltered[i].leaderboard,
            relevantScores: topScoresSortedCappedFiltered[i].score,
            mapPopularityRating: topScoresSortedCappedFiltered[i].mapPopularityRating,
            playerDistanceToUserRating: topScoresSortedCappedFiltered[i].playerDistanceToUserRating,
            playerSimilarityToUserRating: topScoresSortedCappedFiltered[i].playerSimilarityToUserRating
        };
        suggestions.push(suggestion);
    }

    return suggestions;

}