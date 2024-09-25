import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserPlaylists } from "../lib/spotify";

export function usePlaylistsData() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      if (session?.access_token) {
        try {
          const data = await getUserPlaylists(session.access_token);
          setPlaylists(data.items);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPlaylists();
  }, [session]);

  return { playlists, loading, error };
}
