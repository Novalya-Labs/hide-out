import { Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import "@/i18n/index";
import "../global.css";
import { darkTheme, lightTheme } from "@/configs/colors";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
	initialRouteName: "index",
};

const InternalRootLayout = () => {
	const { isDarkMode } = useTheme();

	return (
		<NavigationThemeProvider value={isDarkMode ? darkTheme : lightTheme}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" options={{ title: "Hide-Out" }} />
				<Stack.Screen name="create" options={{ title: "Create" }} />
				<Stack.Screen name="lobby" options={{ title: "Lobby" }} />
				<Stack.Screen name="play-hider" options={{ title: "Hider" }} />
				<Stack.Screen name="play-seeker" options={{ title: "Seeker" }} />
				<Stack.Screen name="end" options={{ title: "End" }} />
			</Stack>
		</NavigationThemeProvider>
	);
};

function RootLayout() {
	const [fontsLoaded] = useFonts({ Inter_500Medium, Inter_600SemiBold });

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<ThemeProvider>
					<InternalRootLayout />
				</ThemeProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}

export default RootLayout;
