import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface CameraCaptureProps {
  onFrame: (blob: Blob) => void;
  disabled?: boolean;
  intervalMs?: number;
}

export default function CameraCapture({ onFrame, disabled, intervalMs = 1000 }: CameraCaptureProps) {
  const { t } = useLanguage();
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch {
      setError(t("camera_error"));
    }
  }, [t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActive(false);
  }, []);

  // Capture frames
  useEffect(() => {
    if (active && !disabled) {
      intervalRef.current = window.setInterval(() => {
        const video  = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => { if (blob) onFrame(blob); }, "image/jpeg", 0.8);
      }, intervalMs);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, disabled, intervalMs, onFrame]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-secondary aspect-video">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Camera size={48} className="opacity-30" />
            <p className="text-sm">{t("camera_off")}</p>
          </div>
        )}
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-destructive/90 px-2.5 py-1 text-xs font-semibold text-destructive-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
            LIVE
          </motion.div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        onClick={active ? stopCamera : startCamera}
        disabled={disabled}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all disabled:opacity-40 ${
          active
            ? "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25"
            : "gradient-ember text-primary-foreground shadow-ember hover:scale-[1.02]"
        }`}
      >
        {active ? <CameraOff size={18} /> : <Camera size={18} />}
        {active ? t("camera_stop") : t("camera_start")}
      </button>
    </div>
  );
}
