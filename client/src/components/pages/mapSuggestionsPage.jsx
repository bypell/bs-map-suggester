import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import * as mapsDataService from '../../services/mapDataService';
import SuggestionCard from '../SuggestionCard';
import { useSuggestionAudioPlayer } from '../../hooks/useSuggestionAudioPlayer';
import { useSuggestions } from '../../context/suggestionsContext';

export default function MapSuggestionsPage() {
    const { suggestions } = useSuggestions();
    const [mapsData, setMapsData] = useState({});
    const { play, pause, currentlyPlaying } = useSuggestionAudioPlayer();

    const songHashes = useMemo(() => {
        return suggestions.map((suggestion) => suggestion.leaderboard.songHash);
    }, [suggestions]);

    useEffect(() => {
        mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
            setMapsData(data);
        });
    }, [songHashes]);

    const SuggestionRow = ({ index, style }) => {
        const suggestion = suggestions[index];
        return (
            <div style={style} className='flex justify-center'>
                <SuggestionCard
                    suggestion={suggestion}
                    mapsData={mapsData}
                    index={index}
                    play={play}
                    pause={pause}
                    currentlyPlaying={currentlyPlaying}
                />
            </div>
        );
    }

    return (
        <div className="relative text-white flex flex-col justify-center items-center">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl mb-5 text-center">Map Suggestions</h2>
                    <List
                        height={window.innerHeight}
                        itemCount={suggestions.length}
                        itemSize={88}
                        width={window.innerWidth}
                    >
                        {SuggestionRow}
                    </List>
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-2xl">No suggestions available</h2>
                </div>
            )}
        </div>
    );
}