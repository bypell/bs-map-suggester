
import React, { useState, useEffect } from 'react';

let sharedAudio = null;

function SongPlayingOverlay({ songUrl, currentlyPlaying, setCurrentlyPlaying, id }) {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!sharedAudio) {
            sharedAudio = new Audio();
        }

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentlyPlaying(null);
        };

        sharedAudio.addEventListener('ended', handleEnded);

        return () => {
            sharedAudio.removeEventListener('ended', handleEnded);
        };
    }, [setCurrentlyPlaying]);

    useEffect(() => {
        if (currentlyPlaying !== id && isPlaying) {
            setIsPlaying(false);
        }
    }, [currentlyPlaying, id, isPlaying]);

    const togglePlayPause = () => {
        if (isPlaying) {
            sharedAudio.pause();
        } else {
            if (currentlyPlaying !== id) {
                sharedAudio.src = songUrl;
                sharedAudio.load();
            }
            sharedAudio.volume = 0.2;
            sharedAudio.play();
            setCurrentlyPlaying(id);
        }
        setIsPlaying(!isPlaying);
    };

    if (!songUrl) return null;

    return (
        <div
            onClick={togglePlayPause}
            className={`absolute inset-0 w-full h-full flex items-center justify-center hover:cursor-pointer hover:opacity-100 bg-black bg-opacity-50 ${isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-2xl text-white`}></i>
        </div>
    );
};

export default SongPlayingOverlay;