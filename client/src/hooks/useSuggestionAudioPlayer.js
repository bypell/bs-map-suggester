import { useEffect, useState } from 'react';

const sharedAudio = new Audio();

export function useSuggestionAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const play = (songUrl, id) => {
        if (sharedAudio.src && !sharedAudio.paused) {
            sharedAudio.pause();
            sharedAudio.currentTime = 0;
        }

        if (sharedAudio.src !== songUrl) {
            sharedAudio.src = songUrl;
        }

        sharedAudio.volume = 0.2;

        setTimeout(() => {
            sharedAudio.play().catch(err => {
                console.warn('Audio play error:', err);
            });
        }, 10);

        setCurrentlyPlaying(id);
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