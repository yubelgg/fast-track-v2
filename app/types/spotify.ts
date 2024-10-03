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

export interface TrackWithFeatures extends TrackItemType {
  audioFeatures: AudioFeatures;
}

export interface PlaylistTrackResponse {
  items: TrackItemType[];
}

export interface AudioFeaturesResponse {
  audio_features: AudioFeatures[];
}

export interface AudioFeatures {
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  duration_ms: number;
}

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  images: {
    url: string;
  }[];
}
