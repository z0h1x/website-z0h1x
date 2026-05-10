import { useState } from "react";
import { Github, Youtube, Globe, Instagram, ArrowUpRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import discordIcon from "@/assets/discord-icon.png";

type SocialLink = {
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | "discord";
  tile: string;
  iconColor: string;
};

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    handle: "@z0h1x",
    url: "https://github.com/z0h1x",
    icon: Github,
    tile: "hsl(35 25% 25%)",
    iconColor: "hsl(40 35% 88%)",
  },
  {
    name: "YouTube",
    handle: "@z0h1x",
    url: "https://youtube.com/@z0h1x?si=bQhcf4owx_lSO-Lz",
    icon: Youtube,
    tile: "hsl(10 35% 22%)",
    iconColor: "hsl(8 75% 65%)",
  },
  {
    name: "Websites",
    handle: "zohir-websites.vercel.app",
    url: "https://zohir-websites.vercel.app",
    icon: Globe,
    tile: "hsl(42 50% 25%)",
    iconColor: "hsl(42 85% 65%)",
  },
  {
    name: "Instagram",
    handle: "@z0h1xx",
    url: "https://www.instagram.com/z0h1xx",
    icon: Instagram,
    tile: "hsl(330 30% 25%)",
    iconColor: "hsl(330 70% 75%)",
  },
  {
    name: "Discord",
    handle: "z0h1x",
    url: "https://discord.gg/4GRxtjJv",
    icon: "discord",
    tile: "hsl(235 30% 28%)",
    iconColor: "hsl(235 70% 75%)",
  },
];

type PreviewData = {
  screenshot?: string;
  summary?: string;
  title?: string | null;
  description?: string | null;
};

const previewCache = new Map<string, PreviewData>();

const fetchPreview = async (url: string, name: string): Promise<PreviewData> => {
  try {
    const res = await fetch(`/api/preview-link?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          screenshot: data.screenshot,
          summary: data.summary,
          title: data.title,
          description: data.description,
        };
      }
    }
  } catch {
    // fall through to fallback
  }
  return {
    summary: `Live preview isn't available for ${name}. Tap below to open it.`,
    title: name,
  };
};

export const SocialLinks = () => {
  const [active, setActive] = useState<SocialLink | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openLink = async (link: SocialLink) => {
    setActive(link);
    setError(null);

    if (previewCache.has(link.url)) {
      setPreview(previewCache.get(link.url)!);
      setLoading(false);
      return;
    }

    setPreview(null);
    setLoading(true);
    try {
      const p = await fetchPreview(link.url, link.name);
      previewCache.set(link.url, p);
      setPreview(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load preview");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setActive(null);
    setPreview(null);
    setError(null);
  };

  return (
    <>
      <div className="space-y-3 max-w-md mx-auto">
        {socialLinks.map((link, index) => {
          const Icon = link.icon;
          const isDiscord = link.icon === "discord";

          return (
            <button
              key={link.name}
              onClick={() => openLink(link)}
              className="group block w-full text-left animate-spring-in"
              style={{ animationDelay: `${0.35 + index * 0.07}s` }}
            >
              <div
                className="m3-card flex items-center gap-4 p-3 pr-5"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
                  style={{
                    background: link.tile,
                    transitionTimingFunction: "var(--ease-emphasized)",
                  }}
                >
                  {isDiscord ? (
                    <img src={discordIcon} alt="Discord" className="w-7 h-7" />
                  ) : (
                    Icon !== "discord" && (
                      <Icon className="w-6 h-6" style={{ color: link.iconColor }} />
                    )
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-base leading-tight">
                    {link.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{link.handle}</p>
                </div>

                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4 text-foreground" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && close()}>
        <DialogContent
          className="bg-card border-border max-w-md p-0 overflow-hidden"
          style={{ borderRadius: "calc(var(--radius) + 0.25rem)" }}
        >
          {active && (
            <div className="animate-spring-in">
              <div
                className="relative w-full aspect-video overflow-hidden"
                style={{ background: active.tile }}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: active.iconColor }} />
                  </div>
                )}
                {!loading && preview?.screenshot && (
                  <img
                    src={preview.screenshot}
                    alt={`${active.name} preview`}
                    className="w-full h-full object-cover object-top animate-fade-up"
                  />
                )}
                {!loading && !preview?.screenshot && (() => {
                  const ActiveIcon = active.icon;
                  return (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-3xl bg-background flex items-center justify-center shadow-md">
                        {ActiveIcon === "discord" ? (
                          <img src={discordIcon} alt="Discord" className="w-10 h-10" />
                        ) : (
                          <ActiveIcon className="w-10 h-10" style={{ color: active.iconColor }} />
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 pt-5 pb-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="wordmark text-3xl text-foreground">
                    {preview?.title || active.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {active.handle}
                  </DialogDescription>
                </DialogHeader>

                <p className="mt-3 text-sm text-foreground/80 line-clamp-4 min-h-[3rem]">
                  {loading
                    ? "Fetching the latest…"
                    : error
                      ? "Preview unavailable. You can still open it directly."
                      : preview?.summary ||
                        preview?.description ||
                        "Open the link to see the full content."}
                </p>

                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button mt-6 flex items-center justify-center gap-2 w-full py-4 text-base"
                >
                  Open {active.name}
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
