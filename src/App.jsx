import React, { useEffect } from 'react';
import { Music, RefreshCw, Cloud, HardDrive } from 'lucide-react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useTracks } from './hooks/useTracks';
import { NowPlaying } from './components/NowPlaying/NowPlaying';
import { Player } from './components/Player/Player';
import { TrackList } from './components/TrackList/TrackList';
import './App.css';

function App() {
  // Fetch tracks from Blob Store
  const {
    tracks,
    isLoading: isLoadingTracks,
    error: tracksError,
    isUsingFallback,
    refresh: refreshTracks
  } = useTracks();

  const {
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
    toggle,
    next,
    prev,
    seekByPercent,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    playTrack,
  } = useAudioPlayer(tracks);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            next();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            prev();
          }
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyS':
          toggleShuffle();
          break;
        case 'KeyR':
          toggleRepeat();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, next, prev, toggleMute, toggleShuffle, toggleRepeat]);

  // Loading state while fetching tracks
  if (isLoadingTracks) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading tracks from cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <Music size={28} />
          <h1 className="app-title">Strawberry Music</h1>
        </div>
        <div className="header-actions">
          <div className="source-indicator" title={isUsingFallback ? 'Using local demo tracks' : 'Loaded from Vercel Blob Store'}>
            {isUsingFallback ? <HardDrive size={16} /> : <Cloud size={16} />}
            <span>{isUsingFallback ? 'Demo' : 'Cloud'}</span>
          </div>
          <button
            className="refresh-btn"
            onClick={refreshTracks}
            title="Refresh tracks from cloud"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {tracksError && (
        <div className="error-banner">
          <span>⚠️ Could not load from cloud. Using demo tracks.</span>
        </div>
      )}

      <main className="app-content">
        <div className="main-panel">
          <NowPlaying
            track={currentTrack}
            isPlaying={isPlaying}
            isLoading={isLoading}
          />

          <Player
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isShuffled={isShuffled}
            repeatMode={repeatMode}
            onToggle={toggle}
            onNext={next}
            onPrev={prev}
            onSeek={seekByPercent}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
          />
        </div>

        <aside className="sidebar">
          <TrackList
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            onTrackSelect={playTrack}
          />
        </aside>
      </main>

      <div className="keyboard-hint">
        <span><kbd>Space</kbd> Play/Pause</span>
        <span><kbd>Shift</kbd>+<kbd>←</kbd><kbd>→</kbd> Prev/Next</span>
        <span><kbd>M</kbd> Mute</span>
        <span><kbd>S</kbd> Shuffle</span>
        <span><kbd>R</kbd> Repeat</span>
      </div>
    </div>
  );
}

export default App;

