import type { ServerMsg } from "../types";

export function send(ws: WebSocket, type: string, payload?: any, id?: string) {
	const msg: ServerMsg = { type, payload };
	if (id) msg.id = id;
	ws.send(JSON.stringify(msg));
}

export function ackOk(ws: WebSocket, id?: string) {
	send(ws, "ack", { ok: true }, id);
}
export function ackErr(ws: WebSocket, id: string | undefined, message: string) {
	send(ws, "ack", { ok: false, error: message }, id);
}
