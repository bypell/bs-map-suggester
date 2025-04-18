import React from 'react';

function SongPlayingOverlay({ songUrl, id, play, pause, currentlyPlaying }) {
    const togglePlayPause = () => {
        if (currentlyPlaying === id) {
            pause();
        } else {
            play(songUrl, id);
        }
    };

    return (
        <div
            onClick={togglePlayPause}
            className={`absolute inset-0 w-full h-full flex items-center justify-center hover:cursor-pointer hover:opacity-100 bg-black bg-opacity-50 ${currentlyPlaying === id ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <i className={`fas fa-${currentlyPlaying === id ? 'pause' : 'play'} text-2xl text-white`}></i>
        </div>
    );
}

export default SongPlayingOverlay;