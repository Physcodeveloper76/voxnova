import { Link } from "react-router-dom";
import { ArrowLeft, BrainCircuit, Languages, Video, MessageSquare, Wifi, Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export default function MoreFeaturesPage() {
  const { t } = useLanguage();

  const features = [
    { icon: BrainCircuit,  title: t("feat_ai_title"),      desc: t("feat_ai_desc") },
    { icon: Languages,     title: t("feat_lang_title"),     desc: t("feat_lang_desc") },
    { icon: Video,         title: t("feat_video_title"),    desc: t("feat_video_desc") },
    { icon: MessageSquare, title: t("feat_speech_title"),   desc: t("feat_speech_desc") },
    { icon: Wifi,          title: t("feat_offline_title"),  desc: t("feat_offline_desc") },
    { icon: Accessibility, title: t("feat_access_title"),   desc: t("feat_access_desc") },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("more_title")}</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
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
      </div>
    </div>
  );
}
