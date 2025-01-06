import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import scoresaberIcon from '../../assets/scoresaber.svg';
import { getDifficultyStyle, getDifficultyLabel } from '../../utils/helpers';
import * as mapsDataService from '../../services/mapDataService';
import SongPlayingOverlay from '../common/SongPlayingOverlay';

export default function MapSuggestionsPage() {
    const location = useLocation();
    const { suggestions = [] } = location.state || {};
    const [mapsData, setMapsData] = useState({});
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    useEffect(() => {
        const songHashes = suggestions.map(suggestion => suggestion.leaderboard.songHash);
        mapsDataService.getSongHashesToMapDataDictionary(songHashes).then((data) => {
            setMapsData(data);
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
                        const songHash = leaderboard.songHash.toLowerCase();
                        const songUrl = mapsData[songHash]?.versions[0].previewURL;
                        const beatSaverId = mapsData[songHash]?.id;
                        return (
                            <div className='bg-less-dark pr-2 mb-2 shadow-md w-[40rem]' key={index}>
                                <div className='flex flex-row items-center'>
                                    <div className='relative w-20 h-20'>
                                        <SongPlayingOverlay songUrl={songUrl} currentlyPlaying={currentlyPlaying}
                                            setCurrentlyPlaying={setCurrentlyPlaying}
                                            id={index} />
                                        <img src={coverImage} alt="song cover image" />
                                    </div>
                                    <div className='flex flex-col ml-4'>
                                        <h3 className="text-base">{songName}</h3>
                                        <p className='text-sm'>{songAuthorName}</p>
                                    </div>
                                    <div className='flex flex-col ml-auto items-end'>
                                        <div className='flex flex-row items-center cursor-help' title={`${getDifficultyLabel(difficulty.difficulty)} difficulty`}>
                                            <i className={`fas fa-star ${getDifficultyStyle(difficulty.difficulty)}`}></i>
                                            <p>{stars}</p>
                                        </div>
                                        <div className='flex flex-row mt-1 space-x-1 content-center'>
                                            <a title='ScoreSaber link' className='content-center' href={`https://scoresaber.com/leaderboard/${leaderboard.id}`} target='_blank' rel='noreferrer'>
                                                <img src={scoresaberIcon} className='min-w-[18px] min-h-[18px]' alt="scoresaber icon" />
                                            </a>
                                            <a title='BeatSaver link' className='flex items-center justify-center' href={`https://beatsaver.com/maps/${beatSaverId}`} target='_blank' rel='noreferrer'>
                                                <i className="fa-solid fa-arrow-up-right-from-square text-gray-400 hover:text-gray-500" />
                                            </a>
                                            <a title="OneClick install" className='flex items-center justify-center' href={`web+bsmap://${songHash}`}>
                                                <i className="fa-solid fa-cloud-arrow-down text-gray-400 hover:text-gray-500" />
                                            </a>
                                        </div>
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