import type { AppProps } from "../registry";
import { useNetwork } from "../hooks";
import { Dot, Row, Section } from "./ui";

export default function NetworkApp(_props: AppProps) {
  const net = useNetwork();

  return (
    <div className="h-full overflow-auto bg-card p-6">
      <Section title="Connection">
        <Row
          label="Wi-Fi"
          value={
            <>
              <Dot ok={net.online} />
              {net.online ? "Connected" : "Offline"}
            </>
          }
        />
        <Row
          label="Internet"
          value={
            <>
              <Dot ok={net.online} />
              {net.online ? "Online" : "Offline"}
            </>
          }
        />
        <Row label="Network name (SSID)" value={<span className="text-muted-foreground">Unavailable to browser</span>} />
        <Row label="IP address" value={<span className="text-muted-foreground">Unavailable to browser</span>} />
      </Section>

      <Section title="Network Information API">
        {net.infoSupport === "supported" ? (
          <>
            <Row label="Effective type" value={net.effectiveType ?? "—"} />
            <Row label="Downlink" value={net.downlink !== null ? `${net.downlink} Mb/s` : "—"} />
            <Row label="Round-trip time" value={net.rtt !== null ? `${net.rtt} ms` : "—"} />
            <Row label="Data saver" value={net.saveData ? "On" : "Off"} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Network Information API is unavailable in this browser. Online status is still detected in real time.
          </p>
        )}
      </Section>

      <p className="text-xs text-muted-foreground">
        Websites cannot read your SSID, password or local network devices. Only the values above are exposed by the
        browser.
      </p>
    </div>
  );
}
