'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Lang } from '@/lib/types';
import { UI } from '@/lib/content';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** UI string lookup for the current language */
  t: (key: string) => string;
  /** Pick the English or Hindi literal for the current language */
  L: (en: string, hi: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Restore saved preference on mount
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('ps_lang')) as Lang | null;
    if (saved === 'en' || saved === 'hi') setLangState(saved);
  }, []);

  // Keep <body> font + persisted choice in sync
  useEffect(() => {
    document.body.classList.toggle('lang-hi', lang === 'hi');
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem('ps_lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((key: string) => UI[lang][key] ?? UI.en[key] ?? key, [lang]);
  const L = useCallback((en: string, hi: string) => (lang === 'hi' ? hi : en), [lang]);

  return <Ctx.Provider value={{ lang, setLang, t, L }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
