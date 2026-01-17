import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (tracks) => {
    const audioRef = useRef(new Audio());
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'all', 'one'
    const [isLoading, setIsLoading] = useState(false);

    // Refs to hold latest values for use in event handlers
    const tracksRef = useRef(tracks);
    const currentTrackIndexRef = useRef(currentTrackIndex);
    const isShuffledRef = useRef(isShuffled);
    const repeatModeRef = useRef(repeatMode);
    const isPlayingRef = useRef(isPlaying);

    // Update refs when state changes
    useEffect(() => { tracksRef.current = tracks; }, [tracks]);
    useEffect(() => { currentTrackIndexRef.current = currentTrackIndex; }, [currentTrackIndex]);
    useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

    // Safe current track with bounds check
    const currentTrack = tracks && tracks.length > 0
        ? tracks[Math.min(currentTrackIndex, tracks.length - 1)]
        : null;

    // Reset index when tracks change
    useEffect(() => {
        if (tracks && tracks.length > 0 && currentTrackIndex >= tracks.length) {
            setCurrentTrackIndex(0);
        }
    }, [tracks, currentTrackIndex]);

    // Get next index using refs for latest state
    const getNextIndexFromRefs = useCallback(() => {
        const currentTracks = tracksRef.current;
        const currentIdx = currentTrackIndexRef.current;
        const shuffled = isShuffledRef.current;

        if (!currentTracks || currentTracks.length === 0) return 0;

        if (shuffled) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * currentTracks.length);
            } while (randomIndex === currentIdx && currentTracks.length > 1);
            return randomIndex;
        }
        return (currentIdx + 1) % currentTracks.length;
    }, []);

    // Handle track ended using refs for latest state
    const handleTrackEnded = useCallback(() => {
        const audio = audioRef.current;
        const currentRepeatMode = repeatModeRef.current;
        const shuffled = isShuffledRef.current;
        const currentTracks = tracksRef.current;
        const currentIdx = currentTrackIndexRef.current;

        if (currentRepeatMode === 'one') {
            // Repeat current track
            audio.currentTime = 0;
            audio.play().catch(console.error);
        } else {
            const nextIndex = getNextIndexFromRefs();

            // Check if we've reached the end of playlist (non-shuffle, non-repeat mode)
            if (nextIndex === 0 && currentRepeatMode === 'none' && !shuffled) {
                // Only stop if we were at the last track
                if (currentIdx === currentTracks.length - 1) {
                    setCurrentTrackIndex(0);
                    setIsPlaying(false);
                    audio.pause();
                    audio.currentTime = 0;
                } else {
                    setCurrentTrackIndex(nextIndex);
                }
            } else {
                // Continue to next track
                setCurrentTrackIndex(nextIndex);
                // Ensure we keep playing
                setIsPlaying(true);
            }
        }
    }, [getNextIndexFromRefs]);

    // Initialize audio element
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const handleEnded = () => {
            handleTrackEnded();
        };

        const handleWaiting = () => {
            setIsLoading(true);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [handleTrackEnded]);

    // Load track when currentTrackIndex changes
    useEffect(() => {
        if (currentTrack) {
            const audio = audioRef.current;
            audio.src = currentTrack.src;
            audio.load();
            setCurrentTime(0);

            // Use ref to get the latest isPlaying state
            if (isPlayingRef.current) {
                audio.play().catch(console.error);
            }
        }
    }, [currentTrackIndex, currentTrack]);

    // Update volume
    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    const play = useCallback(() => {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
    }, []);

    const pause = useCallback(() => {
        audioRef.current.pause();
        setIsPlaying(false);
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    // Get next index for manual next button (uses refs for consistency)
    const getNextIndex = useCallback(() => {
        const currentTracks = tracksRef.current;
        const currentIdx = currentTrackIndexRef.current;
        const shuffled = isShuffledRef.current;

        if (!currentTracks || currentTracks.length === 0) return 0;

        if (shuffled) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * currentTracks.length);
            } while (randomIndex === currentIdx && currentTracks.length > 1);
            return randomIndex;
        }
        return (currentIdx + 1) % currentTracks.length;
    }, []);

    // Manual next button - always go to next track and keep playing
    const handleNext = useCallback(() => {
        const audio = audioRef.current;
        const currentRepeatMode = repeatModeRef.current;

        if (currentRepeatMode === 'one') {
            // In repeat-one mode, restart current track
            audio.currentTime = 0;
            audio.play().catch(console.error);
        } else {
            // Go to next track
            const nextIndex = getNextIndex();
            setCurrentTrackIndex(nextIndex);
            setIsPlaying(true);
        }
    }, [getNextIndex]);

    // Previous button handler
    const handlePrev = useCallback(() => {
        const audio = audioRef.current;
        const currentTracks = tracksRef.current;
        const currentIdx = currentTrackIndexRef.current;

        if (!currentTracks || currentTracks.length === 0) return;

        if (audio.currentTime > 3) {
            // If more than 3 seconds in, restart current track
            audio.currentTime = 0;
        } else {
            // Go to previous track
            const prevIndex = currentIdx === 0 ? currentTracks.length - 1 : currentIdx - 1;
            setCurrentTrackIndex(prevIndex);
            setIsPlaying(true);
        }
    }, []);

    const seek = useCallback((time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }, []);

    const seekByPercent = useCallback((percent) => {
        const time = (percent / 100) * duration;
        seek(time);
    }, [duration, seek]);

    const handleVolumeChange = useCallback((newVolume) => {
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(!isMuted);
    }, [isMuted]);

    const toggleShuffle = useCallback(() => {
        setIsShuffled(!isShuffled);
    }, [isShuffled]);

    const toggleRepeat = useCallback(() => {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(repeatMode);
        setRepeatMode(modes[(currentIndex + 1) % modes.length]);
    }, [repeatMode]);

    const playTrack = useCallback((index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        // The useEffect will handle loading and playing
        setTimeout(() => {
            audioRef.current.play().catch(console.error);
        }, 100);
    }, []);

    return {
        // State
        currentTrack,
        currentTrackIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        isLoading,

        // Actions
        play,
        pause,
        toggle,
        next: handleNext,
        prev: handlePrev,
        seek,
        seekByPercent,
        setVolume: handleVolumeChange,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        playTrack,
    };
};
