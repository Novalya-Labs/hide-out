import type { z } from "zod";
import type { RoomDO } from "../do/RoomDO";

export type EventHandler = {
	name: string;
	schema: z.ZodTypeAny;
	execute: (room: RoomDO, clientId: string, payload: unknown, msgId?: string) => Promise<void> | void;
};

export const handlers: Record<string, EventHandler> = {} as Record<string, EventHandler>;

export function register(h: EventHandler) {
	handlers[h.name] = h;
}
