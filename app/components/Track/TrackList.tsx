import React from "react";
import TrackItem from "./TrackItem";
import { useTracksData } from "../../hooks/useTracksData";

interface TrackListProps {
  playlistId: string;
}

export default function TrackList({ playlistId }: TrackListProps) {
  const { tracks, loading, error } = useTracksData(playlistId);

  if (loading) return <div>Loading tracks...</div>;
  if (error) return <div>Error loading tracks</div>;

  return (
    <div>
      <h3>Tracks</h3>
      <ul>
        {tracks.map((track: any) => (
          <TrackItem key={track.track.id} track={track.track} />
        ))}
      </ul>
    </div>
  );
}
