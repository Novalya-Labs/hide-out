export const nowMs = () => Date.now();
export const untilMs = (futureTs: number) => Math.max(0, futureTs - Date.now());
