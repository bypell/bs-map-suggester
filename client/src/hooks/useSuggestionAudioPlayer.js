import { useEffect, useState } from 'react';

const sharedAudio = new Audio();

export function useSuggestionAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const play = async (songUrl, id) => {
        setCurrentlyPlaying(id);

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

    return { play, pause, currentlyPlaying };
}