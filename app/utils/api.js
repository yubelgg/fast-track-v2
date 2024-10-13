export const getRecommendations = async (songIds, topN = 5) => {
    let baseUrl;
    let method = 'POST';
    let body;

    if (process.env.NODE_ENV === 'production') {
        // In production, API routes are handled by Vercel
        baseUrl = '/api/recommend';
        body = JSON.stringify({ song_ids: songIds, top_n: topN });
    } else {
        // In development, point to the FastAPI backend
        baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Should be http://localhost:8000/
        body = JSON.stringify({ song_ids: songIds, top_n: topN });
    }

    const res = await fetch(baseUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    return data.recommendations;
};

export const getPlaylistSongs = async (playlistId) => {
    let baseUrl;

    if (process.env.NODE_ENV === 'production') {
        // In production, API routes are handled by Vercel under /api
        baseUrl = '/api/playlist_songs';
    } else {
        // In development, point to the FastAPI backend
        baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist_songs`;
    }

    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.append('playlist_id', playlistId);

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    return data.song_ids;
};