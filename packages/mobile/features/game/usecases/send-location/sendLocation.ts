import type { WsClient } from "../../services/wsClient";

export function sendLocation(ws: WsClient, p: { lat: number; lon: number; acc: number; speed?: number; heading?: number; ts: number }) {
	ws.send("location:update", p);
}
