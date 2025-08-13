import { haversineM, pointInPolygon } from "../../utils/spatial";
import type { RoomContext } from "../context";

export class CaptureService {
	constructor(private ctx: RoomContext) {}

	validate(seekerId: string, hiderId: string, nonce: string, seekerPos: { lat: number; lon: number; ts: number }) {
		const s = this.ctx.room.settings;
		const lastH = this.ctx.lastPos.get(hiderId);

		if (!lastH) return false;

		const d = haversineM([lastH.lon, lastH.lat], [seekerPos.lon, seekerPos.lat]);

		if (d > s.captureDistanceMaxM) return false;
		if (this.ctx.nonces.get(hiderId) !== nonce) return false;

		const poly = this.ctx.room.polygon;
		if (!poly) return false;

		if (!pointInPolygon([lastH.lon, lastH.lat], poly) || !pointInPolygon([seekerPos.lon, seekerPos.lat], poly)) return false;

		const spd = this.ctx.lastPos.get(seekerId)?.speed || 0;

		if (spd > s.speedMaxMps) return false;
		return true;
	}

	infect(hiderId: string) {
		const h = this.ctx.players.get(hiderId);

		if (!h || h.status !== "ALIVE") return false;
		h.role = "SEEKER";

		return true;
	}
}
