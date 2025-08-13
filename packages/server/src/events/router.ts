import type { RoomDO } from "../do/RoomDO";
import { ackErr } from "../utils/ws";
import { type EventHandler, handlers } from "./index";

type ParsedMsg = { id?: string; type: string; payload?: unknown };

export async function route(room: RoomDO, clientId: string, ws: WebSocket, raw: MessageEvent) {
	let msg: ParsedMsg;
	try {
		const data = typeof raw.data === "string" ? raw.data : await (raw.data as Blob).text();
		msg = JSON.parse(data) as ParsedMsg;
	} catch {
		return ackErr(ws, undefined, "bad_json");
	}
	const h: EventHandler | undefined = handlers[msg.type];
	if (!h) return ackErr(ws, msg.id, "unknown_event");
	try {
		const payload = h.schema?.parse(msg.payload) ?? msg.payload;
		await h.execute(room, clientId, payload, msg.id);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : "invalid_payload";
		return ackErr(ws, msg.id, message);
	}
}
