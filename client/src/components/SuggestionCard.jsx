import React, { memo } from 'react';
import SongPlayingOverlay from './SongPlayingOverlay';
import scoresaberIcon from '../assets/scoresaber.svg';
import { getDifficultyStyle, getDifficultyLabel } from '../utils/helpers';

const SuggestionCard = ({ suggestion, mapsData, index }) => {
    const { leaderboard } = suggestion;
    const { coverImage, songName, songAuthorName, difficulty, stars } = leaderboard;
    const songHash = leaderboard.songHash.toLowerCase();
    const songUrl = mapsData[songHash]?.versions[0].previewURL;
    const beatSaverId = mapsData[songHash]?.id;

    return (
        <div className="bg-less-dark pr-2 mb-2 shadow-md w-[90%] md:w-[40rem]" key={index}>
            <div className="flex flex-row items-center">
                {/* song cover and overlay */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    {songUrl && <SongPlayingOverlay
                        songUrl={songUrl}
                        id={index}
                    />}
                    <img src={coverImage} className="w-full h-full object-cover" />
                </div>

                {/* details */}
                <div className="flex flex-col ml-4 flex-grow min-w-0">
                    <h3
                        className="text-base truncate md:text-lg"
                        title={songName}
                    >
                        {songName}
                    </h3>
                    <p
                        className="text-sm truncate md:text-base"
                        title={songAuthorName}
                    >
                        {songAuthorName}
                    </p>
                </div>

                {/* diff and links to scoresaber etc. */}
                <div className="flex flex-col ml-4 items-end flex-shrink-0">
                    <div
                        className="flex flex-row items-center cursor-help whitespace-nowrap"
                        title={`${getDifficultyLabel(difficulty.difficulty)} difficulty`}
                    >
                        <i className={`fas fa-star ${getDifficultyStyle(difficulty.difficulty)}`}></i>
                        <p className="ml-1">{stars}</p>
                    </div>
                    <div className="flex flex-row mt-1 space-x-1 content-center">
                        <a
                            title="ScoreSaber link"
                            className="content-center"
                            href={`https://scoresaber.com/leaderboard/${leaderboard.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={scoresaberIcon} className="min-w-[18px] min-h-[18px]" alt="scoresaber icon" />
                        </a>
                        <a
                            title="BeatSaver link"
                            className="flex items-center justify-center"
                            href={`https://beatsaver.com/maps/${beatSaverId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square text-gray-400 hover:text-gray-500" />
                        </a>
                        <a title="OneClick install" className="flex items-center justify-center" href={`web+bsmap://${songHash}`}>
                            <i className="fa-solid fa-cloud-arrow-down text-gray-400 hover:text-gray-500" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionCard;