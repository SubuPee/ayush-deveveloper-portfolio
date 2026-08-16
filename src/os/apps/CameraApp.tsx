import { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, VideoOff } from "lucide-react";
import type { AppProps } from "../registry";

export default function CameraApp(_props: AppProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const [shots, setShots] = useState<string[]>([]);

  useEffect(() => {
    if (!on) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError("Camera access was blocked by the browser."));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [on]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setShots((s) => [canvas.toDataURL("image/png"), ...s].slice(0, 8));
  };

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="relative flex-1 overflow-hidden">
        {on && !error ? (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-white/60">
            {error ? <VideoOff className="h-8 w-8" /> : <CameraIcon className="h-8 w-8" />}
            <p className="text-sm">{error ?? "Camera is off"}</p>
            {!error ? (
              <button onClick={() => setOn(true)} className="rounded-full bg-white/15 px-4 py-1.5 text-sm">
                Turn on camera
              </button>
            ) : null}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 p-3">
        <button
          onClick={capture}
          disabled={!on || !!error}
          className="h-11 w-11 rounded-full border-4 border-white/70 bg-white/90 disabled:opacity-30"
          aria-label="Take photo"
        />
        <div className="flex flex-1 gap-2 overflow-auto">
          {shots.map((s) => (
            <img key={s.slice(-24)} src={s} alt="Captured frame" className="h-11 w-11 rounded-md object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
}
