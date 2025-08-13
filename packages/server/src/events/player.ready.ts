import { z } from "zod";
import { register } from "./index";

const schema = z.object({ ready: z.boolean() });

register({
	name: "player:ready",
	schema,
	async execute(room, clientId, payload, id) {
		await room.handleReady(clientId, payload, id);
	},
});
