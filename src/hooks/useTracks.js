import { useState, useEffect, useCallback } from 'react';
import { tracks as fallbackTracks } from '../data/tracks';

/**
 * Hook to fetch tracks from Vercel Blob Store API
 * Falls back to static tracks if API fails or returns empty
 */
export const useTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    const fetchTracks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/tracks');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.tracks && data.tracks.length > 0) {
                setTracks(data.tracks);
                setIsUsingFallback(false);
            } else {
                // API returned empty or error, use fallback
                console.warn('No tracks from API, using fallback tracks');
                setTracks(fallbackTracks);
                setIsUsingFallback(true);
            }
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
            setError(err.message);

            // Use fallback tracks on error
            setTracks(fallbackTracks);
            setIsUsingFallback(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

    // Refresh function for manual reload
    const refresh = useCallback(() => {
        fetchTracks();
    }, [fetchTracks]);

    return {
        tracks,
        isLoading,
        error,
        isUsingFallback,
        refresh,
    };
};
