import { z } from "zod";

export type Polygon = {
	type: "Polygon";
	coordinates: [number, number][][];
};

export type GamePhase = "LOBBY" | "COUNTDOWN_HIDE" | "HIDE" | "SEEK" | "END";
export type Role = "SEEKER" | "HIDER";
export type PlayerStatus = "ALIVE" | "ELIMINATED";

export const RoomSettingsSchema = z.object({
	hideDurationSec: z.number().int().positive(),
	seekDurationSec: z.number().int().positive(),
	pingEverySec: z.number().int().positive(),
	revealApproxRadiusM: z.number().positive(),
	captureDistanceMaxM: z.number().positive(),
	speedMaxMps: z.number().positive(),
	qrTtlSec: z.number().int().positive(),
	locationHzHide: z.number().positive(),
	locationHzSeek: z.number().positive(),
});
export type RoomSettings = z.infer<typeof RoomSettingsSchema>;

export interface PublicPlayer {
	id: string;
	name: string;
	role: Role;
	status: PlayerStatus;
	ready?: boolean;
}

export interface RoomSnapshot {
	roomId: string;
	code: string;
	phase: GamePhase;
	endsAt?: number;
	settings: RoomSettings;
	polygon: Polygon | null;
	players: PublicPlayer[];
	you?: PublicPlayer;
}

export type ClientMsg = { id?: string; type: string; payload?: unknown };
export type ServerMsg = { id?: string; type: string; payload?: unknown };
