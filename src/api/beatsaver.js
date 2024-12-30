export async function getMapsFromSongHashes(hashArray) {
    try {
        const response = await fetch(`https://api.beatsaver.com/maps/hash/${hashArray.join(',')}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        if (error?.response?.status === 404) {
            return [];
        }
        throw error;
    }
}