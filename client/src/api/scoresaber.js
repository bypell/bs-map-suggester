const CORS_PROXY = '';
const BASE_URL = '/api';

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

export async function getPlayersOnPage(page) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/players?page=${page}&withMetadata=false`);
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

export async function getPlayerBasic(playerId) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/player/${playerId}/basic`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getLeaderboardPageScores(leaderboardId, page) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/leaderboard/by-id/${leaderboardId}/scores?page=${page}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getLeaderboardFull(leaderboardId) {
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}/leaderboard/by-id/${leaderboardId}/info`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}