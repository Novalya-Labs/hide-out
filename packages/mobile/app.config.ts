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
		url: "https://u.expo.dev/97da40e0-ee41-4d74-8a8d-e18897634a2a",
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
		[
			"expo-secure-store",
			{
				configureAndroidBackup: true,
				faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
			},
		],
		"expo-web-browser",
		[
			"expo-location",
			{
				locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
			},
		],
		[
			"expo-camera",
			{
				cameraPermission: "Allow $(PRODUCT_NAME) to access your camera, to upload images for analysis",
				microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
				recordAudioAndroid: true,
			},
		],
		[
			"@rnmapbox/maps",
			{
				RNMapboxMapsDownloadToken: `${process.env.MAPBOX_API_KEY}`,
			},
		],
		"expo-keep-awake",
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
			projectId: "97da40e0-ee41-4d74-8a8d-e18897634a2a",
		},
	},
	experiments: {
		typedRoutes: true,
	},
};

export default config;
