import React from "react";
import { useTracksData } from "../../hooks/useTracksData";
import TrackItem from "./TrackItem";
import { Track } from "@/app/types/spotify";

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
        {tracks.map((track: Track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </ul>
    </div>
  );
}
