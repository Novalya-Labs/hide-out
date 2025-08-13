import { z } from "zod";

const createGameSchema = z.object({
	gamerId: z.string(),
});

export type CreateGamePayload = z.infer<typeof createGameSchema>;

export const createGame = async (payload: CreateGamePayload) => {};
