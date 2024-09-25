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

  // Your dashboard content here
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
      </div>
    </div>
  );
}
