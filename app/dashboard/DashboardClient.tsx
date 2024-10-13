"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { SignOutButton } from "../components/SignOutButton";
import Image from "next/image";
import PlaylistList from "../components/Playlist/PlaylistList";
import TrackList from "../components/Track/TrackList";
import { getRecommendations, getPlaylistSongs } from "../utils/api";

export type SpotifyUser = {
  id: string;
  displayName: string | null;
  email: string | null;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }> | null;
  country?: string;
  product?: string;
};

export default function DashboardClient({
  initialSpotifyUser,
}: {
  initialSpotifyUser: SpotifyUser | null;
}) {
  const { data: session, status } = useSession();
  const [spotifyUser] = useState(initialSpotifyUser);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.error === "RefreshTokenError") {
      signIn("spotify");
    }
  }, [session, status]);

  // Function to handle selection of a playlist and fetching its song IDs
  const handleSelectPlaylist = async (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    // Fetch songs from the selected playlist
    try {
      const songIds = await getPlaylistSongs(playlistId); // Use getPlaylistSongs
      setSelectedSongIds(songIds);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch songs from the playlist");
    }
  };

  const handleGetRecommendations = async () => {
    if (!selectedSongIds.length) {
      setError("No songs selected for recommendations");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const recs = await getRecommendations(selectedSongIds, 5); // Pass array of song IDs
      setRecommendations(recs);
    } catch (err) {
      setError("Failed to get recommendations");
      console.error("Failed to get recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <SignOutButton />
      <p>Your Spotify user name is: {spotifyUser?.displayName}</p>
      <p>Your Spotify pfp is: </p>
      <Image
        src={spotifyUser?.images?.[0]?.url ?? ""}
        alt="Spotify Profile Picture"
        width={100}
        height={100}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2>Your Playlists</h2>
          <PlaylistList onSelectPlaylist={handleSelectPlaylist} />
        </div>
        {selectedPlaylistId && (
          <div>
            <h2>Playlist Tracks</h2>
            <TrackList playlistId={selectedPlaylistId} />
          </div>
        )}
        <div>
          {selectedPlaylistId ? (
            <>
              <button onClick={handleGetRecommendations} disabled={isLoading || !selectedSongIds.length}>
                {isLoading ? "Loading..." : "Get Recommendations"}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {recommendations.length > 0 && (
                <div>
                  <h3>Recommendations:</h3>
                  <ul>
                    {recommendations.map((rec) => (
                      <li key={rec}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p>Select a playlist to get recommendations</p>
          )}
        </div>
      </div>
    </div>
  );
}