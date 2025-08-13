import { send } from "../../utils/ws";
import type { RoomContext } from "../context";

export class GhostService {
	constructor(private ctx: RoomContext) {}

	emit() {
		const r = this.ctx.room.settings.revealApproxRadiusM;
		const hiders = [...this.ctx.players.values()].filter((p) => p.status === "ALIVE" && p.role === "HIDER");
		for (const h of hiders) {
			const pos = this.ctx.lastPos.get(h.id);
			if (!pos) continue;
			for (const [cid, ws] of this.ctx.sockets) {
				const me = this.ctx.players.get(cid);
				if (me?.role !== "SEEKER" || me.status !== "ALIVE") continue;
				send(ws, "ghost", { playerId: h.id, centerLat: pos.lat, centerLon: pos.lon, radiusM: r });
			}
			const nonce = this.ctx.nonces.get(h.id);
			const ws = this.ctx.sockets.get(h.id);
			if (ws && nonce) send(ws, "qr:update", { nonce, expSec: this.ctx.room.settings.qrTtlSec });
		}
	}
}
