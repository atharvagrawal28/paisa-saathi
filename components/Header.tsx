'use client';

import Link from 'next/link';
import { useLang } from './LanguageProvider';
import type { Lang } from '@/lib/types';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const btn = (active: boolean) =>
    'px-3 py-1.5 rounded-full transition ' + (active ? 'bg-white shadow text-brand-700' : 'text-ink-500');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-brand-500 text-white grid place-items-center text-lg font-bold">₹</span>
          <span className="font-bold text-lg leading-none">{t('appName')}</span>
        </Link>
        <div className="flex rounded-full bg-slate-100 p-1 text-sm font-semibold" role="group" aria-label="Language">
          <button className={btn(lang === 'en')} onClick={() => setLang('en' as Lang)}>
            English
          </button>
          <button className={btn(lang === 'hi')} onClick={() => setLang('hi' as Lang)}>
            हिन्दी
          </button>
        </div>
      </div>
    </header>
  );
}
