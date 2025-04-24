const cache = {};

const loadCacheFromLocalStorage = () => {
    const savedCache = localStorage.getItem('beatsaverCache');
    if (savedCache) {
        // console.log('Loading cache from localStorage:', savedCache);
        Object.assign(cache, JSON.parse(savedCache));
    } else {
        console.log('No cache found in localStorage.');
    }
};

const saveCacheToLocalStorage = () => {
    // console.log('Saving cache to localStorage:', cache);
    localStorage.setItem('beatsaverCache', JSON.stringify(cache));
};

loadCacheFromLocalStorage();

export async function getMapsFromSongHashes(hashArray) {
    const uncachedHashes = [];
    const cachedResults = {};

    hashArray = hashArray.map(hash => hash.toLowerCase());

    for (const hash of hashArray) {
        if (cache[hash]) {
            // console.log(`Cache hit for hash: ${hash}`, cache[hash]);
            cachedResults[hash] = cache[hash];
        } else {
            // console.log(`Cache miss for hash: ${hash}`);
            uncachedHashes.push(hash);
        }
    }

    if (uncachedHashes.length === 0) {
        console.log('All hashes found in cache.');
        return cachedResults;
    }

    // console.log('Fetching uncached hashes:', uncachedHashes);
    const response = await fetch(`https://api.beatsaver.com/maps/hash/${uncachedHashes.join(',')}`);
    if (response.status === 429) {
        const error = new Error('Too Many Requests');
        error.status = 429;
        throw error;
    }

    const data = await response.json();

    for (const [hash, mapData] of Object.entries(data)) {
        cache[hash] = mapData;
        // console.log(`Caching result for hash: ${hash}`, mapData);
    }

    saveCacheToLocalStorage();

    return { ...cachedResults, ...data };
}