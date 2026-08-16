// Real-world brand marks rendered as macOS-style squircle tiles.
export type BrandId =
  | "youtube"
  | "linkedin"
  | "gemini"
  | "netflix"
  | "instagram"
  | "chatgpt"
  | "vscode"
  | "github"
  | "figma"
  | "whatsapp"
  | "blogger"
  | "pdf"
  | "folder"
  | "journal"
  | "spotify"
  | "codex"
  | "deepseek"
  | "devlyhub"
  | "terminal";

const tile = "flex items-center justify-center rounded-[22%] overflow-hidden";

function Tile({ bg, children, className }: { bg: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`${tile} ${className ?? ""} shadow-[0_8px_18px_rgba(15,23,42,0.35)]`}
      style={{ background: bg, width: "100%", height: "100%" }}
    >
      {children}
    </span>
  );
}

export function BrandIcon({ id, className }: { id: BrandId; className?: string }) {
  const wrap = (bg: string, svg: React.ReactNode) => (
    <span className={className} style={{ display: "inline-flex" }}>
      <Tile bg={bg}>{svg}</Tile>
    </span>
  );

  switch (id) {
    case "youtube":
      return wrap(
        "#ffffff",
        <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden>
          <path
            fill="#FF0000"
            d="M23 12s0-3.6-.46-5.32a2.9 2.9 0 0 0-2.04-2.05C18.78 4.17 12 4.17 12 4.17s-6.78 0-8.5.46A2.9 2.9 0 0 0 1.46 6.7C1 8.4 1 12 1 12s0 3.6.46 5.32a2.9 2.9 0 0 0 2.04 2.05c1.72.46 8.5.46 8.5.46s6.78 0 8.5-.46a2.9 2.9 0 0 0 2.04-2.05C23 15.6 23 12 23 12Z"
          />
          <path fill="#fff" d="M9.9 15.3V8.7l5.6 3.3-5.6 3.3Z" />
        </svg>,
      );
    case "linkedin":
      return wrap(
        "#0A66C2",
        <svg viewBox="0 0 24 24" width="58%" height="58%" fill="#fff" aria-hidden>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.43-.03-3.28-2-3.28-2 0-2.3 1.56-2.3 3.18V21h-4V9Z" />
        </svg>,
      );
    case "gemini":
      return wrap(
        "#ffffff",
        <svg viewBox="0 0 24 24" width="66%" height="66%" aria-hidden>
          <defs>
            <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="45%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gem)"
            d="M12 2c.4 4.6 3.4 7.6 8 8-4.6.4-7.6 3.4-8 8-.4-4.6-3.4-7.6-8-8 4.6-.4 7.6-3.4 8-8Z"
          />
        </svg>,
      );
    case "netflix":
      return wrap(
        "#0b0b0b",
        <svg viewBox="0 0 24 24" width="52%" height="66%" aria-hidden>
          <path fill="#E50914" d="M6 2h4l4 12V2h4v20h-4L10 10v12H6V2Z" />
        </svg>,
      );
    case "instagram":
      return wrap(
        "linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 80%,#4f5bd5)",
        <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" stroke="none" />
        </svg>,
      );
    case "chatgpt":
      return wrap(
        "#ffffff",
        <svg viewBox="0 0 24 24" width="62%" height="62%" fill="#10A37F" aria-hidden>
          <path d="M12 2.2a4.2 4.2 0 0 1 3.65 2.12 4.2 4.2 0 0 1 4.2 6.28 4.2 4.2 0 0 1-3.65 6.3A4.2 4.2 0 0 1 12 21.8a4.2 4.2 0 0 1-3.65-2.12 4.2 4.2 0 0 1-4.2-6.28A4.2 4.2 0 0 1 7.8 7.1 4.2 4.2 0 0 1 12 2.2Zm0 2.1a2.1 2.1 0 0 0-2.05 1.6l4.1 2.37v4.2l1.85-1.06V6.9L12 4.3Zm-4.7 4.05L7.3 12.5l3.65 2.1-1.85 1.07-3.64-2.1a2.1 2.1 0 0 0 1.84 3.1l4.1-2.37 3.64 2.1v2.13a2.1 2.1 0 0 0 3.06-1.5l-4.1-2.37V10.5l-1.85-1.07v4.2L8.4 15.7a2.1 2.1 0 0 1-1.1-7.35Z" />
        </svg>,
      );
    case "vscode":
      return wrap(
        "#1f1f1f",
        <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden>
          <path fill="#0098FF" d="m17.5 3-8.2 7.7-4-3L3.2 9.1 6.9 12l-3.7 2.9 2.1 1.4 4-3L17.5 21l3.3-1.6V4.6L17.5 3Zm.6 4.1v9.8l-5.5-4.9 5.5-4.9Z" />
        </svg>,
      );
    case "github":
      return wrap(
        "#181717",
        <svg viewBox="0 0 24 24" width="62%" height="62%" fill="#fff" aria-hidden>
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.69-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.7.12 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.66.64.7 1.03 1.59 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>,
      );
    case "figma":
      return wrap(
        "#ffffff",
        <svg viewBox="0 0 24 24" width="52%" height="62%" aria-hidden>
          <path fill="#F24E1E" d="M8.5 2h3.5v5H8.5a2.5 2.5 0 0 1 0-5Z" />
          <path fill="#FF7262" d="M12 2h3.5a2.5 2.5 0 0 1 0 5H12V2Z" />
          <path fill="#1ABCFE" d="M15.5 7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
          <path fill="#A259FF" d="M8.5 7H12v5H8.5a2.5 2.5 0 0 1 0-5Z" />
          <path fill="#0ACF83" d="M8.5 12H12v2.5a2.5 2.5 0 1 1-3.5-2.5Z" />
        </svg>,
      );
    case "whatsapp":
      return wrap(
        "linear-gradient(135deg,#5BD066,#25D366)",
        <svg viewBox="0 0 24 24" width="60%" height="60%" fill="#fff" aria-hidden>
          <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm5 12.3c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.2-3.9c-.4-.6-.7-1.4-.7-2 0-.7.3-1.2.6-1.5.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .5.4l.7 1.6c0 .2 0 .3-.1.5l-.3.4c-.1.2-.3.3-.1.6.3.5.7 1 1.2 1.4.6.5 1.1.7 1.4.9.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.3.1.2.1.5-.1 1.1Z" />
        </svg>,
      );
    case "blogger":
      return wrap(
        "#FF5722",
        <svg viewBox="0 0 24 24" width="58%" height="58%" fill="#fff" aria-hidden>
          <path d="M14 4H9.5A5.5 5.5 0 0 0 4 9.5v5A5.5 5.5 0 0 0 9.5 20h5a5.5 5.5 0 0 0 5.5-5.5V12h-2.5a1.5 1.5 0 0 1-1.5-1.5V8a4 4 0 0 0-2-4Zm-4.3 4.2h3a1.1 1.1 0 1 1 0 2.2h-3a1.1 1.1 0 0 1 0-2.2Zm0 5.3h5a1.1 1.1 0 1 1 0 2.2h-5a1.1 1.1 0 0 1 0-2.2Z" />
        </svg>,
      );
    case "spotify":
      return wrap(
        "#1DB954",
        <svg viewBox="0 0 24 24" width="62%" height="62%" fill="#000" aria-hidden>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.4 14.5a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 1 1-.3-1.5c4.8-1.1 8.9-.6 12.2 1.4.4.2.5.7.3 1Zm1.3-3a1 1 0 0 1-1.3.3c-3.4-2-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.6 14.2 1.8.4.3.6.9.3 1.3Zm.1-3.2C14 8 7.9 7.7 4.3 8.8a1.2 1.2 0 1 1-.7-2.3c4.1-1.2 10.9-1 15.2 1.6a1.2 1.2 0 1 1-1.2 2.1Z" />
        </svg>,
      );
    case "pdf":
      return wrap(
        "linear-gradient(135deg,#f8fafc,#e2e8f0)",
        <svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden>
          <path fill="#DC2626" d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path fill="#fff" d="M6.6 12.5h10.8v5.2H6.6z" />
          <text x="12" y="16.6" textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#DC2626">
            PDF
          </text>
        </svg>,
      );
    case "journal":
      return wrap(
        "#111827",
        <svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden>
          <path fill="#f472b6" d="M11.5 5v14c-1.8-1.5-4-2.2-6.5-2.2V3.4C7.5 3.4 9.7 4 11.5 5Z" />
          <path fill="#60a5fa" d="M12.5 5c1.8-1 4-1.6 6.5-1.6v13.4c-2.5 0-4.7.7-6.5 2.2V5Z" />
        </svg>,
      );
    case "folder":
      return wrap(
        "linear-gradient(135deg,#FDBA3B,#F59E0B)",
        <svg viewBox="0 0 24 24" width="0" height="0" aria-hidden />,
      );
    case "codex":
      return wrap(
        "linear-gradient(135deg,#2f3540,#12151b)",
        <svg viewBox="0 0 24 24" width="56%" height="56%" fill="none" stroke="#e5e7eb" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m6 8.5 3.5 3.5L6 15.5M12.5 16H18" />
        </svg>,
      );
    case "deepseek":
      return wrap(
        "#ffffff",
        <svg viewBox="0 0 24 24" width="66%" height="66%" aria-hidden>
          <path
            fill="#4D6BFE"
            d="M20.6 6.4c-.7.5-1.3 1.1-2.2 1-1.5-.2-2.6-1.2-4.2-1-1.7.2-2.9 1.2-3.6 2.7-.6-.4-1.2-.9-1.6-1.5-.5-.7-.8-1.6-1.6-2-.3.9-.2 1.9.2 2.7.4.9 1.1 1.5 1.8 2.1-.6.7-1 1.5-1.1 2.4-.2 1.6.5 3.1 1.7 4.1 1.4 1.2 3.3 1.6 5.1 1.4 1.9-.2 3.7-1.1 4.8-2.7 1.1-1.6 1.3-3.7.7-5.5.5-.4 1-.9 1.2-1.5.3-.7.2-1.5-.2-2.2Zm-4.7 4.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z"
          />
        </svg>,
      );
    case "devlyhub":
      return wrap(
        "#0b0b12",
        <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden>
          <defs>
            <linearGradient id="devlyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
          <path
            fill="url(#devlyGrad)"
            d="M12 2.5c3.4 2 5.6 5.6 5.6 9.5 0 3.9-2.2 7.5-5.6 9.5-3.4-2-5.6-5.6-5.6-9.5 0-3.9 2.2-7.5 5.6-9.5Zm0 4.6c-1.6 1.3-2.6 3-2.6 4.9s1 3.6 2.6 4.9c1.6-1.3 2.6-3 2.6-4.9s-1-3.6-2.6-4.9Z"
          />
        </svg>,
      );
    case "terminal":
    default:
      return wrap(
        "#111827",
        <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="#4ade80" strokeWidth="2" aria-hidden>
          <path d="m5 8 4 4-4 4M12 16h7" />
        </svg>,
      );
  }
}
