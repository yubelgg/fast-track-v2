import React from 'react';
import { Track } from '@/app/types/spotify';

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  const artistNames = track.artists
    ? track.artists.map((artist) => artist.name).join(", ")
    : "unknown";
  return (
    <li>
      <p>
        {track.name || "unknown"} by {artistNames}
      </p>
    </li>
  );
}
