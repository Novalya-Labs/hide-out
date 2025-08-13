import { ToastPosition, toast } from "@backpackapp-io/react-native-toast";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
import i18n from "@/i18n/index";

export interface NotificationOptionsProps {
	type: NotificationType;
	message: string;
	translate?: boolean;
	duration?: number;
	position?: ToastPosition;
}

export type NotificationType = "success" | "error";

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_TOAST_POSITION = ToastPosition.TOP;

class NotificationService {
	async notify(options: NotificationOptionsProps): Promise<void> {
		toast.dismiss();

		const displayMessage = options.translate ? i18n.t(options.message) : options.message;

		if (options.type === "error") {
			toast.error(displayMessage, {
				duration: options.duration ?? DEFAULT_TOAST_DURATION,
				position: options.position ?? DEFAULT_TOAST_POSITION,
				icon: (
					<View
						testID="error-icon-container"
						style={{
							backgroundColor: "red",
							borderRadius: 999,
							width: 20,
							height: 20,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Icon name="close" size={13} color="#242C32" />
					</View>
				),
				styles: {
					indicator: { display: "none" },
					text: { marginLeft: 10, fontWeight: "bold", fontSize: 14, color: "white" },
					view: { backgroundColor: "#242C32", borderRadius: 6 },
				},
			});
		}

		if (options.type === "success") {
			toast.success(displayMessage, {
				duration: options.duration ?? DEFAULT_TOAST_DURATION,
				position: options.position ?? DEFAULT_TOAST_POSITION,
				icon: (
					<View
						testID="success-icon-container"
						style={{
							backgroundColor: "#00DF80",
							borderRadius: 999,
							width: 20,
							height: 20,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Icon name="check" size={13} color="#242C32" />
					</View>
				),
				styles: {
					indicator: { display: "none" },
					text: { marginLeft: 10, fontWeight: "bold", fontSize: 14, color: "white" },
					view: { backgroundColor: "#242C32", borderRadius: 6 },
				},
			});
		}
		return Promise.resolve();
	}

	async dismiss(): Promise<void> {
		toast.dismiss();
		return Promise.resolve();
	}
}

export const notificationService = new NotificationService();
