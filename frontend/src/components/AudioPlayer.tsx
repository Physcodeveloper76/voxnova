import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { resolveAudioUrl } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";

interface AudioPlayerProps {
  audioUrl: string | null;
  label?: string;
}

export default function AudioPlayer({ audioUrl, label }: AudioPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = resolveAudioUrl(audioUrl);
      audioRef.current.play().then(() => {
        setPlaying(true);
        setNeedsPlay(false);
      }).catch(() => {
        setNeedsPlay(true);
        setPlaying(false);
      });
    }
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
      setNeedsPlay(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3">
      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        disabled={!audioUrl}
        className="flex h-10 w-10 items-center justify-center rounded-full gradient-ember text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label || t("audio_output")}</p>
        {needsPlay && <p className="text-xs text-ember-amber">{t("audio_autoplay_blocked")}</p>}
        {!audioUrl  && <p className="text-xs text-muted-foreground">{t("audio_no_audio")}</p>}
      </div>
      <Volume2 size={16} className="text-muted-foreground" />
    </div>
  );
}
