import type { WsClient } from "../../services/wsClient";

export async function joinRoom(ws: WsClient, name: string) {
	ws.send("room:join", { name });
}
