import type { Polygon, RoomSettings, RoomSnapshot } from "../../types";
import type { RoomContext } from "../context";

export class RoomState {
	constructor(private ctx: RoomContext) {}

	async init(code: string, polygon: Polygon, settings: Partial<RoomSettings>) {
		this.ctx.room.code = code;
		this.ctx.room.polygon = polygon;
		this.ctx.room.settings = { ...this.ctx.room.settings, ...settings };
		await this.ctx.state.storage.put("room", { code, polygon, settings: this.ctx.room.settings });
	}

	snapshot(forId?: string): RoomSnapshot {
		const players = [...this.ctx.players.values()].map((p) => ({ id: p.id, name: p.name, role: p.role, status: p.status }));
		return {
			roomId: this.ctx.room.code,
			code: this.ctx.room.code,
			phase: this.ctx.room.phase,
			endsAt: this.ctx.room.endsAt,
			settings: this.ctx.room.settings,
			polygon: this.ctx.room.polygon,
			players,
			you: forId ? players.find((p) => p.id === forId) : undefined,
		};
	}
}
