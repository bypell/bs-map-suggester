import * as beatsaverAPI from '../api/beatsaver';

export async function getSongHashesToMapDataDictionary(hashArray) {
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < hashArray.length; i += batchSize) {
        batches.push(hashArray.slice(i, i + batchSize));
    }

    let songHashToMapDataDictionary = {};

    // fetching each batch of 50 song hashes
    // if there's a rate limit error, we retry after 10 seconds
    for (let index = 0; index < batches.length; index++) {
        let batch = batches[index];
        let success = false;

        while (!success) {
            try {
                const data = await beatsaverAPI.getMapsFromSongHashes(batch);
                songHashToMapDataDictionary = { ...songHashToMapDataDictionary, ...data };
                success = true;
            } catch (error) {
                if (error.status === 429) {
                    console.warn(`Beatsaver rate limit reached. Retrying batch ${index + 1} after 10 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                } else {
                    console.error(`Error processing batch ${index + 1}:`, error);
                    throw error;
                }
            }
        }
    }

    return songHashToMapDataDictionary;
}