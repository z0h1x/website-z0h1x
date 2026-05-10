import profilePhoto from "@/assets/profile-photo.png";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProfileCard = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center mb-10">
      {/* Avatar — Pixel-style soft squircle ring */}
      <div className="relative mx-auto mb-7 animate-pop-in" style={{ width: "168px", height: "168px" }}>
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: "hsl(var(--blob-yellow) / 0.55)" }}
        />
        <div className="absolute inset-2 rounded-full border-2 border-foreground/10 animate-spin-slow" />

        <div className="relative w-full h-full rounded-full overflow-hidden bg-card border-[6px] border-background shadow-[0_12px_40px_hsl(40_30%_25%/0.18)]">
          <img
            src={profilePhoto}
            alt="z0h1x"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
          />
        </div>

        {/* Online dot */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-background flex items-center justify-center shadow-md">
          <span className="w-3 h-3 rounded-full bg-[hsl(150_60%_45%)] animate-soft-pulse" />
        </div>
      </div>

      <h1
        className="wordmark text-5xl sm:text-6xl text-foreground mb-3 animate-wordmark"
        style={{ animationDelay: "0.1s" }}
      >
        z0h1x
      </h1>

      <p
        className="text-foreground/70 text-base sm:text-lg max-w-sm mx-auto leading-relaxed font-medium animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        {t("profile.tagline")}
      </p>
    </div>
  );
};
