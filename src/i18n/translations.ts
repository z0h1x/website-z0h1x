// 🌐 Edit your translations here.
// Add a new key by adding a new entry with both `ar` and `en` values.
// Use {placeholders} inside strings — pass values via the `t(key, { placeholder: value })` call.

export type TranslationEntry = { ar: string; en: string };

export const translations = {
  // ─── Profile ──────────────────────────────────────────────
  "profile.tagline": {
    ar: "تطوير الواجهات للمواقع · مطور ماين كرافت · مطور بوتات ديسكورد",
    en: "Front-End · Minecraft dev · Discord bot Developer",
  },
  "footer.madeWith": {
    ar: "© {year} z0h1x · صُنع بعناية و حب",
    en: "© {year} z0h1x · Made with care and love",
  },

  // ─── Sub2Unlock page ──────────────────────────────────────
  "sub.title": { ar: "حصول على كود خريطة", en: "Unlock map password" },
  "sub.subtitle": {
    ar: "تابع صديقي لي حصول على كود",
    en: "Follow my friend on TikTok to get the code",
  },
  "sub.follow": { ar: "تابع ‎@thorffin1x", en: "Follow @thorffin1x" },
  "sub.verifying": { ar: "جاري التحقق…", en: "Verifying…" },
  "sub.verified": { ar: "تم التحقق", en: "Verified" },
  "sub.continue": { ar: "حصول على كود الخريطة", en: "Get Code" },

  // ─── Pass page ────────────────────────────────────────────
  "pass.label": { ar: "كلمة المرور الخريطة", en: "Your Map code" },
  "pass.copy": { ar: "نسخ", en: "Copy" },
  "pass.copied": { ar: "تم النسخ!", en: "Copied!" },
  "pass.lockedTitle": { ar: "الوصول مقفل المرجو أعادة تحقق", en: "Access Locked reverify" },
  "pass.lockedDesc": {
    ar: "يجب عليك إكمال خطوة التحقق أولاً للحصول على كلمة المرور.",
    en: "You must complete the verification step first to get the password.",
  },
  "pass.goVerify": { ar: "اذهب للتحقق", en: "Go Verify" },

  // ─── Checker page ─────────────────────────────────────────
  "checker.title": { ar: "فحص كود الجواهر", en: "Diamond Code Checker" },
  "checker.subtitle": {
    ar: "ألصق كودك بالأسفل وتحقق من صحته",
    en: "Paste your code below to verify it",
  },
  "checker.placeholder": { ar: "ألصق الكود هنا…", en: "Paste your code here…" },
  "checker.button": { ar: "تحقق من الكود", en: "Check Code" },
  "checker.empty": { ar: "الرجاء إدخال كود.", en: "Please enter a code." },
  "checker.success100": { ar: "كود 100 جوهرة صحيح ✅", en: "100 diamond redeem code is correct ✅" },
  "checker.success200": { ar: "كود 200 جوهرة صحيح ✅", en: "200 diamond redeem code is correct ✅" },
  "checker.fail": {
    ar: "كود مش صحيح 😂 محاولة جيدة من متابعين",
    en: "code is not correct 😂 nice try from followers",
  },

  // ─── 404 / Not Found ──────────────────────────────────────
  "404.title": { ar: "الصفحة غير موجودة", en: "Page Not Found" },
  "404.desc": {
    ar: "عذراً، الصفحة التي تبحث عنها غير موجودة.",
    en: "Sorry, the page you are looking for doesn't exist.",
  },
  "404.home": { ar: "العودة للرئيسية", en: "Back to Home" },

  // ─── Language toggle ──────────────────────────────────────
  "lang.switch": { ar: "EN", en: "ع" },
  "lang.label": { ar: "تغيير اللغة", en: "Change language" },
} satisfies Record<string, TranslationEntry>;

export type TranslationKey = keyof typeof translations;
