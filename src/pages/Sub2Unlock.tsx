import { useState, useEffect, useRef } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Loader2, Check, Music2, ArrowRight } from "lucide-react";
import thorffinPic from "@/assets/thorffin1x.jpg";
import myPic from "@/assets/profile-photo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Sub2Unlock = () => {
  const { t } = useLanguage();
  const [tiktokClicked, setTiktokClicked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const triggeredRef = useRef(false);

  // When user comes back from TikTok tab, start the verification flow
  useEffect(() => {
    const onVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        tiktokClicked &&
        !triggeredRef.current
      ) {
        triggeredRef.current = true;
        setVerifying(true);
      }
    };
    const onFocus = () => onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [tiktokClicked]);

  useEffect(() => {
    if (!verifying || success) return;
    const timer = window.setTimeout(() => {
      setSuccess(true);
      try {
        window.localStorage.setItem("z0h1x_verified", "true");
      } catch {}
    }, 5000);
    return () => clearTimeout(timer);
  }, [verifying, success]);

  const handleContinue = () => {
    if (!success) return;
    window.location.href = "/pass";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <style>{`
        @keyframes slide-in-right-fade {
          0% { opacity: 0; transform: translateX(-14px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .anim-slide-right { animation: slide-in-right-fade 0.55s var(--ease-emphasized, cubic-bezier(0.2, 0.8, 0.2, 1)) both; }
        @keyframes arrow-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .anim-arrow-nudge { animation: arrow-nudge 1.6s ease-in-out infinite; }
      `}</style>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md flex flex-col items-center gap-6 animate-spring-in">
          {/* Collab header */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shrink-0"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <img
                src={thorffinPic}
                alt="@thorffin1x"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="wordmark text-5xl sm:text-6xl text-foreground select-none"
              aria-hidden
            >
              ×
            </span>
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shrink-0"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <img
                src={myPic}
                alt="@z0h1x"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="wordmark text-4xl text-foreground text-center">
            {t("sub.title")}
          </h1>
          <p className="text-muted-foreground text-center text-sm -mt-3 mb-1">
            {t("sub.subtitle")}
          </p>

          {/* TikTok follow button — turns into loader, then green success */}
          <a
            href={verifying || success ? undefined : "https://www.tiktok.com/@thorffin1x"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (verifying || success) {
                e.preventDefault();
                return;
              }
              setTiktokClicked(true);
            }}
            aria-disabled={verifying || success}
            className={`group relative w-full flex items-center justify-center gap-3 h-16 px-6 rounded-full font-bold text-lg overflow-hidden transition-all duration-500 ${
              success
                ? "bg-emerald-500 text-white scale-[1.02] cursor-default"
                : verifying
                  ? "bg-card border border-border text-foreground cursor-wait"
                  : "bg-black text-white hover:scale-[1.03] active:scale-[0.98]"
            }`}
            style={{
              boxShadow: success
                ? "0 10px 30px hsl(150 70% 40% / 0.45)"
                : verifying
                  ? "var(--shadow-soft)"
                  : "0 0 0 1px rgba(255,255,255,0.05), 0 8px 30px rgba(0,0,0,0.35), 0 0 24px rgba(37,244,238,0.35), 0 0 24px rgba(254,44,85,0.25)",
              transitionTimingFunction: "var(--ease-emphasized)",
            }}
          >
            {success ? (
              <>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 anim-slide-right">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </span>
                <span className="anim-slide-right" style={{ animationDelay: "0.08s" }}>
                  {t("sub.verified")}
                </span>
              </>
            ) : verifying ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="animate-fade-up">{t("sub.verifying")}</span>
              </>
            ) : (
              <>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 50%, rgba(37,244,238,0.25), transparent 60%), radial-gradient(circle at 70% 50%, rgba(254,44,85,0.25), transparent 60%)",
                  }}
                />
                <span className="relative inline-flex items-center justify-center w-7 h-7">
                  <Music2
                    className="absolute w-6 h-6"
                    style={{ color: "#25F4EE", transform: "translate(-2px,-2px)" }}
                  />
                  <Music2
                    className="absolute w-6 h-6"
                    style={{ color: "#FE2C55", transform: "translate(2px,2px)" }}
                  />
                  <Music2 className="relative w-6 h-6 text-white" />
                </span>
                <span className="relative">{t("sub.follow")}</span>
              </>
            )}
          </a>

          {/* Continue button — disabled gray → verifying → dark active */}
          <button
            onClick={handleContinue}
            disabled={!success}
            className={`group w-full h-14 mt-6 rounded-full flex items-center justify-center gap-3 font-semibold text-base transition-all duration-500 ${
              success
                ? "bg-foreground text-background scale-[1.02] hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                : verifying
                  ? "bg-card border border-border text-foreground cursor-wait"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
            }`}
            style={{
              boxShadow: success
                ? "0 14px 34px hsl(0 0% 0% / 0.35)"
                : verifying
                  ? "var(--shadow-soft)"
                  : "none",
              transitionTimingFunction: "var(--ease-emphasized)",
            }}
          >
            <span>{t("sub.continue")}</span>
            {success && (
              <ArrowRight
                className="w-5 h-5 anim-arrow-nudge group-hover:translate-x-1 transition-transform rtl:rotate-180"
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sub2Unlock;