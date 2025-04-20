const cache = {};

const loadCacheFromLocalStorage = () => {
    const savedCache = localStorage.getItem('beatsaverCache');
    if (savedCache) {
        Object.assign(cache, JSON.parse(savedCache));
    }
};

const saveCacheToLocalStorage = () => {
    localStorage.setItem('beatsaverCache', JSON.stringify(cache));
};

loadCacheFromLocalStorage();

export async function getMapsFromSongHashes(hashArray) {
    const uncachedHashes = [];
    const cachedResults = {};

    for (const hash of hashArray) {
        if (cache[hash]) {
            cachedResults[hash] = cache[hash];
        } else {
            uncachedHashes.push(hash);
        }
    }

    if (uncachedHashes.length === 0) {
        return cachedResults;
    }

    const response = await fetch(`https://api.beatsaver.com/maps/hash/${uncachedHashes.join(',')}`);
    if (response.status === 429) {
        const error = new Error('Too Many Requests');
        error.status = 429;
        throw error;
    }

    const data = await response.json();

    for (const [hash, mapData] of Object.entries(data)) {
        cache[hash] = mapData;
    }

    saveCacheToLocalStorage();

    return { ...cachedResults, ...data };
}