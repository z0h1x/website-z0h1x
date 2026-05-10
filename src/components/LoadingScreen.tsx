import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsExiting(true), 1100);
    const t2 = setTimeout(onComplete, 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      {/* Soft corner blobs */}
      <div
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full blur-2xl animate-blob-drift-slow"
        style={{ background: "hsl(var(--blob-yellow) / 0.6)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-2xl animate-blob-drift"
        style={{ background: "hsl(var(--blob-mint) / 0.55)" }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Pixel-style logomark */}
        <div className="flex items-center gap-3 animate-pop-in">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
            <span className="wordmark text-3xl text-background">z</span>
          </div>
          <span className="wordmark text-4xl text-foreground">z0h1x</span>
        </div>

        {/* Material 3 bouncing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-foreground/70 animate-dot-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
