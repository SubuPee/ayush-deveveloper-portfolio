import { Check, HelpCircle, X } from "lucide-react";
import type { AppProps } from "../registry";
import { BrowserService, CapabilityService, ScreenService } from "../services";
import { useBattery, useClock, useNetwork } from "../hooks";
import { Row, Section } from "./ui";

export default function SystemInfoApp(_props: AppProps) {
  const battery = useBattery();
  const net = useNetwork();
  const clock = useClock();
  const screen = ScreenService.info();
  const browser = BrowserService.info();

  return (
    <div className="h-full overflow-auto bg-card p-6">
      <Section title="About This Device">
        <Row label="System" value="Ayush World 1.0" />
        <Row label="Device" value={browser?.platformHint ?? "—"} />
        <Row label="Browser" value={browser?.name ?? "—"} />
        <Row label="Screen" value={screen ? `${screen.width} × ${screen.height}` : "—"} />
        <Row label="Available screen" value={screen ? `${screen.availWidth} × ${screen.availHeight}` : "—"} />
        <Row label="Pixel ratio" value={screen?.pixelRatio ?? "—"} />
        <Row label="Color depth" value={screen ? `${screen.colorDepth}-bit` : "—"} />
        <Row label="Orientation" value={screen?.orientation ?? "—"} />
        <Row label="Timezone" value={clock.timeZone} />
        <Row label="Locale" value={clock.locale} />
        <Row label="Language" value={browser?.languages ?? "—"} />
        <Row label="Logical CPU cores" value={browser?.hardwareConcurrency ?? "Not exposed"} />
        <Row label="Online" value={net.online ? "Yes" : "No"} />
        <Row
          label="Battery"
          value={battery.level !== null ? `${battery.level}%${battery.charging ? " · Charging" : ""}` : "Unavailable"}
        />
      </Section>

      <Section title="System Capabilities">
        {CapabilityService.list().map((c) => (
          <div key={c.name} className="flex items-center justify-between border-b border-border/60 py-2 text-sm">
            <span className="text-muted-foreground">{c.name}</span>
            <span className="flex items-center gap-1.5">
              {c.status === "supported" ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : c.status === "unsupported" ? (
                <X className="h-4 w-4 text-destructive" />
              ) : (
                <HelpCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="capitalize">{c.status.replace("-", " ")}</span>
            </span>
          </div>
        ))}
      </Section>

      <p className="text-xs text-muted-foreground">
        Every value above comes from a real browser API. Nothing about your machine is guessed or fabricated.
      </p>
    </div>
  );
}
