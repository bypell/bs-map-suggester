import * as scoresaberAPI from '../api/scoresaber';

export async function getMapSuggestionsForUser(playerId, progressCallback = () => { }) {
    progressCallback(0, "Fetching user data + top plays...");
    const userBasicData = await scoresaberAPI.getPlayerBasic(playerId);

    // take top 20 plays of user
    const topScoresOfUser = await scoresaberAPI.getPlayerTopPlays(playerId, 20);
    if (!topScoresOfUser) {
        return [];
    }

    // get players around user on global leaderboard
    progressCallback(1, "Getting players around user on leaderboard...");
    const playersToGetAbove = 100;
    const playersToGetBelow = 100;
    const userRank = userBasicData.rank;
    const playersPerPage = 50; // TODO: unlikely to change in the future so I'm hardcoding this for now. WE LOVE MAGIC NUMBERS!
    let userPlacementOnPage = userRank % playersPerPage;
    if (userPlacementOnPage === 0) {
        userPlacementOnPage = playersPerPage;
    }

    const otherPlayersSimplified = [];

    // above user
    let passedPlayerInLoop = false;
    for (let i = Math.ceil(userRank / playersPerPage); i > 0; i--) {
        const players = await scoresaberAPI.getPlayersOnPage(i);
        for (let j = players.length - 1; j >= 0; j--) {
            if (!passedPlayerInLoop && players[j].rank >= userRank) {
                continue;
            } else {
                passedPlayerInLoop = true;
            }
            otherPlayersSimplified.push({ id: players[j].id, rank: players[j].rank });
            if (otherPlayersSimplified.length >= playersToGetAbove) {
                break;
            }
        }
        if (otherPlayersSimplified.length >= playersToGetAbove) {
            break;
        }
    }

    // below user
    passedPlayerInLoop = false;
    for (let i = Math.ceil((userRank + playersToGetBelow) / playersPerPage); i > 0; i--) {
        const players = await scoresaberAPI.getPlayersOnPage(i);
        for (let j = 0; j < players.length; j++) {
            if (!passedPlayerInLoop && players[j].rank <= userRank) {
                continue;
            } else {
                passedPlayerInLoop = true;
            }
            otherPlayersSimplified.push({ id: players[j].id, rank: players[j].rank });
            if (otherPlayersSimplified.length >= playersToGetAbove + playersToGetBelow) {
                break;
            }
        }
        if (otherPlayersSimplified.length >= playersToGetAbove + playersToGetBelow) {
            break;
        }
    }
    // console.log("playerIds ", playerIds);

    // get top plays of each player above user on global leaderboard
    progressCallback(2, "Getting top plays of each player...");
    let topScoresOfPlayers = await Promise.all(
        otherPlayersSimplified.map(playerSimplified => scoresaberAPI.getPlayerTopPlays(playerSimplified.id, 30))
    );

    console.log("fetched main data");
    console.log(otherPlayersSimplified);
    progressCallback(3, "Judging and sorting...");
    const playersToTopScores = {};
    for (let i = 0; i < otherPlayersSimplified.length; i++) {
        if (!topScoresOfPlayers[i]) {
            continue;
        }
        playersToTopScores[otherPlayersSimplified[i].id] = topScoresOfPlayers[i];

        playersToTopScores[otherPlayersSimplified[i].id].forEach(score => {
            score.playerDistanceToUser = Math.abs(otherPlayersSimplified[i].rank - userRank);
        });
    }
    // console.log("playersToTopScores ", playersToTopScores);

    addSimilarityRatingToPlayersTopScoresDictionary(playersToTopScores, topScoresOfUser);

    const topScores = Object.values(playersToTopScores).flat();

    addPopularityRatingToTopScores(topScores);

    const maxPlayerDistanceToUser = topScores.map(score => score.playerDistanceToUser).reduce((a, b) => Math.max(a, b));
    for (let i = 0; i < topScores.length; i++) {
        topScores[i].playerDistanceToUserRating = 1.0 - (topScores[i].playerDistanceToUser / maxPlayerDistanceToUser);
        //delete topScores[i].playerDistanceToUser;
    }
    // console.log("topScores ", topScores);

    // sort using ratings
    const mapPopularityWeight = 0.2;
    const playerDistanceWeight = 0.2;
    const playerSimilarityWeight = 0.5;

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

    // remove duplicates that come after the first instance of a map (higher rating)
    const topScoresSortedNoDuplicates = [];
    const leaderboardIds = new Set();
    for (let i = 0; i < topScoresSorted.length; i++) {
        if (!leaderboardIds.has(topScoresSorted[i].leaderboard.id)) {
            topScoresSortedNoDuplicates.push(topScoresSorted[i]);
            leaderboardIds.add(topScoresSorted[i].leaderboard.id);
        }
    }
    // console.log("topScoresSortedNoDuplicates ", topScoresSortedNoDuplicates);

    // cap star rating
    const userMaxStarRatingInTopPlays = topScoresOfUser.map(score => score.leaderboard.stars).reduce((a, b) => Math.max(a, b));
    const maxStarRating = userMaxStarRatingInTopPlays * 1.05;
    console.log("maxStarRating ", maxStarRating);
    const topScoresSortedCapped = topScoresSortedNoDuplicates.filter(score => score.leaderboard.stars <= maxStarRating);
    // console.log("topScoresSortedCapped ", topScoresSortedCapped);

    // remove maps that the user already has a decent score on or played recently, and have a star rating of 0
    const [userTopScoresLonger, userRecentScores] = await Promise.all([
        scoresaberAPI.getPlayerTopPlays(playerId, 50),
        scoresaberAPI.getPlayerRecentPlays(playerId, 50)
    ]);
    const mapsUserHasPlayed = new Set([
        ...userTopScoresLonger.map(score => score.leaderboard.id),
        ...userRecentScores.map(score => score.leaderboard.id)
    ]);
    const topScoresSortedCappedFiltered = topScoresSortedCapped.filter(
        score => !mapsUserHasPlayed.has(score.leaderboard.id) && score.leaderboard.stars > 0
    );
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

    console.log("suggestions ", suggestions);
    progressCallback(4, "Done.");
    return suggestions.slice(0, 400);
}


