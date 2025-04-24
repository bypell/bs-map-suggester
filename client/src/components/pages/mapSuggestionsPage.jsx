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
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const songHashes = useMemo(() => {
        return suggestions.map((suggestion) => suggestion.leaderboard.songHash);
    }, [suggestions]);

    useEffect(() => {
        try {
            mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
                setMapsData(data);
            });
        } catch (error) {
            console.error("Error fetching maps data:", error);
        }
    }, [songHashes]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const SuggestionRow = ({ index, style }) => {
        const suggestion = suggestions[index];
        return (
            <div style={style} className='flex justify-center' key={index}>
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
        <div className="relative text-white flex flex-col justify-center items-center motion-opacity-in-0 motion-blur-in-sm motion-duration-1500">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl mb-5 text-center">Map Suggestions</h2>
                    <List
                        height={windowSize.height - 68}
                        width={windowSize.width}
                        itemCount={suggestions.length}
                        itemSize={88}
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