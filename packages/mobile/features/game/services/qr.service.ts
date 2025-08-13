export function buildQrPayload(roomId: string, hiderId: string, nonce: string, ttlSec: number) {
	return JSON.stringify({ roomId, hiderId, nonce, exp: Date.now() + ttlSec * 1000 });
}
