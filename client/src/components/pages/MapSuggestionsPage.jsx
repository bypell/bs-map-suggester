import React, { useEffect, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import * as mapsDataService from '../../services/mapDataService';
import SuggestionCard from '../SuggestionCard';
import { useSuggestions } from '../../context/suggestionsContext';
import { AudioPlayerProvider } from '../../context/AudioPlayerContext';

function MapSuggestionsPage() {
    const { suggestions } = useSuggestions();
    const [mapsData, setMapsData] = useState({});
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const songHashes = useMemo(() => {
        return suggestions?.map((suggestion) => suggestion.leaderboard.songHash) || [];
    }, [suggestions]);

    useEffect(() => {
        if (songHashes.length > 0) {
            try {
                mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
                    setMapsData(data);
                });
            } catch (error) {
                console.error("Error fetching maps data:", error);
                // todo: show message?
            }
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
                />
            </div>
        );
    }

    return (
        <div className="relative text-white flex flex-col justify-center items-center motion-opacity-in-0 motion-blur-in-sm motion-duration-1500">
            {suggestions && suggestions.length > 0 ? (
                <div className="mt-4 items-center flex flex-col w-[90%] md:w-[40rem]">
                    <div className="shadow-2xl relative z-50 w-full">
                        <h2 className="text-2xl text-center pb-5">Map Suggestions</h2>
                    </div>
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
            )
            }
        </div >
    );
}

export default function MapSuggestionsPageWithProvider() {
    return (
        <AudioPlayerProvider>
            <MapSuggestionsPage />
        </AudioPlayerProvider>
    );
}