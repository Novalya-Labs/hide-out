import type { RoomSettings } from "./types";

export const DEFAULTS: RoomSettings = {
	hideDurationSec: 60,
	seekDurationSec: 600,
	pingEverySec: 60,
	revealApproxRadiusM: 40,
	captureDistanceMaxM: 5,
	speedMaxMps: 8,
	qrTtlSec: 10,
	locationHzHide: 0.125,
	locationHzSeek: 0.333,
};

export const EVENT_NAMES = {
	ROOM_CREATE: "room:create",
	ROOM_JOIN: "room:join",
	PLAYER_READY: "player:ready",
	GAME_START: "game:start",
	LOCATION_UPDATE: "location:update",
	CAPTURE_ATTEMPT: "capture:attempt",
} as const;
