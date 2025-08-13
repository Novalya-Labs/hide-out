import type { RoomContext } from "../context";

export class NonceService {
	constructor(private ctx: RoomContext) {}

	rotateFor(hiderId: string) {
		this.ctx.nonces.set(hiderId, crypto.randomUUID().slice(0, 8));
	}

	rotateAll() {
		for (const p of this.ctx.players.values()) if (p.status === "ALIVE" && p.role === "HIDER") this.rotateFor(p.id);
	}

	get(hiderId: string) {
		return this.ctx.nonces.get(hiderId);
	}
}
