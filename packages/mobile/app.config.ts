import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
	name: "Hide-Out",
	slug: "hide-out",
	owner: "novalya",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "hide-out",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	runtimeVersion: {
		policy: "appVersion",
	},
	updates: {
		url: "https://u.expo.dev/011477d7-f777-4ddd-8aa2-e036a8d2ae43",
	},
	ios: {
		bundleIdentifier: "io.hideout.app",
		supportsTablet: true,
		usesAppleSignIn: true,
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
		},
	},
	android: {
		package: "io.hideout.app",
		edgeToEdgeEnabled: true,
		adaptiveIcon: {
			foregroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
	},
	plugins: [
		"expo-router",
		"expo-localization",
		"expo-secure-store",
		"expo-web-browser",
		[
			"expo-camera",
			{
				cameraPermission: "Allow $(PRODUCT_NAME) to access your camera, to upload images for analysis",
				microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
				recordAudioAndroid: true,
			},
		],
		[
			"expo-splash-screen",
			{
				image: "./assets/images/splash-icon.png",
				imageWidth: 200,
				resizeMode: "contain",
				backgroundColor: "#000000",
			},
		],
		[
			"expo-font",
			{
				fonts: ["./assets/fonts/Inter-Medium.ttf", "./assets/fonts/Inter-SemiBold.ttf"],
			},
		],
	],
	extra: {
		eas: {
			projectId: "011477d7-f777-4ddd-8aa2-e036a8d2ae43",
		},
	},
	experiments: {
		typedRoutes: true,
	},
};

export default config;
