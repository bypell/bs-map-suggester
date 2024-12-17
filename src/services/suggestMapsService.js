import * as playersApi from '../api/players';

export async function getMapSuggestionsForUser(playerId) {
    const userBasicData = await playersApi.getPlayerBasic(playerId);


    // 1. take top 20 plays of user
    const topScoresOfUser = await playersApi.getPlayerTopPlays(playerId, 20);

    // 2. get 50 players above user on global leaderboard
    const playersToGet = 50;
    const userRank = userBasicData.rank;
    const playersPerPage = 50; // TODO: unlikely to change in the future so I'm hardcoding this for now
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
    const topScoresOfPlayers = [];
    for (let i = 0; i < playerIds.length; i++) {
        topScoresOfPlayers.push(await playersApi.getPlayerTopPlays(playerIds[i], 20));
    }
    console.log("topScoresOfPlayers ", topScoresOfPlayers);





    // // filter out maps that may be too hard or too easy
    // filteredMaps = filteredMaps.filter(
    //     map => map.stars >= minStarRatingOfMapsOfInterest && map.stars <= maxStarRatingOfTopPlaysOfUser
    // );

    // console.log("filt ", filteredMaps);


    // return filteredMaps;

}