import { useState } from "react";
import { X } from "lucide-react";
import type { AppProps } from "../registry";
import { photos } from "../data";

export default function PhotosApp(_props: AppProps) {
  const [open, setOpen] = useState<string | null>(null);
  const active = photos.find((p) => p.id === open);

  return (
    <div className="relative h-full overflow-auto bg-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Library</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpen(p.id)}
            className="group overflow-hidden rounded-lg border border-border/50"
          >
            {p.src ? (
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className="h-28 w-full transition-transform duration-300 group-hover:scale-105"
                style={{ background: p.gradient }}
              />
            )}
            <p className="truncate p-2 text-left text-[11px] text-muted-foreground">{p.title}</p>
          </button>
        ))}
      </div>

      {active ? (
        <div className="absolute inset-0 z-10 flex flex-col bg-background/95 p-4 backdrop-blur">
          <button
            onClick={() => setOpen(null)}
            className="self-end rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close photo"
          >
            <X className="h-4 w-4" />
          </button>
          {active.src ? (
            <img src={active.src} alt={active.title} className="min-h-0 flex-1 rounded-xl object-contain" />
          ) : (
            <div className="flex-1 rounded-xl" style={{ background: active.gradient }} />
          )}
          <p className="pt-3 text-center text-sm">{active.title}</p>
        </div>
      ) : null}
    </div>
  );
}
