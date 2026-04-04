const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function apiUrl(path: string) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export async function fetchDatasetSummary() {
  const res = await fetch(apiUrl("/api/dataset_summary"));
  if (!res.ok) throw new Error("Failed to fetch dataset summary");
  return res.json() as Promise<{
    model_loaded: boolean;
    word_count: number;
    supported_words: string[];
  }>;
}

export async function signToText(frame: Blob) {
  const form = new FormData();
  form.append("frame", frame, "frame.jpg");
  const res = await fetch(apiUrl("/sign_to_text"), { method: "POST", body: form });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as { word: string };
}

export async function deafTextToVoice(text: string, language: "en" | "hi" | "mr") {
  const res = await fetch(apiUrl("/deaf_text_to_voice"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as {
    original: string;
    translated: string;
    audio: string;
    audio_url: string;
  };
}

export function resolveAudioUrl(audioUrl: string) {
  if (audioUrl.startsWith("http")) return audioUrl;
  return API_BASE ? `${API_BASE}${audioUrl}` : audioUrl;
}
