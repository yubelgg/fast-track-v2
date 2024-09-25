import { Playlist } from "@/app/types/spotify";
import { usePlaylistsData } from "../../hooks/usePlaylistsData";
import PlaylistItem from "./PlaylistItem";

interface PlaylistListProps {
  onSelectPlaylist: (playlistId: string) => void;
}

export default function PlaylistList({ onSelectPlaylist }: PlaylistListProps) {
  const { playlists, loading, error } = usePlaylistsData();

  if (loading) return <div>Loading playlists...</div>;
  if (error) return <div>Error loading playlists</div>;

  return (
    <ul>
      {playlists.map((playlist: Playlist) => (
        // playlist={playlist} passes the playlist object to the PlaylistItem component
        // to access properties of the playlist object
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          onSelect={onSelectPlaylist}
        />
      ))}
    </ul>
  );
}
