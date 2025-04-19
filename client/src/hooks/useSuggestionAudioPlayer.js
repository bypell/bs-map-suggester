import { useEffect, useState } from 'react';

const sharedAudio = new Audio();

export function useSuggestionAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const play = async (songUrl, id) => {
        sharedAudio.pause();
        setCurrentlyPlaying(id);
        await delay(100);

        if (sharedAudio.src !== songUrl) {
            sharedAudio.src = songUrl;

            await new Promise((resolve) => {
                const onLoadedData = () => {
                    sharedAudio.removeEventListener('loadeddata', onLoadedData);
                    resolve();
                };
                sharedAudio.addEventListener('loadeddata', onLoadedData);
                sharedAudio.load();
            });
        }

        sharedAudio.volume = 0.2;

        sharedAudio.play().catch(err => {
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
        };
    }, []);

    return { play, pause, currentlyPlaying };
}