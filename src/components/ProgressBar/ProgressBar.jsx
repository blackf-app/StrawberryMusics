import React, { useRef } from 'react';
import { formatDuration } from '../../data/tracks';
import './ProgressBar.css';

export const ProgressBar = ({ currentTime, duration, onSeek }) => {
    const progressRef = useRef(null);

    const handleClick = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        onSeek(Math.min(100, Math.max(0, percent)));
    };

    const handleDrag = (e) => {
        if (e.buttons === 1) {
            handleClick(e);
        }
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="progress-container">
            <div className="time-display">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
            </div>
            <div
                className="progress-bar-wrapper"
                ref={progressRef}
                onClick={handleClick}
                onMouseMove={handleDrag}
            >
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
};
