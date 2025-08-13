import { send } from "../../utils/ws";
import type { RoomContext } from "../context";

export class SocketHub {
	constructor(private ctx: RoomContext) {}

	attach(ws: WebSocket) {
		const id = crypto.randomUUID();
		this.ctx.sockets.set(id, ws);
		ws.addEventListener("close", () => this.ctx.sockets.delete(id));
		return id;
	}

	send(toId: string, type: string, payload?: unknown, reqId?: string) {
		const ws = this.ctx.sockets.get(toId);
		if (!ws) return;
		send(ws, type, payload, reqId);
	}

	broadcast(type: string, payload?: unknown) {
		const data = JSON.stringify({ type, payload });
		for (const ws of this.ctx.sockets.values()) ws.send(data);
	}
}
