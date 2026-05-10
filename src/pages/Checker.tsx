import { useState } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

// Hashed fingerprints are loaded at runtime from /checker.inv so they
// don't sit in the JS bundle.
const SALT = "z0h1x_chk_v1";
let HASHED: Set<string> | null = null;
let hashedPromise: Promise<Set<string>> | null = null;
async function loadHashed(): Promise<Set<string>> {
  if (HASHED) return HASHED;
  if (!hashedPromise) {
    hashedPromise = fetch("/checker.inv", { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : ""))
      .then((txt) => {
        HASHED = new Set(
          txt.split(/\s+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
        );
        return HASHED;
      })
      .catch(() => {
        HASHED = new Set();
        return HASHED;
      });
  }
  return hashedPromise;
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

async function validate(raw: string): Promise<{ ok: boolean; variant?: 100 | 200 }> {
  const code = (raw ?? "").trim();
  const m = code.match(/^(100di|200di)(.+)$/i);
  if (!m) return { ok: false };
  const variant: 100 | 200 = m[1].toLowerCase() === "100di" ? 100 : 200;
  const rest = m[2];
  if (rest.length % 3 !== 0) return { ok: false };
  const hashed = await loadHashed();
  for (let i = 0; i < rest.length; i += 3) {
    const h = await sha256Hex(SALT + rest.slice(i, i + 3));
    if (!hashed.has(h)) return { ok: false };
  }
  return { ok: true, variant };
}

type ResultState =
  | { kind: "idle" }
  | { kind: "success"; variant: 100 | 200 }
  | { kind: "error" };

const Checker = () => {
  const { t, dir } = useLanguage();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ResultState>({ kind: "idle" });
  const [loading, setLoading] = useState(false);

  const onCheck = async () => {
    setLoading(true);
    try {
      const r = await validate(code);
      setResult(r.ok ? { kind: "success", variant: r.variant! } : { kind: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir={dir}>
      <ParticlesBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md animate-spring-in">
          <div className="m3-card rounded-[var(--radius)] p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center animate-soft-pulse">
              <Sparkles className="w-7 h-7 text-foreground" />
            </div>
            <h1 className="wordmark text-3xl text-foreground">{t("checker.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("checker.subtitle")}</p>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("checker.placeholder")}
              rows={3}
              dir="ltr"
              className="w-full rounded-2xl border border-border bg-background/70 backdrop-blur px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
            />

            <button
              onClick={onCheck}
              disabled={loading}
              className="pill-button w-full h-14 text-base disabled:opacity-60"
            >
              {loading ? "..." : t("checker.button")}
            </button>

            {result.kind !== "idle" && (
              <div
                key={Math.random()}
                className={`w-full rounded-2xl px-4 py-4 flex items-center justify-center gap-2 font-bold animate-pop-in ${
                  result.kind === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-destructive text-destructive-foreground"
                }`}
                style={{
                  boxShadow:
                    result.kind === "success"
                      ? "0 10px 28px hsl(150 70% 40% / 0.45)"
                      : "0 10px 28px hsl(0 70% 50% / 0.35)",
                }}
              >
                {result.kind === "success" ? (
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <XCircle className="w-5 h-5" strokeWidth={2.5} />
                )}
                <span>
                  {result.kind === "success"
                    ? t(result.variant === 100 ? "checker.success100" : "checker.success200")
                    : t("checker.fail")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checker;
