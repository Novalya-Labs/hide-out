import type { ClientMsg, ServerMsg } from "../../game/types";

type Listener<T = unknown> = (p: T) => void;
type ListenerMap = Map<string, Set<Listener>>;

export class WsClient {
	private ws?: WebSocket;
	private url: string;
	private listeners: ListenerMap = new Map();

	constructor(url: string) {
		this.url = url;
	}

	connect() {
		this.ws = new WebSocket(this.url);
		this.ws.onmessage = (ev) => {
			try {
				const msg: ServerMsg = JSON.parse(ev.data as string);
				this.listeners.get(msg.type)?.forEach((cb) => cb(msg.payload));
			} catch {}
		};
	}

	on<T = unknown>(type: string, cb: Listener<T>) {
		if (!this.listeners.has(type)) this.listeners.set(type, new Set());
		const listeners = this.listeners.get(type) as Set<Listener<T>>;
		listeners.add(cb as Listener);
		return () => listeners.delete(cb as Listener);
	}

	send<T = unknown>(type: string, payload?: T, id?: string) {
		const msg: ClientMsg = { type, payload };
		if (id) msg.id = id;
		this.ws?.send(JSON.stringify(msg));
	}
}
