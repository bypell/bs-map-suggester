
import React, { useState, useEffect, useRef } from 'react';

function SongPlayingOverlay({ songUrl, currentlyPlaying, setCurrentlyPlaying, id }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);

    // handles when the song ends
    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
    };

    const attachListeners = () => {
        if (!audioRef.current) return;

        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    };

    // audio setup and cleanup
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = 0.2;
        }

        audioRef.current.src = songUrl;

        const cleanup = attachListeners();

        return () => {
            cleanup?.();
            audioRef.current.pause();
            audioRef.current.src = '';
        };
    }, [songUrl]);

    // handles when another song preview button is pressed while this one is playing
    useEffect(() => {
        if (currentlyPlaying !== id && isPlaying) {
            setIsPlaying(false);
            audioRef.current.pause();
        }
    }, [currentlyPlaying, id, isPlaying]);

    // handles when the song is paused or played (button clicked)
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (currentlyPlaying !== id) {
                audioRef.current.load();
            }
            audioRef.current.play();
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