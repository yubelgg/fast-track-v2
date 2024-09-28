import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAudioFeatures, getPlaylistTracks } from "../lib/spotify";

export function useTracksData(playlistId: string) {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);
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
          // list of track ids
          const trackIds = data.items.map((item: any) => item.track.id);
          // getting audio features for each track
          const audioFeatures = await getAudioFeatures(
            session.access_token,
            trackIds,
          );
          const tracksWithFeatures = data.items.map(
            (item: any, index: any) => ({
              ...item,
              audioFeatures: audioFeatures.audio_features[index],
            }),
          );
          setTracks(tracksWithFeatures);
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
