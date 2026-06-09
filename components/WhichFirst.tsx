'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from './LanguageProvider';
import EduBlock from './EduBlock';
import { C } from '@/lib/content';
import { fShort } from '@/lib/format';
import type { Calculator, LoanRow } from '@/lib/types';

export default function WhichFirst({ calc }: { calc: Calculator }) {
  const { lang, t, L } = useLang();
  const c = C[calc.id][lang];

  const [rows, setRows] = useState<LoanRow[]>([
    { name: L('Home Loan', 'होम लोन'), amt: 2500000, rate: 8.5, emi: 21500 },
    { name: L('Car Loan', 'कार लोन'), amt: 600000, rate: 10.5, emi: 13000 },
    { name: L('Personal Loan', 'पर्सनल लोन'), amt: 300000, rate: 15, emi: 10400 },
  ]);

  const update = (i: number, f: keyof LoanRow, v: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [f]: f === 'name' ? v : parseFloat(v) || 0 } : r)));
  const add = () => setRows((p) => [...p, { name: L('New Loan', 'नया लोन'), amt: 100000, rate: 12, emi: 3000 }]);
  const remove = (i: number) => setRows((p) => p.filter((_, idx) => idx !== i));

  const ranked = [...rows].sort((a, b) => b.rate - a.rate);
  const top = ranked[0];
  const low = ranked[ranked.length - 1];

  const insight =
    lang === 'hi'
      ? `अपना अतिरिक्त पैसा सबसे पहले <b>${top.name}</b> पर लगाएँ — इसका ब्याज (${top.rate}%) सबसे ऊँचा है, इसलिए यहाँ हर रुपया सबसे ज़्यादा बचत करता है। <b>${low.name}</b> (${low.rate}%) सबसे आख़िर में रखें। बाकी सभी लोन की EMI समय पर चलाते रहें।`
      : `Put your extra money towards <b>${top.name}</b> first — its rate (${top.rate}%) is the highest, so every rupee here saves the most. Keep <b>${low.name}</b> (${low.rate}%) for last. Continue paying the normal EMI on all loans.`;

  return (
    <div className="fade">
      <div className="mb-5">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-brand-600">
          ← {t('back')}
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-4xl">{calc.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 leading-tight">{c.t}</h1>
            <p className="text-ink-500">{c.s}</p>
          </div>
        </div>
      </div>

      <EduBlock calcId={calc.id} />

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-bold text-lg text-ink-900 mb-4">{t('yourInputs')}</h2>
        <div className="space-y-4">
          {rows.map((ln, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  value={ln.name}
                  aria-label={t('loanName')}
                  onChange={(e) => update(i, 'name', e.target.value)}
                  className="font-bold text-ink-900 text-lg border-b border-transparent focus:border-brand-500 focus:outline-none w-2/3"
                />
                {rows.length > 1 && (
                  <button onClick={() => remove(i)} className="text-sm font-semibold text-red-500">
                    {t('remove')}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="text-xs font-semibold text-ink-500">
                  {C.emi[lang].in.amount.l}
                  <input
                    type="number"
                    value={ln.amt}
                    onChange={(e) => update(i, 'amt', e.target.value)}
                    className="num-in w-full text-base font-bold border-2 border-slate-200 rounded-lg px-2 py-2 mt-1 focus:border-brand-500 focus:outline-none"
                  />
                </label>
                <label className="text-xs font-semibold text-ink-500">
                  {L('Rate %', 'दर %')}
                  <input
                    type="number"
                    step="0.1"
                    value={ln.rate}
                    onChange={(e) => update(i, 'rate', e.target.value)}
                    className="num-in w-full text-base font-bold border-2 border-slate-200 rounded-lg px-2 py-2 mt-1 focus:border-brand-500 focus:outline-none"
                  />
                </label>
                <label className="text-xs font-semibold text-ink-500">
                  EMI
                  <input
                    type="number"
                    value={ln.emi}
                    onChange={(e) => update(i, 'emi', e.target.value)}
                    className="num-in w-full text-base font-bold border-2 border-slate-200 rounded-lg px-2 py-2 mt-1 focus:border-brand-500 focus:outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={add}
          className="mt-4 w-full border-2 border-dashed border-slate-300 rounded-xl py-3 font-semibold text-brand-600 hover:border-brand-500"
        >
          {t('addLoan')}
        </button>
      </div>

      {/* ranking */}
      <div className="mt-5 space-y-4">
        <h2 className="font-bold text-lg text-ink-900">{L('Your repayment order', 'आपका चुकाने का क्रम')}</h2>
        <div className="space-y-3">
          {ranked.map((l, pos) => {
            const medal = pos === 0 ? '🥇' : pos === 1 ? '🥈' : pos === 2 ? '🥉' : pos + 1 + '.';
            return (
              <div
                key={pos}
                className={
                  'flex items-center gap-3 p-4 rounded-xl border ' +
                  (pos === 0 ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white')
                }
              >
                <span className="text-2xl w-8 text-center">{medal}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-ink-900">{l.name}</p>
                    {pos === 0 && (
                      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        {L('Repay first', 'पहले चुकाएँ')}
                      </span>
                    )}
                    {pos === ranked.length - 1 && (
                      <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                        {L('Lowest priority', 'सबसे कम प्राथमिकता')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-500">
                    {fShort(l.amt)} · {L('Rate', 'दर')} {l.rate}% · EMI {fShort(l.emi)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <p className="font-bold text-indigo-700 mb-1">🤖 {t('whatThisMeans')}</p>
          <p className="text-ink-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: insight }} />
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-bold text-lg">{t('nextStep')}</p>
          <p className="text-brand-50 text-sm mt-0.5">
            {C.prepay[lang].t} — {C.prepay[lang].s}
          </p>
        </div>
        <Link href="/calc/prepay" className="shrink-0 bg-white text-brand-700 font-bold px-5 py-3 rounded-xl text-center">
          {t('goTo')} →
        </Link>
      </div>
    </div>
  );
}
