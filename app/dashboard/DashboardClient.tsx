"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { SignOutButton } from "../components/SignOutButton";
import Image from "next/image";
import PlaylistList from "../components/Playlist/PlaylistList";
import TrackList from "../components/Track/TrackList";
import { getRecommendations } from "../utils/api";

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
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.error === "RefreshTokenError") {
      signIn("spotify");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!selectedPlaylistId) {
        setRecommendations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const recs = await getRecommendations(selectedPlaylistId, 5);
        setRecommendations(recs);
      } catch (err) {
        setError("Failed to get recommendations");
        console.error("Failed to get recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedPlaylistId]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <SignOutButton />
        <div className="mt-4">
          <p className="mb-2">Your Spotify user name is: {spotifyUser?.displayName}</p>
          {spotifyUser?.images?.[0]?.url && (
            <Image
              src={spotifyUser.images[0].url}
              alt="Spotify Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
          <PlaylistList onSelectPlaylist={setSelectedPlaylistId} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Playlist Tracks</h2>
          {selectedPlaylistId ? (
            <TrackList playlistId={selectedPlaylistId} />
          ) : (
            <p className="text-gray-500">Select a playlist to view tracks</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Recommendations</h2>
          {isLoading ? (
            <p className="text-gray-300">Loading recommendations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : recommendations.length > 0 ? (
            <div className="mt-4">
              <ul className="space-y-2">
                {recommendations.map((rec) => (
                  <li 
                    key={rec} 
                    className="p-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-300">Select a playlist to get recommendations</p>
          )}
        </div>
      </div>
    </div>
  );
}