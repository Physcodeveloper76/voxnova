import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import DeafModePage from "@/pages/DeafModePage";
import MuteModePage from "@/pages/MuteModePage";
import BothModePage from "@/pages/BothModePage";
import RegisterPage from "@/pages/RegisterPage";
import MoreFeaturesPage from "@/pages/MoreFeaturesPage";
import VideoPage from "@/pages/VideoPage";
import LearningPage from "@/pages/LearningPage";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/deaf" element={<DeafModePage />} />
                <Route path="/mute" element={<MuteModePage />} />
                <Route path="/both" element={<BothModePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/more-features" element={<MoreFeaturesPage />} />
                <Route path="/video" element={<VideoPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
