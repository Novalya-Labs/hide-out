import { z } from "zod";
import { register } from "./index";

const schema = z.object({
	lat: z.number(),
	lon: z.number(),
	acc: z.number(),
	speed: z.number().optional(),
	heading: z.number().optional(),
	ts: z.number(),
});

register({
	name: "location:update",
	schema,
	async execute(room, clientId, payload, id) {
		await room.handleLocation(clientId, payload, id);
	},
});
