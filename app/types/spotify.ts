export interface Playlist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
}

export interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}
