import type { CreateGamePayload } from "./usecases/create-game/createGame";

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
	createGame: (payload: CreateGamePayload) => Promise<void>;
	resetStore: () => void;
	setTheme: (theme: ThemeMode) => void;
}
