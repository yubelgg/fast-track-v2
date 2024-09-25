import React from "react";
import { Track } from "@/app/types/spotify";

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  return (
    <li>
      <p>
        {track.name} by {track.artists.map((artist) => artist.name).join(", ")}
      </p>
    </li>
  );
}
