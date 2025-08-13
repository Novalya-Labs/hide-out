import { createContext, useContext, useEffect, useMemo } from "react";
import { env } from "@/configs/env";
import { WsClient } from "./wsClient";

interface GameWsProviderProps {
	children: React.ReactNode;
	code: string;
}

interface GameWsContextType {
	ws: WsClient;
}

const GameWsContext = createContext<GameWsContextType | null>(null);

export const GameWsProvider: React.FC<GameWsProviderProps> = ({ children, code }) => {
	const base = env.SERVER_URL;
	const url = `${base?.replace(/\/$/, "")}/ws/${code}`.replace("http", "ws");

	const client = useMemo(() => new WsClient(url), [url]);

	useEffect(() => {
		client.connect();
	}, [client]);

	const payload: GameWsContextType = {
		ws: client,
	};

	return <GameWsContext.Provider value={payload}>{children}</GameWsContext.Provider>;
};

export const useGameWs = () => {
	const ctx = useContext(GameWsContext);
	if (!ctx) throw new Error("Ws not ready");
	return ctx;
};
