import { Hono } from "hono";
import type { RoomDO } from "./do/RoomDO";
import { genRoomCode } from "./utils/ids";

import "./events/room.create";
import "./events/room.join";
import "./events/player.ready";
import "./events/game.start";
import "./events/location.update";
import "./events/capture.attempt";

export type Env = {
	ROOMS: DurableObjectNamespace<RoomDO>;
	HIDEOUT_DEBUG: string;
	ALLOWED_ORIGINS: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post("/rooms", async (c) => {
	const code = genRoomCode();
	const id = c.env.ROOMS.idFromName(code);
	const stub = c.env.ROOMS.get(id);
	const body = await c.req.json();
	await stub.fetch("https://init", { method: "POST", body: JSON.stringify({ code, ...body }) });
	return c.json({ code });
});

app.get("/ws/:code", async (c) => {
	const code = c.req.param("code");
	const id = c.env.ROOMS.idFromName(code);
	const stub = c.env.ROOMS.get(id);
	return await stub.fetch(c.req.raw);
});

export default app;
export { RoomDO } from "./do/RoomDO";
