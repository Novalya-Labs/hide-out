import type { RoomContext } from "../context";

export class PositionTracker {
	constructor(private ctx: RoomContext) {}

	update(id: string, p: { lat: number; lon: number; ts: number; speed?: number; heading?: number; acc?: number }) {
		this.ctx.lastPos.set(id, p);
	}

	get(id: string) {
		return this.ctx.lastPos.get(id);
	}
}
