import { useEffect, useState } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Copy, Check, Lock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const PASS_TEXT = "زيت شاروخان الهندي";

const Pass = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setVerified(window.localStorage.getItem("z0h1x_verified") === "true");
    } catch {
      setVerified(false);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PASS_TEXT);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PASS_TEXT;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (verified === null) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticlesBackground />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
          <div className="w-full max-w-md animate-spring-in">
            <div className="m3-card rounded-[var(--radius)] p-8 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Lock className="w-7 h-7 text-foreground/70" />
              </div>
              <h1 className="wordmark text-3xl text-foreground">
                {t("pass.lockedTitle")}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("pass.lockedDesc")}
              </p>
              <Link
                to="/sub2unlock"
                className="pill-button mt-2 flex items-center justify-center gap-2 w-full h-14 text-base"
              >
                <span>{t("pass.goVerify")}</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md animate-spring-in">
          <div className="m3-card rounded-[var(--radius)] p-8 flex flex-col items-center gap-6 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {t("pass.label")}
            </span>
            <p
              dir="rtl"
              lang="ar"
              className="text-3xl sm:text-4xl font-extrabold text-foreground leading-snug"
              style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
            >
              {PASS_TEXT}
            </p>

            <button
              onClick={handleCopy}
              className={`relative w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold transition-all duration-300 ${
                copied
                  ? "bg-emerald-500 text-white scale-[1.02]"
                  : "pill-button"
              }`}
              style={{
                boxShadow: copied
                  ? "0 10px 28px hsl(150 70% 40% / 0.45)"
                  : undefined,
              }}
            >
              {copied ? (
                <span className="flex items-center gap-2 animate-pop-in">
                  <Check className="w-5 h-5" strokeWidth={3} />
                  {t("pass.copied")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  {t("pass.copy")}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pass;