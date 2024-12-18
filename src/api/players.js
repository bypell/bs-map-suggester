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

export async function getPlayerRecentPlays(playerId, howMany) {
    try {
        const response = await fetch(`api/player/${playerId}/scores?limit=${howMany}&sort=recent`);
        const data = await response.json();
        return data.playerScores;
    }
    catch (error) {
        if (error?.response?.status === 404) {
            return [];
        }
    }
}

export async function getPlayersOnPage(page) {
    try {
        const response = await fetch(`/api/players?page=${page}&withMetadata=false`);
        const data = await response.json();
        return data.players;
    }
    catch (error) {
        if (error?.response?.status === 404) {
            return [];
        }
    }
}

export async function getPlayerBasic(playerId) {
    try {
        const response = await fetch(`/api/player/${playerId}/basic`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        if (error?.response?.status === 404) {
            return null;
        }
    }
}