export async function getPlayers(query) {
    try {
        const response = await fetch(`/api/players?search=${query}`);
        const data = await response.json();
        return data.players;
    }
    catch (error) {
        if (error.response.status === 404) {
            return [];
        }
        // console.error(error);
    }
}

export async function getPlayerTopPlays(playerId, howMany) {
    try {
        const response = await fetch(`api/player/${playerId}/scores?limit=${howMany}&sort=top`);
        const data = await response.json();
        return data.playerScores;
    }
    catch (error) {
        if (error?.response?.status === 404) {
            return [];
        }
    }
}