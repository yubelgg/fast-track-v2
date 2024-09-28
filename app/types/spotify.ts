export interface Playlist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
}

export interface Artist {
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
}

export interface TrackItem {
  track: Track;
}

export interface TrackWithFeatures extends Track {
  audioFeatures: AudioFeatures;
}

export interface AudioFeatures {
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
}

export interface PlaylistTrackResponse {
  items: TrackItem[];
}

export interface AudioFeaturesResponse {
  audio_features: AudioFeatures[];
}
