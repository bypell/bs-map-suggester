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