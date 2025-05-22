import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function SongPlayingOverlay({ songUrl, id }) {
    const { play, pause, currentlyPlaying } = useAudioPlayer();

    const togglePlayPause = () => {
        if (currentlyPlaying === id) {
            pause();
        } else {
            if (!songUrl) {
                console.warn('No song URL provided. Cannot play audio.');
                return;
            }

            play(songUrl, id);
        }
    };

    return (
        <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer hover:opacity-100 bg-black bg-opacity-50 ${currentlyPlaying === id ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={togglePlayPause}
        >
            <i className={`fas fa-${currentlyPlaying === id ? 'pause' : 'play'} text-2xl text-white`}></i>
        </div>
    );
}

export default SongPlayingOverlay;