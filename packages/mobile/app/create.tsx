import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import MapView, { Polygon as MapPolygon, type MapPressEvent } from "react-native-maps";
import type { Polygon } from "../features/game/types";
import { createRoom } from "../features/game/usecases/create-room/createRoom";

export default function Create() {
	const [points, setPoints] = useState<{ latitude: number; longitude: number }[]>([]);
	const [creating, setCreating] = useState(false);
	const router = useRouter();

	const onPress = (e: MapPressEvent) => {
		setPoints((prev) => [...prev, e.nativeEvent.coordinate]);
	};

	const onCreate = async () => {
		if (points.length < 3) return;
		setCreating(true);
		try {
			const ring: [number, number][] = points.map((p) => [p.longitude, p.latitude]) as [number, number][];
			ring.push([points[0].longitude, points[0].latitude]);
			const polygon: Polygon = {
				type: "Polygon",
				coordinates: [ring],
			};
			const { code } = await createRoom({ name: "Host", polygon });
			router.replace({ pathname: "/lobby", params: { code, name: "Host" } });
		} finally {
			setCreating(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<MapView style={{ flex: 1 }} onPress={onPress}>
				{points.length >= 3 && <MapPolygon coordinates={points} strokeColor="#f00" fillColor="rgba(255,0,0,0.2)" />}
			</MapView>
			<View style={{ padding: 12 }}>
				<Text>Tap to add polygon points. Min 3 points.</Text>
				<Button title={creating ? "Creating..." : "Create"} onPress={onCreate} disabled={creating || points.length < 3} />
			</View>
		</View>
	);
}
