import type { Polygon } from "../types";
export function haversineM([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const R = 6371000;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(a));
}

export function pointInPolygon([x, y]: [number, number], poly: Polygon): boolean {
	const ring = poly.coordinates[0];
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-12) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}
