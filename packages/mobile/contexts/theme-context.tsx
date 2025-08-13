import { useColorScheme as useColorSchemeNativewind } from "nativewind";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { useGameStore } from "@/features/game/gameStore";
import type { ThemeMode } from "@/features/game/gameTypes";

interface ThemeContextType {
	isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
	isDarkMode: false,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { setColorScheme } = useColorSchemeNativewind();
	const colorScheme = useColorScheme();
	const { theme } = useGameStore();

	const isDarkMode = theme === "DARK" || (theme === "SYSTEM" && colorScheme === "dark");

	useEffect(() => {
		setColorScheme(theme === "LIGHT" ? "light" : theme === "DARK" ? "dark" : "system");
	}, [theme, setColorScheme]);

	return <ThemeContext.Provider value={{ isDarkMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { theme, setTheme } = useGameStore();

	return {
		theme,
		isDarkMode,
		setTheme: (theme: ThemeMode) => setTheme(theme),
	};
};

export default ThemeContext;
