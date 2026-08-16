import { useEffect, useState } from "react";
import { Copy, ExternalLink, X } from "lucide-react";
import { onLinkBlocked, openExternal, type BlockedLink } from "@/os/openExternal";

/**
 * Global link handling for the OS shell:
 * - intercepts every external anchor and escapes sandboxed previews through
 *   top-level navigation so sites cannot be loaded inside an iframe
 * - shows a fallback panel with the URL when the browser blocks the popup
 */
export function LinkLayer() {
  const [blocked, setBlocked] = useState<BlockedLink | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const off = onLinkBlocked(setBlocked);
    return () => {
      off();
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a || a.dataset["rawLink"] !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const external = a.target === "_blank" || /^(https?:|mailto:|tel:|sms:|\/\/)/i.test(href);
      if (!external) return;
      e.preventDefault();
      openExternal(href, a.textContent?.trim() || undefined);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!blocked) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[min(420px,90vw)] rounded-2xl border border-white/15 bg-neutral-900/95 p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Open {blocked.label ?? "link"}</p>
            <p className="mt-1 text-xs text-white/60">
              Your browser blocked the new tab. Use the button below to continue.
            </p>
          </div>
          <button onClick={() => setBlocked(null)} className="rounded p-1 hover:bg-white/10" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 truncate rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80">{blocked.url}</p>

        <div className="mt-4 flex gap-2">
          <a
            href={blocked.url}
            target={typeof window !== "undefined" && window.self !== window.top ? "_top" : "_blank"}
            rel="noopener noreferrer"
            data-raw-link=""
            onClick={(e) => {
              e.stopPropagation();
              setBlocked(null);
            }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium hover:bg-sky-400"
          >
            <ExternalLink className="h-4 w-4" /> Open link
          </a>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(blocked.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                /* ignore */
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
