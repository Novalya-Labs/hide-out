import { env } from "@/configs/env";
import type { Polygon, RoomSettings } from "../../types";

export async function createRoom(payload: { name: string; polygon: Polygon; settings?: Partial<RoomSettings> }) {
	const r = await fetch(`${env.SERVER_URL}/rooms`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!r.ok) throw new Error("failed_create_room");

	return (await r.json()) as { code: string };
}
