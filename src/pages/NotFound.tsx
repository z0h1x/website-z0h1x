import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Home, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md animate-spring-in">
          <div className="m3-card rounded-[var(--radius)] p-8 flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: "hsl(var(--blob-yellow) / 0.6)" }}
              />
              <div className="relative w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center shadow-[var(--shadow-soft)]">
                <Compass className="w-9 h-9 text-foreground animate-spin-slow" />
              </div>
            </div>

            <h1 className="wordmark text-7xl text-foreground animate-wordmark leading-none">
              404
            </h1>
            <h2 className="wordmark text-2xl text-foreground -mt-2">
              {t("404.title")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("404.desc")}
            </p>
            <p
              className="text-xs text-muted-foreground/70 font-mono break-all"
              dir="ltr"
            >
              {location.pathname}
            </p>

            <Link
              to="/"
              className="pill-button mt-2 flex items-center justify-center gap-2 w-full h-14 text-base"
            >
              <Home className="w-5 h-5" />
              <span>{t("404.home")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
