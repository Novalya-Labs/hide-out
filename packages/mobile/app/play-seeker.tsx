import { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Circle } from "react-native-maps";
import type { GhostPayload } from "@/features/game/types";
import { useGameWs } from "../features/game/services/GameWsProvider";

export default function PlaySeeker() {
	const { ws } = useGameWs();
	const [ghosts, setGhosts] = useState<{ id: string; lat: number; lon: number; r: number }[]>([]);

	useEffect(() => {
		const unsub = ws.on<GhostPayload>("ghost", (p) => {
			setGhosts((g) => [{ id: p.playerId, lat: p.centerLat, lon: p.centerLon, r: p.radiusM }, ...g.filter((x) => x.id !== p.playerId)]);
		});

		return () => {
			unsub();
		};
	}, [ws]);

	return (
		<View style={{ flex: 1 }}>
			<MapView style={{ flex: 1 }}>
				{ghosts.map((g) => (
					<Circle key={g.id} center={{ latitude: g.lat, longitude: g.lon }} radius={g.r} strokeColor="#00f" fillColor="rgba(0,0,255,0.2)" />
				))}
			</MapView>
		</View>
	);
}
