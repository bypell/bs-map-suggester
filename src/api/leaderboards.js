export async function getLeaderboardPageScores(leaderboardId, page) {
    try {
        const response = await fetch(`/api/leaderboard/by-id/${leaderboardId}/scores?page=${page}`);
        const data = await response.json();
        return data.scores;
    }
    catch (error) {
        if (error.response.status === 404) {
            return [];
        }
        // console.error(error);
    }
}