function addSimilarityRatingToPlayersTopScoresDictionary(playersToTopScoresDict, topScoresOfUser) {
    // give each score a number for the number of maps the player has in common with the user
    let maxNbCommonMapsWithUser = 0;
    for (const playerId in playersToTopScoresDict) {
        const nbCommonMaps = playersToTopScoresDict[playerId].filter(score => topScoresOfUser.some(playerTopScore => playerTopScore.leaderboard.id === score.leaderboard.id)).length;
        if (nbCommonMaps > maxNbCommonMapsWithUser) {
            maxNbCommonMapsWithUser = nbCommonMaps;
        }

        playersToTopScoresDict[playerId].forEach(score => {
            score.playerNbCommonMapsWithUser = nbCommonMaps;
        });
    }

    // remove playerNbCommonMapsWithUser and replace it with a rating from 0 to 1
    for (const playerId in playersToTopScoresDict) {
        playersToTopScoresDict[playerId].forEach(score => {
            score.playerSimilarityToUserRating = score.playerNbCommonMapsWithUser / maxNbCommonMapsWithUser;
            if (!score.playerSimilarityToUserRating) {
                score.playerSimilarityToUserRating = 0;
            }
            //delete score.playerNbCommonMapsWithUser;
        });
    }
}

function addPopularityRatingToTopScores(topScores) {
    // give each score leaderboard a counter for the number of times it appears
    const topScoresDictionary = {};
    let maxCount = 1;
    for (let i = 0; i < topScores.length; i++) {
        const score = topScores[i];
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
    for (let i = 0; i < topScores.length; i++) {
        const score = topScores[i];
        score.count = topScoresDictionary[score.leaderboard.id].count;
    }

    // replace count with rating
    for (let i = 0; i < topScores.length; i++) {
        topScores[i].mapPopularityRating = topScores[i].count / maxCount;
        //delete topScores[i].count;
    }
}