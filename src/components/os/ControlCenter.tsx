import { Bluetooth, Moon, Sun, SunMoon, Wifi } from "lucide-react";
import { useOS } from "@/os/store";
import { useBattery, useClock, useNetwork } from "@/os/hooks";
import { BluetoothService, formatDate, formatTime } from "@/os/services";

export function ControlCenter() {
  const { controlCenterOpen, setControlCenterOpen, settings, updateSettings, openApp } = useOS();
  const net = useNetwork();
  const battery = useBattery();
  const clock = useClock();
  if (!controlCenterOpen) return null;
  const btSupport = BluetoothService.support();

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={() => setControlCenterOpen(false)} />
      <div className="fixed right-3 top-9 z-[61] w-80 space-y-3 rounded-2xl border border-white/20 bg-black/50 p-4 text-white backdrop-blur-2xl shadow-2xl">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openApp("network")}
            className="rounded-xl bg-white/10 p-3 text-left transition-colors hover:bg-white/20"
          >
            <Wifi className="mb-1 h-4 w-4" />
            <p className="text-xs font-medium">Wi-Fi</p>
            <p className="text-[11px] text-white/60">{net.online ? "Connected" : "Offline"}</p>
          </button>
          <button
            onClick={() => openApp("bluetooth")}
            className="rounded-xl bg-white/10 p-3 text-left transition-colors hover:bg-white/20"
          >
            <Bluetooth className="mb-1 h-4 w-4" />
            <p className="text-xs font-medium">Bluetooth</p>
            <p className="text-[11px] text-white/60">
              {btSupport === "unsupported" ? "Unavailable" : "Permission required"}
            </p>
          </button>
        </div>

        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs font-medium">Battery</p>
          {battery.level !== null ? (
            <>
              <p className="text-2xl font-light">{battery.level}%</p>
              <p className="text-[11px] text-white/60">{battery.charging ? "Charging" : "On battery"}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${battery.level}%` }} />
              </div>
            </>
          ) : (
            <p className="text-[11px] text-white/60">Unavailable in this browser</p>
          )}
        </div>

        <div className="rounded-xl bg-white/10 p-3 text-[11px] text-white/70">
          <p className="mb-1 text-xs font-medium text-white">System</p>
          <p>{formatDate(clock.now, clock.locale)}</p>
          <p>
            {formatTime(clock.now, clock.locale)} · {clock.timeZone}
          </p>
          <p className="mt-1 text-white/50">Display brightness & volume are controlled by your operating system.</p>
        </div>

        <div className="rounded-xl bg-white/10 p-3">
          <p className="mb-2 text-xs font-medium">Appearance</p>
          <div className="flex gap-1 rounded-lg bg-black/30 p-1">
            {(
              [
                ["dark", Moon],
                ["light", Sun],
                ["auto", SunMoon],
              ] as const
            ).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => updateSettings({ theme: mode })}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-[11px] capitalize ${
                  settings.theme === mode ? "bg-white/25" : "text-white/60"
                }`}
              >
                <Icon className="h-3 w-3" /> {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
