import { useEffect, useState } from 'react';

const sharedAudio = new Audio();

export function useSuggestionAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const play = async (songUrl, id) => {
        sharedAudio.pause();
        setCurrentlyPlaying(id);

        if (sharedAudio.src !== songUrl) {
            sharedAudio.src = songUrl;
        }

        sharedAudio.volume = 0.2;
        sharedAudio.autoplay = true;
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
        };
    }, []);

    return { play, pause, currentlyPlaying };
}