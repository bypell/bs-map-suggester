import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioPlayerContext = createContext();

const sharedAudio = new Audio();

export function AudioPlayerProvider({ children }) {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const play = async (songUrl, id) => {
        sharedAudio.pause();
        setCurrentlyPlaying(id);

        console.log('Playing song:', songUrl, id);

        await delay(200);

        if (songUrl === undefined || songUrl === null) {
            console.warn('No song URL provided. Cannot play audio.');
            return;
        }

        if (sharedAudio.src !== songUrl) {
            sharedAudio.src = songUrl;
        }

        sharedAudio.volume = 0.2;

        sharedAudio.play().catch((err) => {
            console.warn('Audio play error:', err);
        });
    };

    const pause = () => {
        sharedAudio.pause();
        setCurrentlyPlaying(null);
    };

    const handleEnded = () => {
        setCurrentlyPlaying(null);
    };

    useEffect(() => {
        sharedAudio.addEventListener('ended', handleEnded);
        return () => {
            sharedAudio.removeEventListener('ended', handleEnded);
            sharedAudio.pause();
            sharedAudio.src = '';
            setCurrentlyPlaying(null);
        };
    }, []);

    return (
        <AudioPlayerContext.Provider value={{ play, pause, currentlyPlaying }}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayer() {
    return useContext(AudioPlayerContext);
}