'use client';

import { useLang } from './LanguageProvider';
import { C } from '@/lib/content';

/** Educate-first block: What is this? / Why it matters / Example / Learn in 30 seconds */
export default function EduBlock({ calcId }: { calcId: string }) {
  const { lang, t } = useLang();
  const c = C[calcId][lang];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-bold text-lg text-ink-900">{t('whatIs')}</h2>
        <p className="text-ink-700 mt-1">{c.what}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-brand-50 rounded-2xl border border-brand-100 p-5">
          <h2 className="font-bold text-base text-brand-700">{t('whyMatter')}</h2>
          <p className="text-ink-700 mt-1 text-sm">{c.why}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
          <h2 className="font-bold text-base text-amber-700">{t('exampleH')}</h2>
          <p className="text-ink-700 mt-1 text-sm">{c.eg}</p>
        </div>
      </div>

      <details className="bg-white rounded-2xl border border-slate-200 p-5">
        <summary className="flex items-center justify-between font-bold text-ink-900 cursor-pointer list-none">
          <span>💡 {t('learn30')}</span>
          <span className="text-brand-600">+</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-100">
          {c.learn.map((x, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-ink-900">{x.q}</p>
              <p className="text-ink-700 text-sm mt-0.5">{x.a}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
