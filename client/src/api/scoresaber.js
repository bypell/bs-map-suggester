const URL = import.meta.env.PROD ? 'https://bs-proxy-bypells-projects.vercel.app/scoresaber' : 'http://localhost:3000/scoresaber';

export async function getPlayers(query) {
    const response = await fetch(`${URL}/players?search=${query}`);
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.players;
}

export async function getPlayerTopPlays(playerId, howMany) {
    const response = await fetch(`${URL}/player/${playerId}/scores?limit=${howMany}&sort=top`);
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.playerScores;

}

export async function getPlayerRecentPlays(playerId, howMany) {
    const response = await fetch(`${URL}/player/${playerId}/scores?limit=${howMany}&sort=recent`);
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.playerScores;
}

export async function getPlayersOnPage(page) {
    const response = await fetch(`${URL}/players?page=${page}&withMetadata=false`);
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.players;
}

export async function getPlayerBasic(playerId) {
    const response = await fetch(`${URL}/player/${playerId}/basic`);
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export async function getLeaderboardPageScores(leaderboardId, page) {
    const response = await fetch(`${URL}/leaderboard/by-id/${leaderboardId}/scores?page=${page}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export async function getLeaderboardFull(leaderboardId) {
    const response = await fetch(`${URL}/leaderboard/by-id/${leaderboardId}/info`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}