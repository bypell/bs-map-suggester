import { useState } from 'react';
import { getMapSuggestionsForUser } from '../services/suggestMapsService';

export function useMapSuggestions() {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [error, setError] = useState(null);

    async function fetchMapSuggestions(playerId) {
        setLoading(true);
        setError(null);
        try {
            const suggestions = await getMapSuggestionsForUser(playerId);
            setSuggestions(suggestions);
        } catch (error) {
            console.error("Error fetching map suggestions:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return { loading, suggestions, error, fetchMapSuggestions };
}