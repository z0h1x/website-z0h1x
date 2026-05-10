import { Resolver } from "dns/promises";

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
  /^fe80:/i,
  /^0\./,
  /^localhost$/i,
];

function isPrivateIp(ip) {
  return PRIVATE_IP_PATTERNS.some((p) => p.test(ip));
}

function parseAndValidateUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!url.hostname || isPrivateIp(url.hostname)) return null;
  const port = url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80;
  if (![80, 443].includes(port)) return null;
  return url;
}

async function isSafeUrl(url) {
  if (isPrivateIp(url.hostname)) return false;
  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  let ips = [];
  try {
    const [v4, v6] = await Promise.allSettled([
      resolver.resolve4(url.hostname),
      resolver.resolve6(url.hostname),
    ]);
    if (v4.status === "fulfilled") ips.push(...v4.value);
    if (v6.status === "fulfilled") ips.push(...v6.value);
  } catch { return false; }
  if (ips.length === 0) return false;
  return ips.every((ip) => !isPrivateIp(ip));
}

async function safeFetch(initialUrl) {
  let currentUrl = initialUrl;
  for (let hops = 0; hops <= 5; hops++) {
    if (!(await isSafeUrl(currentUrl))) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response;
    try {
      response = await fetch(currentUrl.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)", Accept: "text/html" },
      });
    } finally { clearTimeout(timeout); }
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      let nextUrl;
      try { nextUrl = new URL(location, currentUrl.toString()); } catch { return null; }
      const validated = parseAndValidateUrl(nextUrl.toString());
      if (!validated) return null;
      currentUrl = validated;
      continue;
    }
    return response;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawUrl = req.query?.url;
  if (!rawUrl || typeof rawUrl !== "string") {
    res.status(400).json({ success: false, error: "url is required" });
    return;
  }

  const parsed = parseAndValidateUrl(rawUrl);
  if (!parsed) {
    res.status(400).json({ success: false, error: "invalid or disallowed url" });
    return;
  }

  try {
    const response = await safeFetch(parsed);
    if (!response || !response.ok) { res.json({ success: false, fallback: true }); return; }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) { res.json({ success: false, fallback: true }); return; }

    const reader = response.body?.getReader();
    if (!reader) { res.json({ success: false, fallback: true }); return; }
    let html = "";
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 500_000) break;
      html += new TextDecoder().decode(value, { stream: true });
    }
    reader.cancel();

    const getMeta = (name) => {
      for (const pat of [
        new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']{0,500})["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']{0,500})["'][^>]+property=["']${name}["']`, "i"),
        new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']{0,500})["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']{0,500})["'][^>]+name=["']${name}["']`, "i"),
      ]) {
        const m = html.match(pat);
        if (m) return m[1].trim();
      }
      return null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]{0,200})<\/title>/i);
    const title = getMeta("og:title") || getMeta("twitter:title") || (titleMatch ? titleMatch[1].trim() : null);
    const description = getMeta("og:description") || getMeta("twitter:description") || getMeta("description");
    const image = getMeta("og:image") || getMeta("twitter:image");

    let safeImage = null;
    if (image) {
      const imgParsed = parseAndValidateUrl(image);
      if (imgParsed && await isSafeUrl(imgParsed)) safeImage = imgParsed.toString();
    }

    res.json({ success: true, title, description, summary: description, screenshot: safeImage });
  } catch {
    res.json({ success: false, fallback: true });
  }
}
