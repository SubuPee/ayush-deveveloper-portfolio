import oceanAsset from "@/assets/wallpaper-ocean.jpg.asset.json";
import cafe from "@/assets/wallpaper-cafe.jpg";
import aurora from "@/assets/wallpaper-aurora.jpg";
import dusk from "@/assets/wallpaper-dusk.jpg";
import pearl from "@/assets/wallpaper-pearl.jpg";
import ridge from "@/assets/wallpaper-ridge.jpg";
import silk from "@/assets/wallpaper-silk.jpg";

export type WallpaperId = "ocean" | "cafe" | "aurora" | "dusk" | "pearl" | "ridge" | "silk";

export const wallpapers: { id: WallpaperId; label: string; src: string }[] = [
  { id: "ocean", label: "Ocean Shore", src: oceanAsset.url },
  { id: "ridge", label: "Morning Ridge", src: ridge },
  { id: "silk", label: "Silk Waves", src: silk },
  { id: "cafe", label: "Seaside Cafe", src: cafe },
  { id: "aurora", label: "Aurora", src: aurora },
  { id: "dusk", label: "Dusk", src: dusk },
  { id: "pearl", label: "Pearl", src: pearl },
];

export const wallpaperSrc: Record<string, string> = Object.fromEntries(
  wallpapers.map((w) => [w.id, w.src]),
);

export function resolveWallpaper(id: string): string {
  return wallpaperSrc[id] ?? wallpaperSrc["ocean"]!;
}
