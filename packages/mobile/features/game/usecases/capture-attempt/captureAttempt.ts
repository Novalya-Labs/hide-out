import type { WsClient } from "../../services/wsClient";

export function captureAttempt(
	ws: WsClient,
	payload: { hiderId: string; nonce: string; seekerPos: { lat: number; lon: number; ts: number } },
) {
	ws.send("capture:attempt", payload);
}
