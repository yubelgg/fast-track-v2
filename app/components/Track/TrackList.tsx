import React from "react";
import { useTracksData } from "../../hooks/useTracksData";
import TrackItem from "./TrackItem";
import { TrackItemType } from "@/app/types/spotify";

interface TrackListProps {
	playlistId: string;
}

export default function TrackList({ playlistId }: TrackListProps) {
	const { tracks, loading, error } = useTracksData(playlistId);

	if (loading) return <div>Loading tracks...</div>;
	if (error) return <div>Error loading tracks</div>;

	console.log("tracks", tracks);

	return (
		<div>
			<h3>Tracks</h3>
			<ul>
				{tracks.map((item: TrackItemType, index: number) => {
					const key = item.track?.id || `track-${index}`;
					return <TrackItem key={key} track={item.track} />;
				})}
			</ul>
		</div>
	);
}
