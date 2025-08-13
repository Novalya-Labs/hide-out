import { z } from "zod";
import { register } from "./index";

const schema = z.object({
	hiderId: z.string(),
	nonce: z.string(),
	seekerPos: z.object({ lat: z.number(), lon: z.number(), ts: z.number() }),
});

register({
	name: "capture:attempt",
	schema,
	async execute(room, clientId, payload, id) {
		await room.handleCapture(clientId, payload, id);
	},
});
