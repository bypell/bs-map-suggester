import { React, useState, useEffect } from 'react';
import SongPlayingOverlay from './SongPlayingOverlay';
import scoresaberIcon from '../assets/scoresaber.svg';
import { getDifficultyStyle, getDifficultyLabel } from '../utils/helpers';

export default function SuggestionCard({ suggestion, mapsData, index, play, pause, currentlyPlaying }) {
    const { leaderboard } = suggestion;
    const { coverImage, songName, songAuthorName, difficulty, stars } = leaderboard;
    const songHash = leaderboard.songHash.toLowerCase();
    const songUrl = mapsData[songHash]?.versions[0].previewURL;
    const beatSaverId = mapsData[songHash]?.id;

    return (
        <div className={`bg-less-dark pr-2 mb-2 shadow-md w-[90%] md:w-[40rem]`} key={index} >
            <div className='flex flex-row items-center'>
                <div className='relative w-20 h-20'>
                    <SongPlayingOverlay
                        songUrl={songUrl}
                        id={index}
                        play={play}
                        pause={pause}
                        currentlyPlaying={currentlyPlaying}
                    />
                    <img src={coverImage} alt="song cover image" />
                </div>
                <div className='flex flex-col ml-4'>
                    <h3 className="text-base truncate max-w-[14rem] md:max-w-[20rem] lg:max-w-[25rem]" title={songName}>{songName}</h3>
                    <p className='text-sm truncate max-w-[6rem] md:max-w-[20rem] lg:max-w-[25rem]' title={songAuthorName}>{songAuthorName}</p>
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
        </div >
    );
};