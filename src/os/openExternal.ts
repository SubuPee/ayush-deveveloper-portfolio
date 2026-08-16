// Robust external-link opener.
// Preview environments run the app inside an iframe, where a plain
// `window.open` can silently fall back to in-frame navigation. Sites like
// WhatsApp/Instagram refuse to be framed (ERR_BLOCKED_BY_RESPONSE), so we
// always try a real popup / top-level anchor first and surface a fallback
// panel if the browser blocks it.

export type BlockedLink = { url: string; label?: string };

const listeners = new Set<(l: BlockedLink) => void>();

export function onLinkBlocked(fn: (l: BlockedLink) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return url;
  if (/^(https?:|mailto:|tel:|sms:)/i.test(url)) return url;
  return `https://${url.replace(/^\/+/, "")}`;
}

export function openExternal(raw: string, label?: string): boolean {
  const url = normalizeUrl(raw);
  if (!url) return false;

  // Protocol handlers must navigate the current document.
  if (/^(mailto:|tel:|sms:)/i.test(url)) {
    window.location.href = url;
    return true;
  }

  // Lovable and similar builders render previews in a sandboxed iframe.
  // A `_blank` window created there can inherit that sandbox, so LinkedIn,
  // WhatsApp, Instagram, etc. reject the framed document. A user-initiated
  // `_top` navigation escapes the preview frame and loads the site normally.
  let isFramed = false;
  try {
    isFramed = window.self !== window.top;
  } catch {
    isFramed = true;
  }

  if (isFramed) {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_top";
      a.rel = "noopener noreferrer";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch {
      listeners.forEach((fn) => fn({ url, ...(label ? { label } : {}) }));
      return false;
    }
  }

  // A top-level/published app can safely use a normal new tab.
  let popupBlocked = false;
  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) {
      try {
        win.opener = null;
      } catch {
        /* ignore */
      }
      return true;
    }
    popupBlocked = true;
  } catch {
    /* ignore */
  }

  // 2) If window.open threw (some sandboxes), try a real anchor click.
  //    When the popup was merely blocked, an anchor would load in-frame and
  //    sites that refuse framing show ERR_BLOCKED_BY_RESPONSE — so skip it.
  if (!popupBlocked) {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch {
      /* ignore */
    }
  }

  // 3) Nothing worked — let the UI offer the link manually.
  listeners.forEach((fn) => fn({ url, ...(label ? { label } : {}) }));
  return false;
}
