import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { lang, toggle, t } = useLanguage();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (animating) return;
    setAnimating(true);
    // Sweep overlay covers the screen, then we swap language at midpoint
    window.setTimeout(() => {
      toggle();
    }, 350);
    window.setTimeout(() => {
      setAnimating(false);
    }, 850);
  };

  return (
    <>
      <style>{`
        @keyframes lang-sweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes lang-flip {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(90deg) scale(1.15); }
          100% { transform: rotateY(0deg) scale(1); }
        }
        .lang-sweep-overlay { animation: lang-sweep 0.85s var(--ease-emphasized, cubic-bezier(0.2,0.8,0.2,1)) both; }
        .lang-flip { animation: lang-flip 0.7s var(--ease-emphasized, cubic-bezier(0.2,0.8,0.2,1)) both; }
      `}</style>

      {/* Full-screen sweep overlay shown during transition */}
      {animating && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none lang-sweep-overlay"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, hsl(var(--blob-yellow) / 0.95) 35%, hsl(var(--primary) / 0.95) 50%, hsl(var(--blob-mint) / 0.95) 65%, transparent 100%)",
            boxShadow: "0 0 80px hsl(var(--primary) / 0.5)",
          }}
        />
      )}

      <button
        onClick={handleClick}
        aria-label={t("lang.label")}
        title={t("lang.label")}
        className="fixed top-5 end-5 z-[60] group"
        style={{ direction: "ltr" }}
      >
        <span
          className="relative flex items-center gap-2 h-12 ps-3 pe-4 rounded-full bg-card border border-border font-bold text-foreground shadow-[var(--shadow-soft)] hover:scale-105 active:scale-95 transition-transform duration-300"
          style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
        >
          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-pill)]">
            <Languages className="w-4 h-4" />
          </span>
          <span
            key={lang}
            className="wordmark text-lg lang-flip min-w-[1.2rem] text-center"
          >
            {lang === "ar" ? "EN" : "ع"}
          </span>
        </span>
      </button>
    </>
  );
};