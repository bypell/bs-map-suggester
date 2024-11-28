export async function getLeaderboardPageScores(leaderboardId, page) {
    try {
        const response = await fetch(`/api/leaderboard/by-id/${leaderboardId}/scores?page=${page}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error)
        // console.error(error);
    }
}