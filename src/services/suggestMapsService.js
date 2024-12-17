import * as playersApi from '../api/players';

export async function getMapSuggestionsForUser(playerId) {
    const userBasicData = await playersApi.getPlayerBasic(playerId);

    // 1. take top 20 plays of user
    const topScoresOfUser = await playersApi.getPlayerTopPlays(playerId, 20);

    // 2. get 50 players above user on global leaderboard
    const playersToGet = 50;
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
    console.log("playerIds ", playerIds);

    // 3. get top 20 plays of each player above user on global leaderboard
    let topScoresOfPlayers = await Promise.all(
        playerIds.map(playerId => playersApi.getPlayerTopPlays(playerId, 20))
    );

    const topScoresOfPlayersDictionary = {};
    for (let i = 0; i < playerIds.length; i++) {
        topScoresOfPlayersDictionary[playerIds[i]] = topScoresOfPlayers[i].map(score => score);
    }
    console.log("topScoresOfPlayersDictionary ", topScoresOfPlayersDictionary);

    // 4. order player ids by how many maps they have in common with user
    const playerIdsOrderedByNumberOfCommonMaps = Object.keys(topScoresOfPlayersDictionary).sort((a, b) => {
        const aNumberOfCommonMaps = topScoresOfPlayersDictionary[a].filter(score => topScoresOfUser.some(topScore => topScore.leaderboard.id === score.leaderboard.id)).length;
        const bNumberOfCommonMaps = topScoresOfPlayersDictionary[b].filter(score => topScoresOfUser.some(topScore => topScore.leaderboard.id === score.leaderboard.id)).length;
        return bNumberOfCommonMaps - aNumberOfCommonMaps;
    });
    console.log("playerIdsOrderedByNumberOfCommonMaps ", playerIdsOrderedByNumberOfCommonMaps);

    // 5. reorder topScoresOfPlayers by playerIdsOrderedByNumberOfCommonMaps
    topScoresOfPlayers = playerIdsOrderedByNumberOfCommonMaps.map(playerId => topScoresOfPlayersDictionary[playerId]);

    // 6. flatten the array 
    topScoresOfPlayers = topScoresOfPlayers.flat();
    console.log("topScoresOfPlayers ", topScoresOfPlayers);

    // 7. cap star rating
    const userMaxStarRatingInTopPlays = topScoresOfUser.map(score => score.leaderboard.stars).reduce((a, b) => Math.max(a, b));
    const maxStarRating = userMaxStarRatingInTopPlays * 1.1;
    topScoresOfPlayers = topScoresOfPlayers.filter(score => score.leaderboard.stars <= maxStarRating);

    // 8. create an array for the maps
    const maps = [];
    for (let i = 0; i < topScoresOfPlayers.length; i++) {
        const map = topScoresOfPlayers[i].leaderboard;
        maps.push(map);
    }

    // 9. remove duplicates and give them a number for the number of times they appear
    const mapsDictionary = {};
    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        if (mapsDictionary[map.id]) {
            mapsDictionary[map.id].count += 1;
        }
        else {
            mapsDictionary[map.id] = { ...map, count: 1 };
        }
    }
    const mapsArray = Object.values(mapsDictionary);
    console.log("mapsArray ", mapsArray);

    // 10. sort by count
    const mapsArraySortedByCount = mapsArray.sort((a, b) => b.count - a.count);
    console.log("mapsArraySortedByCount ", mapsArraySortedByCount);







    // // filter out maps that may be too hard or too easy
    // filteredMaps = filteredMaps.filter(
    //     map => map.stars >= minStarRatingOfMapsOfInterest && map.stars <= maxStarRatingOfTopPlaysOfUser
    // );

    // console.log("filt ", filteredMaps);


    // return filteredMaps;

}