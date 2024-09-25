import React from "react";

interface TrackItemProps {
  track: any;
}

export default function TrackItem({ track }: TrackItemProps) {
  return (
    <li>
      <p>
        {track.name} by{" "}
        {track.artists.map((artist: any) => artist.name).join(", ")}
      </p>
    </li>
  );
}
