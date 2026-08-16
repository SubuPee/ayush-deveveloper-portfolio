import { useEffect, useState } from "react";
import {
  BatteryService,
  ClockService,
  NetworkService,
  type BatteryState,
  type ClockState,
  type NetworkState,
} from "./services";

export function useClock(): ClockState {
  const [state, setState] = useState<ClockState>(ClockService.state);
  useEffect(() => ClockService.subscribe(setState), []);
  return state;
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>(BatteryService.state);
  useEffect(() => BatteryService.subscribe(setState), []);
  return state;
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(NetworkService.state);
  useEffect(() => NetworkService.subscribe(setState), []);
  return state;
}

export function useIsMobile(breakpoint = 820) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}
