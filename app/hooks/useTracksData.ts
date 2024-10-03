import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPlaylistTracks } from "../lib/spotify";
import { TrackWithFeatures } from "../types/spotify";

export function useTracksData(playlistId: string) {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<TrackWithFeatures[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      if (session?.access_token && playlistId) {
        try {
          const data = await getPlaylistTracks(
            session.access_token,
            playlistId,
          );
          setTracks(data.items);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchTracks();
  }, [session, playlistId]);

  return { tracks, loading, error };
}
