import { z } from "zod";
import { register } from "./index";

const schema = z.object({ name: z.string().min(1) });

register({
	name: "room:join",
	schema,
	async execute(room, clientId, payload, id) {
		await room.handleJoin(clientId, payload, id);
	},
});
