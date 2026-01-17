import React from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Repeat1
} from 'lucide-react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { VolumeControl } from '../VolumeControl/VolumeControl';
import './Player.css';

export const Player = ({
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    onToggle,
    onNext,
    onPrev,
    onSeek,
    onVolumeChange,
    onToggleMute,
    onToggleShuffle,
    onToggleRepeat,
}) => {
    const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

    return (
        <div className="player-controls">
            <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={onSeek}
            />

            <div className="controls-main">
                <button
                    className={`icon-btn skip-btn`}
                    onClick={onPrev}
                    title="Previous"
                >
                    <SkipBack size={24} />
                </button>

                <button
                    className={`play-btn ${isPlaying ? 'is-playing' : ''}`}
                    onClick={onToggle}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                <button
                    className={`icon-btn skip-btn`}
                    onClick={onNext}
                    title="Next"
                >
                    <SkipForward size={24} />
                </button>
            </div>

            <div className="controls-secondary">
                <button
                    className={`icon-btn ${isShuffled ? 'active' : ''}`}
                    onClick={onToggleShuffle}
                    title="Shuffle"
                >
                    <Shuffle size={18} />
                </button>

                <VolumeControl
                    volume={volume}
                    isMuted={isMuted}
                    onVolumeChange={onVolumeChange}
                    onToggleMute={onToggleMute}
                />

                <button
                    className={`icon-btn ${repeatMode !== 'none' ? 'active' : ''}`}
                    onClick={onToggleRepeat}
                    title={`Repeat: ${repeatMode}`}
                >
                    <RepeatIcon size={18} />
                </button>
            </div>
        </div>
    );
};
