import { send } from "../../utils/ws";
import type { RoomContext } from "../context";

type Ghosts = { emit: () => void };
type Nonces = { rotateAll: () => void };

export class PhaseScheduler {
  constructor(
    private ctx: RoomContext,
    private ghosts: Ghosts,
    private nonces: Nonces,
  ) {}

	async startIfReady() {
    this.ctx.room.phase = "COUNTDOWN_HIDE";
		this.ctx.room.endsAt = Date.now() + 10_000;
		await this.ctx.state.storage.setAlarm(new Date(this.ctx.room.endsAt));
		this.broadcastPhase();
	}

	async onAlarm() {
		const now = Date.now();
    const phase = this.ctx.room.phase;
		if (phase === "COUNTDOWN_HIDE") return this.enter("HIDE", this.ctx.room.settings.hideDurationSec);
		if (phase === "HIDE") return this.enter("SEEK", this.ctx.room.settings.seekDurationSec, true);
		if (phase === "SEEK") {
			if (now >= this.ctx.room.endsAt) return this.end();
			this.nonces.rotateAll();
			this.ghosts.emit();
			await this.ctx.state.storage.setAlarm(new Date(now + Math.min(30, this.ctx.room.settings.qrTtlSec) * 1000));
		}
	}

  private async enter(phase: "HIDE" | "SEEK", durationSec: number, shortTick = false) {
		this.ctx.room.phase = phase;
		const now = Date.now();
		this.ctx.room.endsAt = now + durationSec * 1000;
		await this.ctx.state.storage.setAlarm(
			new Date(
				shortTick ? Math.min(this.ctx.room.endsAt, now + Math.min(30, this.ctx.room.settings.qrTtlSec) * 1000) : this.ctx.room.endsAt,
			),
		);
		this.broadcastPhase();
	}
	private broadcastPhase() {
		for (const ws of this.ctx.sockets.values()) send(ws, "phase", { phase: this.ctx.room.phase, endsAt: this.ctx.room.endsAt });
	}
  private async end() {
    this.ctx.room.phase = "END";
		this.broadcastPhase();
	}
}
