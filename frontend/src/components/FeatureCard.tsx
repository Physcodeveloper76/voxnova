import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, to, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link to={to} className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card p-0">
        {/* ── Gradient border glow — visible on hover ─── */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, hsl(207,90%,54%,0.15), hsl(185,80%,48%,0.1), hsl(43,95%,52%,0.08))",
          }} />
        {/* ── Inner glow border ─── */}
        <div className="absolute inset-[0px] rounded-2xl border border-transparent group-hover:border-primary/30 transition-all duration-300" />
        {/* ── Bottom accent line — slides in on hover ─── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-center" />

        {/* ── Card content ─── */}
        <div className="relative z-10 p-7 transition-transform duration-300 group-hover:-translate-y-1">
          {/* Icon */}
          <div className="mb-5 inline-flex rounded-xl gradient-ember p-3.5 text-primary-foreground shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-wave">
            <Icon size={26} strokeWidth={2} />
          </div>

          {/* Title */}
          <h3 className="mb-2.5 font-display text-lg font-semibold text-foreground transition-all duration-300 group-hover:text-primary">
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              {title}
            </span>
            {/* Arrow indicator */}
            <span className="ml-2 inline-block opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-0">
              →
            </span>
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-foreground/70">
            {description}
          </p>
        </div>

        {/* ── Hover shadow (the lift effect) ─── */}
        <div className="absolute inset-0 rounded-2xl shadow-none group-hover:shadow-xl group-hover:shadow-primary/8 transition-shadow duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
