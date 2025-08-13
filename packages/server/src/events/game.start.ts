import { z } from "zod";
import { register } from "./index";

register({
	name: "game:start",
	schema: z.object({}).optional(),
	async execute(room, clientId, _p, id) {
		await room.handleStart(clientId, {}, id);
	},
});
