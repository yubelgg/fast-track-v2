"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { SignOutButton } from "../components/SignOutButton";
import Image from "next/image";
import PlaylistList from "../components/Playlist/PlaylistList";
import TrackList from "../components/Track/TrackList";

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

async function getRecommendations(songId: string) {
  try {
    const response = await fetch("/api/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ song_id: songId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch recommendations: ${response.status} ${errorText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    throw error;
  }
}

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
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.error === "RefreshTokenError") {
      signIn("spotify");
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!spotifyUser) {
    return <div>Unable to load user data. Please try again later.</div>;
  }

  const handleGetRecommendations = async () => {
    if (!selectedPlaylistId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getRecommendations(selectedPlaylistId);
      setRecommendations(result);
    } catch (err) {
      setError("Failed to get recommendations");
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
          <PlaylistList onSelectPlaylist={setSelectedPlaylistId} />
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
              <button onClick={handleGetRecommendations} disabled={isLoading}>
                {isLoading ? "Loading..." : "Get Recommendations"}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {recommendations.length > 0 && (
                <div>
                  <h3>Recommendations:</h3>
                  <ul>
                    {recommendations.map((song, index) => (
                      <li key={index}>{song}</li>
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
