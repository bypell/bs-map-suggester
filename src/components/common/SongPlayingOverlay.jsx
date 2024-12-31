
import React, { useState, useEffect } from 'react';

function SongPlayingOverlay({ songUrl, currentlyPlaying, setCurrentlyPlaying, id }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        audioElement.volume = 0.2;

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentlyPlaying(null);
        };

        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('ended', handleEnded);
        };
    }, [setCurrentlyPlaying]);

    useEffect(() => {
        if (currentlyPlaying !== id && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentlyPlaying, id, isPlaying]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // audioRef.current.load();
            if (currentlyPlaying !== id) {
                audioRef.current.load();
            }
            audioRef.current.play();
            setCurrentlyPlaying(id);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            onClick={togglePlayPause}
            className={`absolute inset-0 w-full h-full flex items-center justify-center hover:cursor-pointer hover:opacity-100 bg-black bg-opacity-50 ${isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <audio ref={audioRef} src={songUrl} />
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-2xl text-white`}></i>
        </div>
    );
};

export default SongPlayingOverlay;