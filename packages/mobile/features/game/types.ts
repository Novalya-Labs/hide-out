export type Polygon = {
	type: "Polygon";
	coordinates: [number, number][][];
};
export type GamePhase = "LOBBY" | "COUNTDOWN_HIDE" | "HIDE" | "SEEK" | "END";
export type Role = "SEEKER" | "HIDER";
export type PlayerStatus = "ALIVE" | "ELIMINATED";

export interface RoomSettings {
	hideDurationSec: number;
	seekDurationSec: number;
	pingEverySec: number;
	revealApproxRadiusM: number;
	captureDistanceMaxM: number;
	speedMaxMps: number;
	qrTtlSec: number;
	locationHzHide: number;
	locationHzSeek: number;
}

export interface PublicPlayer {
	id: string;
	name: string;
	role: Role;
	status: PlayerStatus;
}
export interface RoomSnapshot {
	roomId: string;
	code: string;
	phase: GamePhase;
	endsAt?: number;
	settings: RoomSettings;
	polygon: Polygon;
	players: PublicPlayer[];
	you?: PublicPlayer;
}

export type ServerMsg = { id?: string; type: string; payload?: unknown };
export type ClientMsg = { id?: string; type: string; payload?: unknown };

export type ThemeMode = "LIGHT" | "DARK" | "SYSTEM";
export interface User {
	id: string;
	username: string;
}
export interface GameState {
	user: User | null;
	isLoading: boolean;
	theme: ThemeMode;
}
export interface GameStore extends GameState {
	createGame: (payload: { name: string; polygon: GeoJSON.Polygon }) => Promise<string | void>;
	resetStore: () => void;
	setTheme: (theme: ThemeMode) => void;
}
