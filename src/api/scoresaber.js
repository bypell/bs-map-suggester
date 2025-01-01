const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://scoresaber.com/api';

export async function getPlayers(query) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/players?search=${query}`);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.players;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getPlayerTopPlays(playerId, howMany) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/player/${playerId}/scores?limit=${howMany}&sort=top`);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.playerScores;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getPlayerRecentPlays(playerId, howMany) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/player/${playerId}/scores?limit=${howMany}&sort=recent`);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.playerScores;
    } catch (error) {
        console.error(error);
        return [];
    }
}