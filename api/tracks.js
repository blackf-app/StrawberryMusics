import { list } from '@vercel/blob';

// Supported audio extensions
const AUDIO_EXTENSIONS = /\.(mp3|m4a|wav|ogg|flac|aac|wma)$/i;

// Default cover images for tracks without metadata
const DEFAULT_COVERS = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
];

/**
 * Extract metadata from filename
 * Supports formats:
 * - "Artist - Title.mp3"
 * - "Title.mp3"
 * - "Artist - Album - Title.mp3"
 */
function parseFilename(pathname) {
    // Get filename without extension and path
    const filename = pathname.split('/').pop().replace(AUDIO_EXTENSIONS, '');

    // Try to parse "Artist - Title" or "Artist - Album - Title" format
    const parts = filename.split(' - ').map(p => p.trim());

    if (parts.length >= 3) {
        return {
            artist: parts[0],
            album: parts[1],
            title: parts.slice(2).join(' - '),
        };
    } else if (parts.length === 2) {
        return {
            artist: parts[0],
            album: 'Unknown Album',
            title: parts[1],
        };
    } else {
        return {
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            title: filename,
        };
    }
}

/**
 * Get a consistent cover image based on track index
 */
function getCoverImage(index) {
    return DEFAULT_COVERS[index % DEFAULT_COVERS.length];
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // List all blobs from Vercel Blob Store
        const { blobs } = await list();

        // Filter only audio files
        const audioBlobs = blobs.filter(blob => AUDIO_EXTENSIONS.test(blob.pathname));

        // Sort by upload date (newest first) or alphabetically
        audioBlobs.sort((a, b) => a.pathname.localeCompare(b.pathname));

        // Map blobs to track format
        const tracks = audioBlobs.map((blob, index) => {
            const metadata = parseFilename(blob.pathname);

            return {
                id: index + 1,
                title: metadata.title,
                artist: metadata.artist,
                album: metadata.album,
                duration: 0, // Will be determined client-side when audio loads
                cover: getCoverImage(index),
                src: blob.url,
                size: blob.size,
                uploadedAt: blob.uploadedAt,
            };
        });

        return res.status(200).json({
            success: true,
            count: tracks.length,
            tracks,
        });
    } catch (error) {
        console.error('Error listing blobs:', error);

        // Check if it's a configuration error
        if (error.message?.includes('BLOB_READ_WRITE_TOKEN')) {
            return res.status(500).json({
                success: false,
                error: 'Vercel Blob Store not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.',
                tracks: [],
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch tracks from blob storage',
            tracks: [],
        });
    }
}
