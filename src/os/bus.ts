// Centralized OS event bus. Every service publishes here; UI subscribes.
export type OSEvent =
  | "BATTERY_CHANGED"
  | "CHARGING_CHANGED"
  | "ONLINE"
  | "OFFLINE"
  | "NETWORK_CHANGED"
  | "BLUETOOTH_CONNECTED"
  | "BLUETOOTH_DISCONNECTED"
  | "LOCATION_CHANGED"
  | "WEATHER_UPDATED"
  | "TIME_CHANGED"
  | "WINDOW_OPENED"
  | "WINDOW_CLOSED"
  | "THEME_CHANGED"
  | "WIDGET_MOVED"
  | "APP_LAUNCHED";

type Handler = (payload?: unknown) => void;

const listeners = new Map<OSEvent, Set<Handler>>();

export const bus = {
  on(event: OSEvent, handler: Handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
    return () => bus.off(event, handler);
  },
  off(event: OSEvent, handler: Handler) {
    listeners.get(event)?.delete(handler);
  },
  emit(event: OSEvent, payload?: unknown) {
    listeners.get(event)?.forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        console.error("[bus]", event, err);
      }
    });
  },
};
