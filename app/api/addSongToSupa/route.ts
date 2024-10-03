import { NextResponse } from "next/server";
import { default as supabaseServer } from "@/app/lib/supabaseServer";
import { TrackWithFeatures } from "@/app/types/spotify";

export async function POST(request: Request) {
  try {
    const { tracks } = await request.json();
    // Remove duplicates within the incoming batch
    const uniqueTracks = Array.from(
      new Map(tracks.map((track: TrackWithFeatures) => [track.track.id, track])).values()
    );
    const { data, error } = await supabaseServer
      .from('songs')
      .upsert(uniqueTracks.map((track: unknown) => {
        const typedTrack = track as TrackWithFeatures;
        return {
          id: typedTrack.track.id,
          name: typedTrack.track.name,
          artists: typedTrack.track.artists[0].name,
          danceability: typedTrack.audioFeatures.danceability,
          energy: typedTrack.audioFeatures.energy,
          loudness: typedTrack.audioFeatures.loudness,
          speechiness: typedTrack.audioFeatures.speechiness,
          acousticness: typedTrack.audioFeatures.acousticness,
          instrumentalness: typedTrack.audioFeatures.instrumentalness,
          liveness: typedTrack.audioFeatures.liveness,
          valence: typedTrack.audioFeatures.valence,
          tempo: typedTrack.audioFeatures.tempo,
          duration_ms: typedTrack.audioFeatures.duration_ms,
        };
      }))
    if (error) {
      console.error("Error adding songs to supabase:", error);
      return NextResponse.json({ error: "Failed to add songs to supabase" }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error adding songs to supabase:", error);
    return NextResponse.json({ error: "Failed to add songs to supabase" }, { status: 500 });
  }
}