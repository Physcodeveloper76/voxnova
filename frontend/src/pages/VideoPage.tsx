import { Link } from "react-router-dom";
import { ArrowLeft, Video, Film, MonitorPlay } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export default function VideoPage() {
  const { t } = useLanguage();

  const videoFeatures = [
    { icon: Video,       title: t("video_live_title"),     desc: t("video_live_desc") },
    { icon: Film,        title: t("video_tutorial_title"), desc: t("video_tutorial_desc") },
    { icon: MonitorPlay, title: t("video_player_title"),   desc: t("video_player_desc") },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("video_title")}</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {videoFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6 space-y-3"
            >
              <div className="inline-flex rounded-lg gradient-ember-subtle p-2.5 text-primary">
                <f.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 overflow-hidden relative min-h-[400px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-secondary/50 backdrop-blur-sm z-0" />
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-ember text-primary-foreground shadow-ember mb-4 mx-auto">
              <MonitorPlay size={32} />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">{t("video_player_heading")}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t("video_placeholder_desc")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
