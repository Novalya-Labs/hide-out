import * as Location from "expo-location";

export async function startHighAccuracyBackground(
	onPosition: (p: { lat: number; lon: number; acc: number; speed?: number; heading?: number; ts: number }) => void,
) {
	const { status } = await Location.requestForegroundPermissionsAsync();

	if (status !== "granted") throw new Error("perm_denied");

	await Location.requestBackgroundPermissionsAsync();
	await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 1 }, (loc) => {
		onPosition({
			lat: loc.coords.latitude,
			lon: loc.coords.longitude,
			acc: loc.coords.accuracy || 0,
			speed: loc.coords.speed || 0,
			heading: loc.coords.heading || 0,
			ts: Date.now(),
		});
	});
}
