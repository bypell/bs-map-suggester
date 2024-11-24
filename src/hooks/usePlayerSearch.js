import { useState, useEffect } from 'react';
import { getPlayers } from '../api/players';

export default function usePlayerSearch(inputValue) {
    const [playerSearchResults, setPlayerSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (inputValue.length >= 3) {
                setIsLoading(true);
                getPlayers(inputValue)
                    .then(players => {
                        setPlayerSearchResults(players);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching players:', error);
                        setIsLoading(false);
                    });
            } else {
                setPlayerSearchResults([]);
                setIsLoading(false);
            }
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    return { playerSearchResults, isLoading };
}