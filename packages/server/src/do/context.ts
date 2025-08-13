import type { GamePhase, Polygon, PublicPlayer, RoomSettings } from "../types";

export type Player = PublicPlayer & { ready?: boolean };
export type LastPos = { lat: number; lon: number; ts: number; speed?: number; heading?: number };

export interface RoomContext {
	state: DurableObjectState;
  env: { HIDEOUT_DEBUG: string; ALLOWED_ORIGINS: string } & Record<string, unknown>;
	room: {
		code: string;
		phase: GamePhase;
		endsAt: number;
		settings: RoomSettings;
		polygon: Polygon | null;
	};
	players: Map<string, Player>;
	sockets: Map<string, WebSocket>;
	lastPos: Map<string, LastPos>;
	nonces: Map<string, string>;
}
