import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import * as mapsDataService from '../../services/mapDataService';
import SuggestionCard from '../SuggestionCard';

export default function MapSuggestionsPage() {
    const location = useLocation();
    const { suggestions = [] } = location.state || {};
    const [mapsData, setMapsData] = useState({});
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const songHashes = useMemo(() => {
        return suggestions.map((suggestion) => suggestion.leaderboard.songHash);
    }, [suggestions]);

    useEffect(() => {
        mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
            setMapsData(data);
        });
    }, [songHashes]);

    const suggestionCards = useMemo(() => {
        return suggestions.map((suggestion, index) => (
            <SuggestionCard
                key={index}
                suggestion={suggestion}
                mapsData={mapsData}
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
                index={index}
            />
        ));
    }, [suggestions, mapsData, currentlyPlaying]);

    return (
        <div className="relative text-white flex flex-col justify-center items-center">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl mb-5 text-center">Map Suggestions</h2>
                    {suggestionCards}
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-2xl">No suggestions available</h2>
                </div>
            )}
        </div>
    );
}