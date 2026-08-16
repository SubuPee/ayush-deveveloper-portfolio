import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Music2, ExternalLink } from "lucide-react";
import type { AppProps } from "../registry";

type Genre = "bollywood" | "hollywood" | "chill";
type Item = { id: string; uri: string; title: string; subtitle: string; genre: Genre };

const genres: { key: Genre; label: string }[] = [
  { key: "bollywood", label: "Bollywood" },
  { key: "hollywood", label: "Hollywood" },
  { key: "chill", label: "Chill" },
];

const playlists: Item[] = [
  { id: "37i9dQZF1DX0XUsuxWHRQd", uri: "spotify:playlist:37i9dQZF1DX0XUsuxWHRQd", title: "Bollywood Butter", subtitle: "Spotify · Hindi hits", genre: "bollywood" },
  { id: "37i9dQZF1DWXtlo6ENS92N", uri: "spotify:playlist:37i9dQZF1DWXtlo6ENS92N", title: "Bollywood Acoustic", subtitle: "Spotify · Unplugged", genre: "bollywood" },
  { id: "37i9dQZF1DX5cZuAHLNjGz", uri: "spotify:playlist:37i9dQZF1DX5cZuAHLNjGz", title: "Hot Hits Hindi", subtitle: "Spotify · India", genre: "bollywood" },
  { id: "37i9dQZF1DXcBWIGoYBM5M", uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M", title: "Today's Top Hits", subtitle: "Spotify · Global pop", genre: "hollywood" },
  { id: "37i9dQZF1DX7F6T2n2fegs", uri: "spotify:playlist:37i9dQZF1DX7F6T2n2fegs", title: "Hollywood Soundtracks", subtitle: "Spotify · Cinema", genre: "hollywood" },
  { id: "37i9dQZF1DWXRqgorJj26U", uri: "spotify:playlist:37i9dQZF1DWXRqgorJj26U", title: "Rock Classics", subtitle: "Spotify · Western", genre: "hollywood" },
  { id: "37i9dQZF1DWWQRwui0ExPn", uri: "spotify:playlist:37i9dQZF1DWWQRwui0ExPn", title: "Lofi Beats", subtitle: "Spotify · Focus", genre: "chill" },
  { id: "37i9dQZF1DX4WYpdgoIcn6", uri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6", title: "Chill Hits", subtitle: "Spotify · Relax", genre: "chill" },
];

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: any) => void;
    __spotifyIframeApi?: any;
  }
}

function loadSpotifyApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);
  return new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      resolve(api);
    };
    if (!document.getElementById("spotify-iframe-api")) {
      const s = document.createElement("script");
      s.id = "spotify-iframe-api";
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      document.body.appendChild(s);
    }
  });
}

export default function MusicApp(_props: AppProps) {
  const [genre, setGenre] = useState<Genre>("bollywood");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any>(null);
  const current = playlists[index]!;

  useEffect(() => {
    let cancelled = false;
    loadSpotifyApi().then((api) => {
      if (cancelled || !api || !hostRef.current) return;
      api.createController(
        hostRef.current,
        { uri: current.uri, width: "100%", height: 352 },
        (controller: any) => {
          if (cancelled) {
            controller.destroy?.();
            return;
          }
          controllerRef.current = controller;
          setReady(true);
          controller.addListener?.("playback_update", (e: any) => {
            setPlaying(!e?.data?.isPaused);
          });
        },
      );
    });
    return () => {
      cancelled = true;
      controllerRef.current?.destroy?.();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (i: number) => {
    setIndex(i);
    const uri = playlists[i]!.uri;
    controllerRef.current?.loadUri?.(uri);
    controllerRef.current?.play?.();
  };

  const filtered = playlists.filter((p) => p.genre === genre);
  const posInGenre = filtered.findIndex((p) => p.id === current.id);
  const step = (dir: 1 | -1) => {
    if (!filtered.length) return;
    const base = posInGenre < 0 ? 0 : posInGenre;
    const next = filtered[(base + dir + filtered.length) % filtered.length]!;
    select(playlists.indexOf(next));
  };
  const pickGenre = (g: Genre) => {
    setGenre(g);
    const first = playlists.find((p) => p.genre === g);
    if (first && first.id !== current.id) select(playlists.indexOf(first));
  };

  return (
    <div className="flex h-full flex-col bg-[#0e0e0e] text-white">
      <div className="flex items-center gap-4 border-b border-white/10 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#1ed760] to-[#0b7c37]">
          <Music2 className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-white/50">Live on Spotify</p>
          <p className="truncate text-lg font-semibold">{current.title}</p>
          <p className="truncate text-sm text-white/60">{current.subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => step(-1)} aria-label="Previous playlist">
            <SkipBack className="h-5 w-5 text-white/70 hover:text-white" />
          </button>
          <button
            disabled={!ready}
            onClick={() => {
              controllerRef.current?.togglePlay?.();
              setPlaying((p) => !p);
            }}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1ed760] text-black disabled:opacity-40"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => step(1)} aria-label="Next playlist">
            <SkipForward className="h-5 w-5 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-white/10">
          <div className="flex gap-1 border-b border-white/10 p-2">
            {genres.map((g) => (
              <button
                key={g.key}
                onClick={() => pickGenre(g.key)}
                className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium transition ${
                  genre === g.key ? "bg-[#1ed760] text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-2">
          {filtered.map((p, n) => (
            <button
              key={p.id}
              onClick={() => select(playlists.indexOf(p))}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                p.id === current.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="w-4 text-white/40">{n + 1}</span>
              <span className="flex-1 truncate">
                {p.title}
                <span className="block truncate text-xs text-white/50">{p.subtitle}</span>
              </span>
            </button>
          ))}
          <a
            href={`https://open.spotify.com/playlist/${current.id}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open in Spotify
          </a>
          </div>
        </div>
        <div className="min-w-0 flex-1 overflow-auto p-4">
          <div ref={hostRef} className="w-full" />
          {!ready ? (
            <p className="mt-3 text-xs text-white/40">Connecting to Spotify…</p>
          ) : (
            <p className="mt-3 text-xs text-white/40">
              Log in to Spotify in this browser to hear full tracks; otherwise previews play.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
