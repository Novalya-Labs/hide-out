import { useKeepAwake } from "expo-keep-awake";
import React from "react";
import { View } from "react-native";
import SvgQRCode from "react-native-qrcode-svg";
import { useGameWs } from "../features/game/services/GameWsProvider";
import { buildQrPayload } from "../features/game/services/qr.service";

export default function PlayHider() {
	useKeepAwake();
	const { ws } = useGameWs();
	const [nonce, setNonce] = React.useState("");
	const [ttl, setTtl] = React.useState(10);
	const [roomId, setRoomId] = React.useState("");
	const [me, setMe] = React.useState("");

	React.useEffect(() => {
		const u1 = ws.on("snapshot", (p: any) => {
			setRoomId(p.roomId);
			setMe(p.you?.id);
		});
		const u2 = ws.on("qr:update", (p: any) => {
			setNonce(p.nonce);
			setTtl(p.expSec || 10);
		});
		return () => {
			u1();
			u2();
		};
	}, [ws]);

	const payload = buildQrPayload(roomId, me, nonce, ttl);
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<SvgQRCode value={payload} size={300} />
		</View>
	);
}
