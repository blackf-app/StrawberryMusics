import React from 'react';
import './NowPlaying.css';

export const NowPlaying = ({ track, isPlaying, isLoading }) => {
    if (!track) return null;

    return (
        <div className="now-playing">
            <div className={`album-art-container ${isPlaying ? 'playing' : ''}`}>
                <div className="album-art-glow" />
                <img
                    src={track.cover}
                    alt={`${track.title} album art`}
                    className={`album-art ${isPlaying ? 'playing' : ''}`}
                />
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner" />
                    </div>
                )}
            </div>

            <div className="track-info">
                <h2 className="track-title">{track.title}</h2>
                <p className="track-artist">{track.artist}</p>
                <p className="track-album">{track.album}</p>
            </div>
        </div>
    );
};
