/**
 * Fallback tracks data
 * These tracks are used when the app cannot connect to Vercel Blob Store
 * or when the Blob Store is empty.
 * 
 * When uploading music to Vercel Blob Store, use this naming convention:
 * - "Artist - Title.mp3" (recommended)
 * - "Artist - Album - Title.mp3" (full metadata)
 * - "Title.mp3" (minimal)
 * 
 * Supported formats: mp3, m4a, wav, ogg, flac, aac, wma
 */

export const tracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Strawberry Studios",
    album: "Night Sessions",
    duration: 245,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    // Sample audio from free sources for demo
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Electric Sunset",
    artist: "Neon Pulse",
    album: "Synthwave Collection",
    duration: 198,
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Calm Waters",
    album: "Relaxation",
    duration: 312,
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "City Lights",
    artist: "Urban Beats",
    album: "Metropolitan",
    duration: 276,
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Forest Walk",
    artist: "Nature Sounds",
    album: "Ambient Journey",
    duration: 289,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "Starlight",
    artist: "Cosmic Dreams",
    album: "Galaxy",
    duration: 234,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

// Helper function to format duration
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
