import type { WsClient } from "../../services/wsClient";

export async function playerReady(ws: WsClient, ready: boolean) {
	ws.send("player:ready", { ready });
}
