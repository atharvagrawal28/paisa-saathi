'use client';

import Link from 'next/link';
import { useLang } from './LanguageProvider';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-7">
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between text-sm text-ink-500">
          <span>{t('footerNote')}</span>
          <Link href="/" className="text-brand-600 font-semibold">
            {t('footerHome')}
          </Link>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-ink-500">
          <span>{t('builtBy')}</span>
          <a
            href="https://www.linkedin.com/in/atharv-agrawal-295743233"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-ink-900 hover:text-brand-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            Atharv Agrawal
          </a>
        </div>
      </div>
    </footer>
  );
}
