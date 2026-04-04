import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const { t } = useLanguage();
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognition =
    typeof window !== "undefined"
      ? (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      : null;

  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous      = false;
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;
    recognition.lang            = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex || 0; i < event.results.length; i += 1) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript.trim());
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event?.error === "not-allowed") {
        setError(t("stt_err_permission"));
      } else if (event?.error === "service-not-allowed") {
        setError(t("stt_err_service"));
      } else if (event?.error === "network") {
        setError(t("stt_err_network"));
      } else {
        setError(`${t("stt_err_generic")} ${event?.error || "unknown"}`);
      }
    };

    recognitionRef.current = recognition;
    return () => { recognition.abort(); };
  // Re-create recognition instance when language changes so error messages are fresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setError(t("stt_err_generic"));
      }
    }
  }, [isListening, t]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { transcript, isListening, isSupported, error, start, stop, reset };
}
