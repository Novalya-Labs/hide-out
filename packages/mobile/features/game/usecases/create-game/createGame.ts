import type { Polygon } from "../../types";
export type CreateGamePayload = { name: string; polygon: Polygon };
export const createGame = async (_payload: CreateGamePayload) => {};
