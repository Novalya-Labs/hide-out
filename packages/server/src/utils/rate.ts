export class RateLimiter {
	private buckets = new Map<string, { count: number; exp: number }>();
	constructor(private capacityPerSec: number) {}
	allow(key: string, now = Date.now()) {
		const cur = this.buckets.get(key);
		if (!cur || now > cur.exp) {
			this.buckets.set(key, { count: 1, exp: now + 1000 });
			return true;
		}
		if (cur.count >= this.capacityPerSec) return false;
		cur.count += 1;
		return true;
	}
}
