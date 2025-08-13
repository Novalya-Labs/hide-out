import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Index() {
	const router = useRouter();

	const [code, setCode] = useState("");
	const [name, setName] = useState("");

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<Text>Join room</Text>
			<TextInput placeholder="Code" value={code} onChangeText={setCode} style={{ borderWidth: 1, padding: 8 }} />
			<TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8 }} />
			<Button title="Join" onPress={() => router.push({ pathname: "/lobby", params: { code, name } })} />
			<View style={{ height: 20 }} />
			<Button title="Create room" onPress={() => router.push("/create")} />
		</View>
	);
}
