'use client';

import Link from 'next/link';
import { useLang } from '@/components/LanguageProvider';
import { CALCS } from '@/lib/calculators';
import { C } from '@/lib/content';
import type { Calculator } from '@/lib/types';

function Card({ calc }: { calc: Calculator }) {
  const { lang, t } = useLang();
  const c = C[calc.id][lang];
  return (
    <Link
      href={`/calc/${calc.id}`}
      className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-500 hover:shadow-lg hover:-translate-y-0.5 transition active:scale-[.99]"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0">{calc.icon}</span>
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-tight text-ink-900">{c.t}</h3>
          <p className="text-sm text-ink-500 mt-1">{c.s}</p>
          <span className="inline-flex items-center gap-1 mt-3 text-brand-600 font-semibold text-sm">
            {t('openCalc')} <span className="group-hover:translate-x-1 transition">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function Section({ title, sub, cat }: { title: string; sub: string; cat: Calculator['cat'] }) {
  const items = CALCS.filter((c) => c.cat === cat);
  return (
    <section className="mb-9">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-ink-900">{title}</h2>
        <p className="text-sm text-ink-500">{sub}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Card key={c.id} calc={c} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t, L } = useLang();
  return (
    <div className="fade">
      <div className="text-center sm:text-left mb-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-9">
        <span className="inline-block text-xs font-bold tracking-wide text-brand-700 bg-brand-50 px-3 py-1 rounded-full mb-3">
          {t('tagline')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink-900 leading-tight">
          {L('Make better money decisions, simply.', 'बेहतर पैसे के फ़ैसले, बहुत आसानी से।')}
        </h1>
        <p className="text-ink-500 mt-3 max-w-2xl text-base sm:text-lg">{t('heroP')}</p>
      </div>
      <Section title={t('secLoans')} sub={t('secLoansSub')} cat="loan" />
      <Section title={t('secInvest')} sub={t('secInvestSub')} cat="invest" />
      <Section title={t('secRetire')} sub={t('secRetireSub')} cat="retire" />
    </div>
  );
}
