import { useState } from "react";
import type { AppProps } from "../registry";
import { useOS, type Settings } from "../store";
import { CapabilityService, DeviceService } from "../services";
import { Row, Section } from "./ui";
import { wallpapers } from "@/os/wallpapers";

const panes = [
  "Appearance",
  "Desktop",
  "Dock",
  "Widgets",
  "Notifications",
  "Keyboard",
  "Privacy",
  "System Information",
] as const;

export default function SettingsApp(_props: AppProps) {
  const { settings, updateSettings, updateWidget } = useOS();
  const [pane, setPane] = useState<(typeof panes)[number]>("Appearance");

  return (
    <div className="flex h-full bg-card">
      <aside className="w-44 shrink-0 overflow-auto border-r border-border/60 bg-muted/40 p-2">
        {panes.map((p) => (
          <button
            key={p}
            onClick={() => setPane(p)}
            className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
              pane === p ? "bg-primary/15" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </aside>
      <div className="flex-1 overflow-auto p-6">
        {pane === "Appearance" && (
          <Section title="Appearance">
            <Choice
              label="Theme"
              value={settings.theme}
              options={["dark", "light", "auto"]}
              onChange={(v) => updateSettings({ theme: v as Settings["theme"] })}
            />
            <Toggle
              label="Reduce motion"
              checked={settings.reduceMotion}
              onChange={(v) => updateSettings({ reduceMotion: v })}
            />
            <Choice
              label="Boot animation speed"
              value={settings.bootSpeed}
              options={["slow", "normal", "fast"]}
              onChange={(v) => updateSettings({ bootSpeed: v as Settings["bootSpeed"] })}
            />
            <Toggle
              label="Startup chime"
              checked={settings.bootSound}
              onChange={(v) => updateSettings({ bootSound: v })}
            />
            <p className="pt-2 text-xs text-muted-foreground">
              Reduce motion shortens the boot sequence and mutes the chime. Speed applies on next reload.
            </p>
          </Section>
        )}

        {pane === "Desktop" && (
          <Section title="Wallpaper">
            <div className="grid grid-cols-3 gap-3">
              {wallpapers.map((w) => (
                <button
                  key={w.id}
                  onClick={() => updateSettings({ wallpaper: w.id })}
                  className={`rounded-lg border-2 p-1 ${
                    settings.wallpaper === w.id ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="h-16 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${w.src})` }} />
                  <span className="text-xs">{w.label}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {pane === "Dock" && (
          <Section title="Dock">
            <Choice
              label="Position"
              value={settings.dockPosition}
              options={["bottom", "left", "right"]}
              onChange={(v) => updateSettings({ dockPosition: v as Settings["dockPosition"] })}
            />
            <Toggle
              label="Magnification"
              checked={settings.dockMagnification}
              onChange={(v) => updateSettings({ dockMagnification: v })}
            />
            <div className="py-2">
              <label className="text-sm text-muted-foreground">Icon size — {settings.dockSize}px</label>
              <input
                type="range"
                min={36}
                max={72}
                value={settings.dockSize}
                onChange={(e) => updateSettings({ dockSize: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </Section>
        )}

        {pane === "Widgets" && (
          <Section title="Widgets">
            <Toggle
              label="Clock widget"
              checked={settings.widgets.clock.visible}
              onChange={(v) => updateWidget("clock", { visible: v })}
            />
            <Toggle
              label="Weather widget"
              checked={settings.widgets.weather.visible}
              onChange={(v) => updateWidget("weather", { visible: v })}
            />
            <p className="pt-2 text-xs text-muted-foreground">
              Widgets are draggable and resizable on the desktop. Positions are remembered.
            </p>
          </Section>
        )}

        {pane === "Notifications" && <NotificationsPane />}

        {pane === "Keyboard" && (
          <Section title="Keyboard shortcuts">
            <Row label="Spotlight search" value="⌘ / Ctrl + Space" />
            <Row label="Close focused window" value="⌘ / Ctrl + W" />
            <Row label="Calendar navigation" value="Arrow keys" />
            <Row label="Terminal history" value="↑ / ↓" />
          </Section>
        )}

        {pane === "Privacy" && <PrivacyPane />}

        {pane === "System Information" && <SystemPane />}
      </div>
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-md px-3 py-1 text-xs capitalize ${
              value === o ? "bg-background shadow" : "text-muted-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-background transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function NotificationsPane() {
  const [state, setState] = useState<string>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );
  return (
    <Section title="Notifications">
      <Row label="Browser permission" value={state} />
      <button
        className="mt-3 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
        disabled={state !== "default"}
        onClick={async () => setState(await Notification.requestPermission())}
      >
        Request permission
      </button>
    </Section>
  );
}

function PrivacyPane() {
  const rows: [string, string][] = [
    ["Battery", "Read-only, if the browser supports it"],
    ["Location", "Permission required — never silent"],
    ["Bluetooth", "Permission required per device"],
    ["Notifications", "Permission required"],
    ["Wi-Fi SSID", "Not accessible to websites"],
    ["Wi-Fi password", "Not accessible"],
    ["Computer files", "Not accessible without your interaction"],
    ["CPU / GPU / RAM", "Not exposed — never invented here"],
  ];
  return (
    <Section title="Privacy">
      {rows.map(([k, v]) => (
        <Row key={k} label={k} value={<span className="text-muted-foreground">{v}</span>} />
      ))}
    </Section>
  );
}

function SystemPane() {
  const d = DeviceService.snapshot();
  return (
    <>
      <Section title="About this device">
        <Row label="Device" value={d.browser?.platformHint ?? "—"} />
        <Row label="Browser" value={d.browser?.name ?? "—"} />
        <Row label="Screen" value={d.screen ? `${d.screen.width} × ${d.screen.height}` : "—"} />
        <Row label="Pixel ratio" value={d.screen?.pixelRatio ?? "—"} />
        <Row label="Timezone" value={d.timeZone} />
        <Row label="Language" value={d.browser?.language ?? "—"} />
      </Section>
      <Section title="Capabilities">
        {CapabilityService.list().map((c) => (
          <Row key={c.name} label={c.name} value={c.status.replace("-", " ")} />
        ))}
      </Section>
    </>
  );
}
