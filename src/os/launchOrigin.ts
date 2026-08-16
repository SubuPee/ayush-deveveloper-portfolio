import type { AppId } from "./registry";

export type LaunchRect = { x: number; y: number; width: number; height: number };

const origins = new Map<AppId, LaunchRect>();

/** Remember where an app was launched from (dock/desktop icon) for the open animation. */
export function setLaunchOrigin(appId: AppId, rect: LaunchRect) {
  origins.set(appId, rect);
}

/** Consume the stored origin — it is only valid for the next window that opens. */
export function takeLaunchOrigin(appId: AppId): LaunchRect | null {
  const rect = origins.get(appId);
  if (!rect) return null;
  origins.delete(appId);
  return rect;
}
