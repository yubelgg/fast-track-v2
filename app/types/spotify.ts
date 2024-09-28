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

export interface TrackItemType {
  track: Track;
}

export interface AudioFeatures {
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
}

export interface TrackWithFeatures extends TrackItemType {
  audioFeatures: AudioFeatures;
}

export interface PlaylistTrackResponse {
  items: TrackItemType[];
}

export interface AudioFeaturesResponse {
  audio_features: AudioFeatures[];
}
