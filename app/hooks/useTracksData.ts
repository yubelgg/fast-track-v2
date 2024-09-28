import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAudioFeatures, getPlaylistTracks } from "../lib/spotify";
import { TrackWithFeatures, PlaylistTrackResponse, AudioFeaturesResponse, TrackItem } from "../types/spotify";

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
          ) as PlaylistTrackResponse;
          // list of track ids
          const trackIds = data.items.map((item: TrackItem) => item.track.id);
          // getting audio features for each track
          const audioFeatures = await getAudioFeatures(
            session.access_token,
            trackIds,
          ) as AudioFeaturesResponse;

          const tracksWithFeatures: TrackWithFeatures[] = data.items.map(
            (item: TrackItem, index: number): TrackWithFeatures => ({
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
