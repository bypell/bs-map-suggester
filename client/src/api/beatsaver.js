export async function getMapsFromSongHashes(hashArray) {
    const response = await fetch(`https://api.beatsaver.com/maps/hash/${hashArray.join(',')}`);
    if (response.status === 429) {
        const error = new Error('Too Many Requests');
        error.status = 429;
        throw error;
    }
    const data = await response.json();
    return data;
}