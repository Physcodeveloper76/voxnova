import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
import { Ear, Hand, Combine, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

/* ═══════════════════════════════════════════════════════════════════════════
   3D SOCCER BALL SVG
   ═══════════════════════════════════════════════════════════════════════════ */
function Football({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="ballGrad" cx="38%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#efefef" />
          <stop offset="85%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#999" />
        </radialGradient>
        <filter id="ballFilter" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#ballFilter)">
        <circle cx="30" cy="30" r="27" fill="url(#ballGrad)" stroke="#aaa" strokeWidth="0.4" />
        <polygon points="30,14 37,20 34,29 26,29 23,20" fill="#1a1a1a" />
        <polygon points="43,25 49,32 45,40 38,37 38,28" fill="#1a1a1a" opacity="0.85" />
        <polygon points="18,36 25,30 31,33 28,42 21,42" fill="#1a1a1a" opacity="0.7" />
        <polygon points="16,20 23,20 22,28 15,30" fill="#1a1a1a" opacity="0.5" />
        <path d="M37,20 L43,25 M34,29 L38,28 M26,29 L25,30 M23,20 L16,20 M31,33 L34,40"
              stroke="#bbb" strokeWidth="0.4" fill="none" opacity="0.5" />
        <ellipse cx="22" cy="18" rx="6" ry="4.5" fill="white" opacity="0.45" transform="rotate(-20,22,18)" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHYSICS
   ═══════════════════════════════════════════════════════════════════════════ */
function cubicBez(t: number, a: [number,number], b: [number,number], c: [number,number], d: [number,number]): [number,number] {
  const u = 1-t;
  return [
    u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],
    u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1],
  ];
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const GY = 85;
const PHASES = { F: 0.40, B1: 0.57, B2: 0.70, B3: 0.78 };
const FP0: [number,number] = [88, 3];
const FP1: [number,number] = [68, 15];
const FP2: [number,number] = [38, 52];
const FP3: [number,number] = [20, GY];

function footballState(p: number) {
  let x: number, y: number, rot: number, sy = 1, sx = 1;
  if (p <= PHASES.F) {
    const s = p / PHASES.F;
    [x, y] = cubicBez(s, FP0, FP1, FP2, FP3);
    rot = s * 540;
  } else if (p <= PHASES.B1) {
    const s = (p - PHASES.F) / (PHASES.B1 - PHASES.F);
    x = lerp(20, 15, s); const h = 4*s*(1-s); y = GY - 22*h; rot = 540 + s*360;
    const sq = Math.pow(1-h,4); sy = 1-0.22*sq; sx = 1+0.11*sq;
  } else if (p <= PHASES.B2) {
    const s = (p - PHASES.B1) / (PHASES.B2 - PHASES.B1);
    x = lerp(15, 11, s); const h = 4*s*(1-s); y = GY - 12*h; rot = 900 + s*180;
    const sq = Math.pow(1-h,4); sy = 1-0.15*sq; sx = 1+0.08*sq;
  } else if (p <= PHASES.B3) {
    const s = (p - PHASES.B2) / (PHASES.B3 - PHASES.B2);
    x = lerp(11, 8, s); const h = 4*s*(1-s); y = GY - 5*h; rot = 1080 + s*90;
    const sq = Math.pow(1-h,4); sy = 1-0.08*sq; sx = 1+0.04*sq;
  } else {
    const s = (p - PHASES.B3) / (1 - PHASES.B3);
    const e = 1 - Math.pow(1-s, 3);
    x = lerp(8, 5, e); y = GY; rot = 1170 + 90*e;
  }
  return { x, y, rot, sx, sy };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRETEXT ROW
   ═══════════════════════════════════════════════════════════════════════════ */
function PreTextRow({ children, className, zIndex, rowY, progress }: {
  children: React.ReactNode; className?: string; zIndex: number;
  rowY: number; progress: MotionValue<number>;
}) {
  const proximity = useTransform(progress, (p) => {
    const { y } = footballState(p);
    return Math.max(0, 1 - Math.abs(y - rowY) / 12);
  });
  const textX = useTransform(proximity, [0, 1], [0, -6]);
  const textScale = useTransform(proximity, [0, 0.5, 1], [1, 1.008, 1.015]);
  return (
    <motion.div className={className} style={{ position: "relative", zIndex, x: textX, scale: textScale, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLYING FOOTBALL + SHADOW + LABEL
   Label appears only when hovering the ball.
   ═══════════════════════════════════════════════════════════════════════════ */
function FlyingFootball({ progress }: { progress: MotionValue<number> }) {
  const [ballHovered, setBallHovered] = useState(false);

  const bx = useTransform(progress, (p) => footballState(p).x);
  const by = useTransform(progress, (p) => footballState(p).y);
  const brot = useTransform(progress, (p) => footballState(p).rot);
  const bsx = useTransform(progress, (p) => footballState(p).sx);
  const bsy = useTransform(progress, (p) => footballState(p).sy);
  const opacity = useTransform(progress, [0, 0.03, 0.95, 1], [0, 1, 1, 1]);

  const shOp = useTransform(progress, (p) => {
    const { y } = footballState(p);
    return Math.max(0.05, 0.4 * (1 - Math.max(0, GY - y) / 45));
  });
  const shScale = useTransform(progress, (p) => {
    const { y } = footballState(p);
    return 0.4 + 0.6 * Math.max(0, 1 - Math.max(0, GY - y) / 35);
  });

  // Label anchored to ball via MotionValues so it tracks beside it
  const labelLeft = useTransform(bx, v => `calc(${v}% + 62px)`);
  const labelTop  = useTransform(by, v => `calc(${v}% + 4px)`);

  return (
    <>
      {/* Shadow */}
      <motion.div className="pointer-events-none absolute rounded-full"
        style={{
          zIndex: 19,
          left: useTransform(bx, v => `calc(${v}% + 4px)`),
          top: `${GY + 1.5}%`, width: 48, height: 10,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
          opacity: shOp, scale: shScale, willChange: "transform, opacity",
        }} />

      {/* Ball — rotates, squashes; pointer-events enabled for hover detection */}
      <motion.div
        className="absolute cursor-pointer"
        onMouseEnter={() => setBallHovered(true)}
        onMouseLeave={() => setBallHovered(false)}
        style={{
          zIndex: 20,
          left: useTransform(bx, v => `${v}%`),
          top: useTransform(by, v => `${v}%`),
          rotate: brot, scaleX: bsx, scaleY: bsy,
          opacity, willChange: "transform, opacity",
        }}
      >
        <Football className="w-10 sm:w-12 md:w-14" />
      </motion.div>

      {/* "Hi! I am Nova" tooltip — appears only on ball hover, positioned to the right */}
      <motion.div
        className="absolute pointer-events-none select-none whitespace-nowrap
                   rounded-full bg-card/90 backdrop-blur-sm border border-border/80
                   px-4 py-1.5 text-xs font-semibold text-foreground shadow-lg"
        style={{ zIndex: 50, left: labelLeft, top: labelTop }}
        animate={{ opacity: ballHovered ? 1 : 0, x: ballHovered ? 0 : -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        Hi! I am Nova 👋
        {/* Left-pointing triangle tail */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rotate-45
                        bg-card border-l border-b border-border/80" />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STARS
   ═══════════════════════════════════════════════════════════════════════════ */
function Stars() {
  const stars = useMemo(() => {
    const s: { x:number; y:number; size:number; delay:number; dur:number }[] = [];
    let seed = 42;
    const r = () => { seed = (seed*16807)%2147483647; return seed/2147483647; };
    for (let i = 0; i < 55; i++) s.push({ x:r()*100, y:r()*100, size:1+r()*1.8, delay:r()*4, dur:2+r()*3 });
    return s;
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s,i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size }}
          animate={{ opacity:[0.15,0.7,0.15] }}
          transition={{ duration:s.dur, repeat:Infinity, ease:"easeInOut", delay:s.delay }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODE CARD — Interactive cards for feature selection
   ═══════════════════════════════════════════════════════════════════════════ */
function ModeCard({
  icon: Icon,
  title,
  description,
  to,
  isActive,
  isAnyActive,
  onEnter,
  onLeave,
  onClick,
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  isActive: boolean;
  isAnyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex-1 min-w-0"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <motion.div
        animate={{
          y: isActive ? -8 : 0,
          scale: isActive ? 1.02 : 1,
          opacity: isAnyActive && !isActive ? 0.85 : 1,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full relative"
      >
        <Link
          to={to}
          onClick={onClick}
          className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card h-full"
          style={{
            borderColor: isActive ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border) / 0.5)",
            boxShadow: isActive
              ? "0 16px 40px -10px hsl(var(--primary) / 0.15)"
              : "0 4px 6px -1px rgba(0,0,0,0.05)",
            transition: "border-color 300ms, box-shadow 300ms",
          }}
        >
          {/* Active Glow Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.05), transparent)",
              opacity: isActive ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          />

          {/* Icon + Title Header */}
          <div className="relative z-10 flex items-center gap-4 px-6 py-5">
            <div className="relative shrink-0">
              {/* Background glow shifting behind icon */}
              <motion.div
                className="absolute inset-0 rounded-xl gradient-ember blur-md"
                initial={false}
                animate={{ opacity: isActive ? 0.5 : 0, scale: isActive ? 1.4 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="relative z-10 rounded-xl gradient-ember p-3 text-primary-foreground shadow-md"
                initial={false}
                animate={{ scale: isActive ? 1.12 : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Icon size={24} strokeWidth={2} />
              </motion.div>
            </div>

            <h3
              className="font-display text-lg font-bold"
              style={{
                color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                transition: "color 300ms ease",
              }}
            >
              {title}
            </h3>

            {/* Right arrow */}
            <div
              className="ml-auto shrink-0 text-primary text-xl"
              style={{
                opacity: isActive ? 0.9 : 0,
                transform: isActive ? "translateX(0)" : "translateX(-15px)",
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              →
            </div>
          </div>

          {/* Subtitle Reveal using max-height */}
          <div
            className="relative z-10 overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{ maxHeight: isActive ? "140px" : "0px" }}
          >
            <div className="px-6 pb-6">
              <motion.p
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                transition={{ duration: 0.25, delay: isActive ? 0.1 : 0, ease: "easeOut" }}
                className="text-sm text-muted-foreground leading-relaxed m-0"
              >
                {description}
              </motion.p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState<number | null>(null);
  const year = String(new Date().getFullYear());
  const progress = useMotionValue(0);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const c = animate(progress, 1, { duration: 6.5, ease: "linear", delay: 0.8 });
    return () => c.stop();
  }, [progress]);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const modes = [
    { icon: Ear,     title: t("home_deaf_mode_title"), desc: t("home_deaf_mode_desc"), to: "/deaf" },
    { icon: Hand,    title: t("home_mute_mode_title"), desc: t("home_mute_mode_desc"), to: "/mute" },
    { icon: Combine, title: t("home_both_mode_title"), desc: t("home_both_mode_desc"), to: "/both" },
  ];

  const features = [
    { icon: Zap, title: t("home_realtime"), desc: t("home_realtime_desc") },
    { icon: Shield, title: t("home_private"), desc: t("home_private_desc") },
    { icon: Globe, title: t("home_multilang"), desc: t("home_multilang_desc") },
    { icon: Sparkles, title: t("home_ai"), desc: t("home_ai_desc") },
  ];

  const handleMouseEnter = (i: number) => {
    if (window.innerWidth >= 768) setActiveMode(i);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) setActiveMode(null);
  };
  const handleCardClick = (e: React.MouseEvent, i: number) => {
    if (window.innerWidth < 768) {
      if (activeMode !== i) {
        e.preventDefault();
        setActiveMode(i);
      }
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* ═══════ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="absolute inset-0 glow-ember opacity-20" />
        {mounted && isDark && <Stars />}
        <FlyingFootball progress={progress} />

        <div className="container relative flex flex-col items-center justify-center h-full text-center pointer-events-none">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.2 }} className="mx-auto max-w-3xl space-y-4">
            <div className="relative z-[35] inline-flex items-center gap-2 rounded-full border border-primary/30 gradient-ember-subtle px-4 py-1.5 text-xs font-semibold text-primary pointer-events-auto">
              <Sparkles size={14} />{t("home_badge")}
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
              <PreTextRow zIndex={15} rowY={38} progress={progress}>{t("home_hero_pre")}</PreTextRow>
              <PreTextRow zIndex={25} rowY={45} progress={progress} className="text-gradient-ember">{t("home_hero_highlight")}</PreTextRow>
              <PreTextRow zIndex={15} rowY={52} progress={progress}>{t("home_hero_post")}</PreTextRow>
            </h1>
            <p className="relative z-[35] mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">{t("home_hero_desc")}</p>
            <div className="relative z-[35] flex flex-wrap justify-center gap-4 pt-4 pointer-events-auto">
              <Link to="/deaf" className="rounded-lg gradient-ember px-8 py-3 text-sm font-semibold text-primary-foreground shadow-ember transition-all hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:scale-95">{t("home_get_started")}</Link>
              <Link to="/more-features" className="rounded-lg border border-border bg-secondary px-8 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:border-muted-foreground/30 active:scale-95">{t("home_learn_more")}</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CHOOSE YOUR MODE — horizontal expanding cards ════════ */}
      <section className="container py-24">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }} className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("home_choose_mode")}</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">{t("home_choose_mode_sub")}</p>
        </motion.div>

        {/* Vertical stacked layout */}
        <div className="flex flex-col gap-4 md:gap-5 max-w-2xl mx-auto"
             style={{ transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {modes.map((m, i) => (
            <ModeCard
              key={i}
              icon={m.icon}
              title={m.title}
              description={m.desc}
              to={m.to}
              isActive={activeMode === i}
              isAnyActive={activeMode !== null}
              onEnter={() => handleMouseEnter(i)}
              onLeave={handleMouseLeave}
              onClick={(e) => handleCardClick(e, i)}
              delay={i * 0.12}
            />
          ))}
        </div>
      </section>

      {/* ═══════ WHY VOXNOVA ════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-20">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">{t("home_why")}</h2>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f,i) => (
              <motion.div key={f.title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }} className="text-center space-y-3">
                <div className="mx-auto inline-flex rounded-lg gradient-ember-subtle p-3 text-primary"><f.icon size={24} /></div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">{t("home_footer", { year })}</div>
      </footer>
    </div>
  );
}
