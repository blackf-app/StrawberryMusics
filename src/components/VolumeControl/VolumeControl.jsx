import React, { useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import './VolumeControl.css';

export const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }) => {
    const sliderRef = useRef(null);

    const handleClick = (e) => {
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        onVolumeChange(Math.min(1, Math.max(0, percent)));
    };

    const handleDrag = (e) => {
        if (e.buttons === 1) {
            handleClick(e);
        }
    };

    const displayVolume = isMuted ? 0 : volume;

    const VolumeIcon = displayVolume === 0
        ? VolumeX
        : displayVolume < 0.5
            ? Volume1
            : Volume2;

    return (
        <div className="volume-control">
            <button className="icon-btn" onClick={onToggleMute}>
                <VolumeIcon size={20} />
            </button>
            <div className="volume-slider-container">
                <div
                    className="volume-slider"
                    ref={sliderRef}
                    onClick={handleClick}
                    onMouseMove={handleDrag}
                >
                    <div
                        className="volume-slider-fill"
                        style={{ width: `${displayVolume * 100}%` }}
                    />
                    <div
                        className="volume-slider-thumb"
                        style={{ left: `${displayVolume * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
