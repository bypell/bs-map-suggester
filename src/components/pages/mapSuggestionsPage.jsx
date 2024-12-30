import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getDifficultyStyle, getDifficultyLabel } from '../../utils/helpers';
import * as mapsDataService from '../../services/mapDataService';

export default function MapSuggestionsPage() {
    const location = useLocation();
    const { suggestions = [] } = location.state || {};
    let mapsData = {};

    useEffect(() => {
        const songHashes = suggestions.map(suggestion => suggestion.leaderboard.songHash);
        mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
            mapsData = data;
        });
    }, []);

    return (
        <div className="relative text-white flex flex-col justify-center items-center">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl mb-5 text-center">Map Suggestions</h2>
                    {suggestions.map((suggestion, index) => {
                        const { leaderboard } = suggestion;
                        const { coverImage, songName, songAuthorName, difficulty, stars } = leaderboard;
                        return (
                            <div className='bg-less-dark pr-2 mb-2 shadow-md w-[40rem]' key={index}>
                                <div className='flex flex-row items-center'>
                                    <img src={coverImage} alt="song cover image" className="w-20 h-20" />
                                    <div className='flex flex-col ml-4'>
                                        <h3 className="text-base">{songName}</h3>
                                        <p className='text-sm'>{songAuthorName}</p>
                                    </div>
                                    <div className='flex flex-row ml-auto items-center cursor-help' title={`${getDifficultyLabel(difficulty.difficulty)} difficulty`}>
                                        <i className={`fas fa-star ${getDifficultyStyle(difficulty.difficulty)}`}></i>
                                        <p>{stars}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-2xl">No suggestions available</h2>
                </div>
            )}
        </div>
    );
}