import React from "react";

interface PlaylistItemProps {
  playlist: any;
  onSelect: (playlistId: string) => void;
}

export default function PlaylistItem({
  playlist,
  onSelect,
}: PlaylistItemProps) {
  return (
    <li
      // onSelectPlaylist is passed down as the onClick handler
      onClick={() => onSelect(playlist.id)}
      style={{ cursor: "pointer", marginBottom: "10px" }}
    >
      <h3>{playlist.name}</h3>
    </li>
  );
}
