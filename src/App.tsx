import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sub2Unlock from "./pages/Sub2Unlock";
import Pass from "./pages/Pass";
import Checker from "./pages/Checker";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LanguageToggle } from "./components/LanguageToggle";
import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const StaticFolderOrNotFound = () => {
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "missing">("checking");

  useEffect(() => {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    if (!segment) {
      setStatus("missing");
      return;
    }
    let cancelled = false;
    fetch(`${BASE}/${segment}/index.html`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setStatus("missing");
          return;
        }
        const text = await res.text();
        const isSpaShell =
          text.includes("/src/main.tsx") || text.includes('id="root"');
        if (isSpaShell) {
          setStatus("missing");
        } else {
          window.location.replace(`${BASE}/${segment}/index.html`);
        }
      })
      .catch(() => !cancelled && setStatus("missing"));
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (status === "checking") return null;
  return <NotFound />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter basename={BASE}>
          <LanguageToggle />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sub2unlock" element={<Sub2Unlock />} />
            <Route path="/pass" element={<Pass />} />
            <Route path="/checker" element={<Checker />} />
            <Route path="*" element={<StaticFolderOrNotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
