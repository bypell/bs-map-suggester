// Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://scoresaber.com/api/players?search=wub. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 200.

// TypeError: NetworkError when attempting to fetch resource. players.js:5:32
// Uncaught (in promise) TypeError: players is undefined
//     handleDebounced PlayerIdInput.jsx:21
//     promise callback*handleDebounced PlayerIdInput.jsx:20
//     delayDebounceFn PlayerIdInput.jsx:30
//     setTimeout handler*PlayerIdInput/< PlayerIdInput.jsx:29
//     React 18


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