import type { RoomContext } from "../context";

export class PlayerRegistry {
	constructor(private ctx: RoomContext) {}
	join(id: string, name: string) {
		this.ctx.players.set(id, { id, name, role: "HIDER", status: "ALIVE", ready: false });
	}

	setReady(id: string, ready: boolean) {
		const p = this.ctx.players.get(id);
		if (!p) return;
		p.ready = ready;
	}

	assignRandomSeeker() {
		const ids = [...this.ctx.players.keys()];
		const seeker = ids[Math.floor(Math.random() * ids.length)];
		for (const p of this.ctx.players.values()) p.role = p.id === seeker ? "SEEKER" : "HIDER";
	}

	anyHiderAlive() {
		return [...this.ctx.players.values()].some((p) => p.status === "ALIVE" && p.role === "HIDER");
	}

	allReady() {
		return this.ctx.players.size >= 2 && [...this.ctx.players.values()].every((p) => p.ready);
	}
}
