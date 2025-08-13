import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const lightTheme: ReactNavigation.Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "#FFFFFF",
		card: "#FFFFFF",
	},
};

export const darkTheme: ReactNavigation.Theme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: "#121212",
		card: "#121212",
	},
};
