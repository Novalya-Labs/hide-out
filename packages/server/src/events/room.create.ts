import { z } from "zod";
import { RoomSettingsSchema } from "../types";
import { register } from "./index";

const schema = z.object({
	polygon: z.object({ type: z.literal("Polygon"), coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))) }),
	settings: RoomSettingsSchema.partial().optional(),
	name: z.string().min(1),
});

register({
	name: "room:create",
	schema,
	async execute(room, clientId, payload, id) {
		await room.handleCreate(clientId, payload, id);
	},
});
