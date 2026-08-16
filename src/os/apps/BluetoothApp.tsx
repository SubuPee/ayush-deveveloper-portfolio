import { useEffect, useState } from "react";
import { Bluetooth } from "lucide-react";
import type { AppProps } from "../registry";
import { BluetoothService } from "../services";
import { Dot, Row, Section } from "./ui";

export default function BluetoothApp(_props: AppProps) {
  const support = BluetoothService.support();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<{ name: string; id: string }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    if (support !== "unsupported") {
      void BluetoothService.available().then((v) => alive && setAvailable(v));
    }
    return () => {
      alive = false;
    };
  }, [support]);

  if (support === "unsupported")
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-card p-8 text-center">
        <Bluetooth className="h-9 w-9 text-muted-foreground" />
        <p className="text-sm font-medium">Bluetooth</p>
        <p className="text-xs text-muted-foreground">Unavailable in this browser.</p>
      </div>
    );

  return (
    <div className="h-full overflow-auto bg-card p-6">
      <Section title="Bluetooth">
        <Row
          label="Status"
          value={
            <>
              <Dot ok={available} />
              {available === null ? "Checking…" : available ? "Available" : "Adapter unavailable"}
            </>
          }
        />
        <Row label="Access" value="Permission required per device" />
      </Section>

      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const d = await BluetoothService.connect();
            setDevices((list) => [d, ...list.filter((x) => x.id !== d.id)]);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Device selection cancelled");
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Connect Device
      </button>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}

      <div className="mt-6">
        <Section title="Paired in this session">
          {devices.length ? (
            devices.map((d) => <Row key={d.id} label={d.name} value="Connected" />)
          ) : (
            <p className="text-sm text-muted-foreground">
              No devices. Ayush World never scans silently — devices appear only after you explicitly choose one.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}
