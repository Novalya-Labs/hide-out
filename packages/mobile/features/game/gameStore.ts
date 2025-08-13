import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/services/secure-storage";
import type { GameState, GameStore, Polygon } from "./types";
import { createRoom } from "./usecases/create-room/createRoom";

const initialState: GameState = {
	user: null,
	isLoading: false,
	theme: "SYSTEM",
};

export const useGameStore = create<GameStore>()(
	persist(
		(set) => ({
			...initialState,
			createGame: async (payload) => {
				set({ isLoading: true });
				try {
					const { code } = await createRoom(payload as { name: string; polygon: Polygon });
					return code;
				} finally {
					set({ isLoading: false });
				}
			},
			setTheme: (theme) => set({ theme }),
			resetStore: () => set(initialState),
		}),
		{
			name: "game-storage",
			storage: createJSONStorage(() => secureStorage),
			partialize: (state) => ({
				user: state.user,
				theme: state.theme,
			}),
		},
	),
);
