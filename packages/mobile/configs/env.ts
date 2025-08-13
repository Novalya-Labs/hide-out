import { z } from "zod";

const envSchema = z.object({
	SERVER_URL: z.url(),
	APP_KEY: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	MODE: z.enum(["development", "production"]),
});

export const env = envSchema.parse({
	SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL,
	APP_KEY: process.env.EXPO_PUBLIC_APP_KEY,
	NODE_ENV: process.env.NODE_ENV,
	MODE: process.env.EXPO_PUBLIC_MODE,
});

type EnvType = typeof env;
type EnvKeys = keyof EnvType;

const validateEnv = () => {
	const missingVars: EnvKeys[] = [];

	for (const [key, value] of Object.entries(env)) {
		if (!value) {
			missingVars.push(key as EnvKeys);
		}
	}

	if (missingVars.length > 0) {
		throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
	}
};

validateEnv();
