import { useEffect, useState } from 'react';

const sharedAudio = new Audio();

export function useSuggestionAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const play = (songUrl, id) => {
        console.log('old:', currentlyPlaying, 'new:', id, 'new src:', songUrl);
        sharedAudio.src = songUrl;
        sharedAudio.load();
        sharedAudio.volume = 0.2;
        sharedAudio.play();
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