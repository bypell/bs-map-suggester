import * as beatsaverAPI from '../api/beatsaver';

export async function getSongHashesToMapDataDictionary(hashArray) {
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < hashArray.length; i += batchSize) {
        batches.push(hashArray.slice(i, i + batchSize));
    }

    let songHashToMapDataDictionary = {};
    await Promise.all(
        batches.map(async (batch) => {
            const data = await beatsaverAPI.getMapsFromSongHashes(batch);
            songHashToMapDataDictionary = { ...songHashToMapDataDictionary, ...data };
        })
    );

    return songHashToMapDataDictionary;
}