export function genRoomCode() {
	return crypto.randomUUID().slice(0, 6).toUpperCase();
}
export function genMsgId() {
	return crypto.randomUUID().slice(0, 8);
}
