import React from "react";
import { Playlist } from "@/app/types/spotify";

interface PlaylistItemProps {
  playlist: Playlist;
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
