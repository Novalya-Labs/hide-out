import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function End() {
	const router = useRouter();

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
			<Text>Match ended</Text>
			<Button title="Back to home" onPress={() => router.replace("/")} />
		</View>
	);
}
