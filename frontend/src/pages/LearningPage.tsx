import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, GraduationCap, Library } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export default function LearningPage() {
  const { t } = useLanguage();

  const learningModules = [
    { icon: GraduationCap, title: t("learning_beginner_title"), desc: t("learning_beginner_desc") },
    { icon: BookOpen,      title: t("learning_grammar_title"),  desc: t("learning_grammar_desc") },
    { icon: Library,       title: t("learning_advanced_title"), desc: t("learning_advanced_desc") },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("learning_title")}</h1>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl gradient-ember p-8 text-primary-foreground shadow-ember relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4 max-w-xl">
            <h2 className="text-3xl font-display font-bold">{t("learning_hero_title")}</h2>
            <p className="text-primary-foreground/90 leading-relaxed text-lg">{t("learning_hero_desc")}</p>
            <button className="bg-background text-foreground hover:bg-background/90 font-semibold py-2.5 px-6 rounded-lg transition-colors mt-4">
              {t("learning_start")}
            </button>
          </div>
          <GraduationCap className="absolute -right-8 -bottom-8 w-64 h-64 text-primary-foreground/10 rotate-[-15deg] pointer-events-none" />
        </motion.div>

        <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("learning_modules")}</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {learningModules.map((module, i) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors p-6 space-y-3 cursor-pointer"
            >
              <div className="inline-flex rounded-lg gradient-ember-subtle p-2.5 text-primary">
                <module.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-foreground">{module.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{module.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
