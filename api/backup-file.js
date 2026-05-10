import formidable from "formidable";
import { createReadStream } from "fs";

export const config = { api: { bodyParser: false } };

function getCaption() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dd = pad(now.getDate());
  const mm = pad(now.getMonth() + 1);
  const yyyy = now.getFullYear();
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss} [${tz}]`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ success: false, error: "Telegram not configured" });
    return;
  }

  const form = formidable({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 });

  let files;
  try {
    [, files] = await form.parse(req);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || "parse error" });
    return;
  }

  const fileArray = files.file;
  const uploaded = Array.isArray(fileArray) ? fileArray[0] : fileArray;
  if (!uploaded) {
    res.status(400).json({ success: false, error: "No file received" });
    return;
  }

  try {
    const apiUrl = `https://api.telegram.org/bot${token}/sendDocument`;
    const tgForm = new FormData();
    tgForm.append("chat_id", chatId);
    tgForm.append("caption", getCaption());

    const stream = createReadStream(uploaded.filepath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const blob = new Blob([Buffer.concat(chunks)]);
    tgForm.append("document", blob, uploaded.originalFilename ?? "backup.bin");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const tgRes = await fetch(apiUrl, {
      method: "POST",
      body: tgForm,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!tgRes.ok) {
      console.error("[backup-file] Telegram error:", await tgRes.text());
      res.status(502).json({ success: false, error: "Telegram upload failed" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[backup-file] error:", err?.message);
    res.status(500).json({ success: false, error: err?.message ?? "upload error" });
  }
}
