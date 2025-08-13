import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { forwardRef } from "react";
import { TextInput, type TextInputProps, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { useTheme as useThemeContext } from "@/contexts/theme-context";
import { Text } from "./Text";

export interface InputProps extends TextInputProps {
	/**
	 * Input variant style
	 * @default 'default'
	 */
	variant?: "default" | "outlined" | "filled";

	/**
	 * Input size
	 * @default 'medium'
	 */
	size?: "small" | "medium" | "large";

	/**
	 * Label text
	 */
	label?: string;

	/**
	 * Error message to display
	 */
	error?: string;

	/**
	 * Helper text to display below input
	 */
	helperText?: string;

	/**
	 * Icon to display before input
	 */
	leftIcon?: React.ReactNode;

	/**
	 * Icon to display after input
	 */
	rightIcon?: React.ReactNode;

	/**
	 * Show password toggle for secure inputs
	 * @default false
	 */
	showPasswordToggle?: boolean;

	/**
	 * Custom container className
	 */
	containerClassName?: string;
}

/**
 * Enhanced Input component with modern styling
 */
export const Input = forwardRef<TextInput, InputProps>(
	(
		{
			variant = "default",
			size = "medium",
			label,
			error,
			helperText,
			leftIcon,
			rightIcon,
			showPasswordToggle = false,
			secureTextEntry,
			containerClassName,
			className,
			style,
			...props
		},
		ref,
	) => {
		const theme = useTheme();
		const { isDarkMode } = useThemeContext();
		const [showPassword, setShowPassword] = React.useState(false);

		// Base container classes
		const containerBaseClass = "w-full";

		// Input container classes
		const inputContainerBaseClass = "flex-row items-center rounded-2xl border-2 transition-colors";

		// Size classes
		const sizeClasses = {
			small: "h-12 px-4",
			medium: "h-14 px-5",
			large: "h-16 px-6",
		};

		// Variant classes
		const variantClasses = {
			default: error
				? "border-red-500 dark:bg-red-500/5 bg-red-500/5"
				: "border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900/30 bg-neutral-100/30 focus:border-green-500",
			outlined: error
				? "border-red-500 dark:bg-transparent bg-transparent"
				: "border-neutral-300 dark:border-neutral-700 dark:bg-transparent bg-transparent focus:border-green-500",
			filled: error
				? "border-red-500 dark:bg-red-500/5 bg-red-500/5"
				: "border-transparent dark:border-neutral-700 dark:bg-neutral-900/50 bg-neutral-100/50 focus:border-green-500",
		};

		// Text size classes
		const textSizeClasses = {
			small: "text-sm",
			medium: "text-base",
			large: "text-lg",
		};

		const inputContainerClass = twMerge(inputContainerBaseClass, sizeClasses[size], variantClasses[variant]);

		const inputClass = twMerge("flex-1 dark:text-white text-black placeholder:text-gray-400", textSizeClasses[size], className);

		const actualSecureTextEntry = showPasswordToggle ? !showPassword : secureTextEntry;

		return (
			<View className={twMerge(containerBaseClass, containerClassName)}>
				{label && <Text className="dark:text-white text-black text-base font-medium mb-3">{label}</Text>}

				<View className={inputContainerClass}>
					{leftIcon && <View className="mr-3">{leftIcon}</View>}

					<TextInput
						ref={ref}
						style={[{ color: theme.colors.text }, style]}
						className={inputClass}
						secureTextEntry={actualSecureTextEntry}
						placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
						{...props}
					/>

					{showPasswordToggle && (
						<TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-3 p-1" activeOpacity={0.7}>
							<Feather name={showPassword ? "eye" : "eye-off"} size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
						</TouchableOpacity>
					)}

					{rightIcon && !showPasswordToggle && <View className="ml-3">{rightIcon}</View>}
				</View>

				{error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}

				{helperText && !error && <Text className="text-gray-400 text-sm mt-2">{helperText}</Text>}
			</View>
		);
	},
);

Input.displayName = "Input";
