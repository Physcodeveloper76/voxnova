import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

import ThemeToggle from "@/components/ThemeToggle";
import LanguagePicker from "@/components/LanguagePicker";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: "/",     label: t("nav_home") },
    { path: "/deaf", label: t("nav_deaf_mode") },
    { path: "/mute", label: t("nav_mute_mode") },
    { path: "/both", label: t("nav_both_mode") },
  ];

  const moreItems = [
    { path: "/more-features", label: t("nav_more_features") },
    { path: "/video",         label: t("nav_video") },
    { path: "/learning",      label: t("nav_learning") },
  ];

  const isMoreActive = moreItems.some((item) => location.pathname === item.path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-ember flex items-center justify-center shadow-sm overflow-hidden p-0.5">
            <img
              src="/logo.png"
              alt="VoxNova Logo"
              className="w-full h-full object-contain filter drop-shadow-md brightness-0 invert"
              style={{ WebkitFilter: "brightness(0) invert(1)" }}
            />
          </div>
          <span className="font-display text-xl font-bold text-gradient-ember">VoxNova</span>
        </Link>

        {/* ── Desktop nav ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg gradient-ember-subtle"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative group">
            <div
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 cursor-default ${
                isMoreActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {isMoreActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg gradient-ember-subtle"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                {t("nav_more")} <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </span>
            </div>

            <div className="absolute top-full right-0 pt-2 w-48 z-50">
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows,opacity] duration-300 ease-in-out opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 shadow-lg rounded-lg">
                <div className="overflow-hidden">
                  <div className="bg-background border border-border rounded-lg p-1 flex flex-col gap-0.5">
                    {moreItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block w-full cursor-pointer px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted ${
                          location.pathname === item.path ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border">
            <LanguagePicker />
            <ThemeToggle />
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border">
              <span
                className="text-sm font-medium text-foreground truncate max-w-[120px]"
                title={user.email}
              >
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title={t("nav_log_out")}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/register"
              className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg gradient-ember text-primary-foreground shadow-ember transition-transform hover:scale-105"
            >
              {t("nav_sign_up")}
            </Link>
          )}
        </div>

        {/* ── Mobile hamburger ────────────────────────────────────────── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary gradient-ember-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
            {t("nav_more_options")}
          </div>
          {moreItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary gradient-ember-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Appearance row */}
          <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("nav_appearance")}
            </span>
            <ThemeToggle />
          </div>

          {/* Language row */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("nav_language")}
            </span>
            <LanguagePicker />
          </div>

          {/* Auth */}
          {user ? (
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-foreground truncate pl-4">
                {user.email}
              </span>
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={16} />
                {t("nav_log_out")}
              </button>
            </div>
          ) : (
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center rounded-lg gradient-ember text-primary-foreground font-semibold"
            >
              {t("nav_sign_up")}
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
