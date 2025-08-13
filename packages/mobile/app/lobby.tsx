import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Switch, Text, View } from "react-native";
import { GameWsProvider, useGameWs } from "@/features/game/services/GameWsProvider";
import { playerReady } from "@/features/game/usecases/player-ready/playerReady";

function LobbyInner() {
	const router = useRouter();
	const { ws } = useGameWs();
	const [ready, setReady] = useState(false);
	const [players, setPlayers] = useState<any[]>([]);
	const [allReady, setAllReady] = useState(false);
	const [accept, setAccept] = useState(false);

	useEffect(() => {
		const u1 = ws.on("snapshot", (p: any) => {
			setPlayers(p.players || []);
		});

		const u2 = ws.on("phase", (p: any) => {
			if (p.phase === "COUNTDOWN_HIDE" || p.phase === "HIDE") router.replace("/play-hider");
			if (p.phase === "SEEK") router.replace("/play-seeker");
			if (p.phase === "END") router.replace("/end");
		});

		return () => {
			u1();
			u2();
		};
	}, [ws, router]);

	useEffect(() => {
		setAllReady(players.length >= 2 && players.every((p) => p.ready));
	}, [players]);

	return (
		<View style={{ flex: 1, padding: 16, gap: 12 }}>
			<Text>Players</Text>
			<FlatList
				data={players}
				keyExtractor={(p) => p.id}
				renderItem={({ item }) => (
					<Text>
						{item.name} {item.ready ? "✅" : "⏳"}
					</Text>
				)}
			/>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
				<Switch
					value={ready}
					onValueChange={(v) => {
						setReady(v);
						playerReady(ws, v);
					}}
				/>
				<Text>Ready</Text>
			</View>
			<View style={{ paddingVertical: 8 }}>
				<Text>Play safely outdoors. Be aware of surroundings. I accept.</Text>
				<Switch value={accept} onValueChange={setAccept} />
			</View>
			<Button title="Start" onPress={() => ws.send("game:start", {})} disabled={!accept || !allReady} />
		</View>
	);
}

export default function Lobby() {
	const { code } = useLocalSearchParams<{ code: string; name: string }>();

	return (
		<GameWsProvider code={code}>
			<LobbyInner />
		</GameWsProvider>
	);
}
