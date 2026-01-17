import React from 'react';
import { Music } from 'lucide-react';
import { formatDuration } from '../../data/tracks';
import './TrackList.css';

export const TrackList = ({ tracks, currentTrackIndex, isPlaying, onTrackSelect }) => {
    if (!tracks || tracks.length === 0) {
        return (
            <div className="track-list">
                <div className="track-list-empty">
                    <Music size={48} />
                    <p>No tracks available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="track-list">
            <div className="track-list-header">
                <h3 className="track-list-title">Playlist</h3>
                <span className="track-count">{tracks.length} tracks</span>
            </div>

            <div className="track-list-container">
                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
                        onClick={() => onTrackSelect(index)}
                    >
                        <div className="track-play-indicator">
                            {index === currentTrackIndex && isPlaying ? (
                                <div className="playing-bars">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                <img
                                    src={track.cover}
                                    alt={track.title}
                                    className="track-thumbnail"
                                />
                            )}
                        </div>

                        <div className="track-details">
                            <div className="track-item-title">{track.title}</div>
                            <div className="track-item-artist">{track.artist}</div>
                        </div>

                        <span className="track-duration">
                            {formatDuration(track.duration)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
