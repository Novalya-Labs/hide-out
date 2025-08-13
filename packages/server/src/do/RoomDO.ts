import { DEFAULTS } from "../constants";
import { route } from "../events/router";
import type { Polygon } from "../types";
import { RateLimiter } from "../utils/rate";
import type { RoomContext } from "./context";
import { GhostService } from "./ghosts/GhostService";
import { NonceService } from "./nonces/NonceService";
import { PhaseScheduler } from "./phase/PhaseScheduler";
import { PlayerRegistry } from "./players/PlayerRegistry";
import { PositionTracker } from "./position/PositionTracker";
import { SocketHub } from "./sockets/SocketHub";
import { RoomState } from "./state/RoomState";

export class RoomDO implements DurableObject {
	private ctx!: RoomContext;
	private stateSvc!: RoomState;
	private sockets!: SocketHub;
	private players!: PlayerRegistry;
	private pos!: PositionTracker;
	private nonces!: NonceService;
	private ghosts!: GhostService;
	private phases!: PhaseScheduler;
	private rate = new RateLimiter(5);

	constructor(
		private state: DurableObjectState,
		private env: Record<string, unknown>,
	) {
		this.ctx = {
			state: this.state,
			env: this.env as Record<string, unknown>,
			room: { code: "", phase: "LOBBY", endsAt: 0, settings: DEFAULTS, polygon: null },
			players: new Map(),
			sockets: new Map(),
			lastPos: new Map(),
			nonces: new Map(),
		} as RoomContext;
		this.stateSvc = new RoomState(this.ctx);
		this.sockets = new SocketHub(this.ctx);
		this.players = new PlayerRegistry(this.ctx);
		this.pos = new PositionTracker(this.ctx);
		this.nonces = new NonceService(this.ctx);
		this.ghosts = new GhostService(this.ctx);
		this.phases = new PhaseScheduler(this.ctx, this.ghosts, this.nonces);
	}

	async fetch(req: Request) {
		const url = new URL(req.url);
		if (req.method === "POST" && url.pathname === "/init") {
			const { code, polygon, settings } = (await req.json()) as {
				code: string;
				polygon: Polygon;
				settings?: Partial<typeof DEFAULTS>;
			};
			await this.stateSvc.init(code, polygon, settings || {});
			return new Response("OK");
		}
		if (req.headers.get("Upgrade") === "websocket") {
			const pair = new WebSocketPair();
			const client = pair[0];
			const server = pair[1];
			// @ts-ignore
			server.accept();
			const id = this.sockets.attach(server);
			server.addEventListener("message", (ev) => {
				if (!this.rate.allow(id)) {
					try {
						server.send(JSON.stringify({ type: "ack", payload: { ok: false, error: "rate_limited" } }));
					} catch {}
					return;
				}
				route(this, id, server, ev);
			});
			server.send(JSON.stringify({ type: "snapshot", payload: this.stateSvc.snapshot(id) }));
			return new Response(null, { status: 101, webSocket: client });
		}
		return new Response("Not found", { status: 404 });
	}

	async alarm() {
		await this.phases.onAlarm();
	}

	async handleCreate(
		clientId: string,
		payload: { polygon: Polygon; settings?: Partial<import("../types").RoomSettings>; name: string },
		id?: string,
	) {
		this.players.join(clientId, payload.name);
		if (payload.settings) Object.assign(this.ctx.room.settings, payload.settings);
		this.ctx.room.polygon = payload.polygon;
		this.sockets.send(clientId, "ack", { ok: true }, id);
	}
	async handleJoin(clientId: string, payload: { name: string }, id?: string) {
		this.players.join(clientId, payload.name);
		this.sockets.send(clientId, "ack", { ok: true }, id);
	}
	async handleReady(clientId: string, p: { ready: boolean }, id?: string) {
		this.players.setReady(clientId, p.ready);
		this.sockets.send(clientId, "ack", { ok: true }, id);
	}
	async handleStart(clientId: string, _p: Record<string, never>, id?: string) {
		if (this.ctx.room.phase !== "LOBBY") return;
		if (!this.players.allReady()) return;
		this.players.assignRandomSeeker();
		await this.phases.startIfReady();
		this.sockets.send(clientId, "ack", { ok: true }, id);
	}
	async handleLocation(
		clientId: string,
		p: { lat: number; lon: number; acc: number; speed?: number; heading?: number; ts: number },
		id?: string,
	) {
		this.pos.update(clientId, p);
		if (id) this.sockets.send(clientId, "ack", { ok: true }, id);
	}
	async handleCapture(
		clientId: string,
		p: { hiderId: string; nonce: string; seekerPos: { lat: number; lon: number; ts: number } },
		id?: string,
	) {
		const svcMod = await import("./capture/CaptureService");
		const ok = new svcMod.CaptureService(this.ctx).validate(clientId, p.hiderId, p.nonce, p.seekerPos);
		if (!ok) return this.sockets.send(clientId, "ack", { ok: false, error: "capture_refused" }, id);
		const changed = new svcMod.CaptureService(this.ctx).infect(p.hiderId);
		if (!changed) return this.sockets.send(clientId, "ack", { ok: false, error: "invalid_target" }, id);
		this.sockets.broadcast("capture_ok", { hiderId: p.hiderId, by: clientId, ts: Date.now() });
		this.sockets.send(clientId, "ack", { ok: true }, id);
		if (!this.players.anyHiderAlive()) this.ctx.room.phase = "END";
	}
}
