import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, LogIn, Loader2, Mail, Lock, Github, Linkedin, Facebook, Chrome } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import "./Auth.css";

export default function RegisterPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Success", description: "Logged in successfully!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Success", description: "Registration successful! You can now log in." });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ title: "Authentication Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper min-h-screen flex items-center justify-center p-4">
      <Link to="/" className="absolute top-20 left-6 sm:top-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors z-50 bg-background/50 p-2 rounded-lg backdrop-blur-sm">
        <ArrowLeft size={18} /> {t("nav_home")}
      </Link>

      <div className={`auth-container ${!isLogin ? 'active' : ''}`}>

        {/* LOGIN FORM */}
        <div className="form-box login">
          <form onSubmit={(e) => { e.preventDefault(); if (!isLogin) setIsLogin(true); else handleAuth(e); }}>
            <h1>{t("login_title")}</h1>
            <div className="input-box">
              <input type="email" placeholder={t("register_email")} value={email} onChange={e => setEmail(e.target.value)} required />
              <Mail size={20} />
            </div>
            <div className="input-box">
              <input type="password" placeholder={t("register_password")} value={password} onChange={e => setPassword(e.target.value)} required />
              <Lock size={20} />
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading && isLogin ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {t("register_signin_btn")}
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Chrome size={24} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Facebook size={24} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={24} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="form-box register">
          <form onSubmit={(e) => { e.preventDefault(); if (isLogin) setIsLogin(false); else handleAuth(e); }}>
            <h1>{t("register_title")}</h1>
            <div className="input-box">
              <input type="email" placeholder={t("register_email")} value={email} onChange={e => setEmail(e.target.value)} required />
              <Mail size={20} />
            </div>
            <div className="input-box">
              <input type="password" placeholder={t("register_password")} value={password} onChange={e => setPassword(e.target.value)} required />
              <Lock size={20} />
            </div>
            <button type="submit" className="btn" disabled={isLoading} style={{ marginTop: '20px' }}>
              {isLoading && !isLogin ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {t("register_create_btn")}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Chrome size={24} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Facebook size={24} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={24} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        {/* OVERLAY TOGGLES */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Don't have an account?</p>
            <button type="button" className="btn register-btn" onClick={() => setIsLogin(false)}>
              {t("register_sign_up_link") || "Register"}
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Hello, Welcome!</h1>
            <p>Already have an account?</p>
            <button type="button" className="btn login-btn" onClick={() => setIsLogin(true)}>
              {t("register_sign_in_link") || "Login"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
