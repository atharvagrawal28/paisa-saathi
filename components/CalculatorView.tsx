'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLang } from './LanguageProvider';
import EduBlock from './EduBlock';
import ChartView from './ChartView';
import { CALCS, setCalcLang } from '@/lib/calculators';
import { C, GOAL_PRESETS } from '@/lib/content';
import { fmt, fShort } from '@/lib/format';
import type { Calculator, InputDef, Vals } from '@/lib/types';

function InputRow({
  calcId,
  inp,
  value,
  onChange,
}: {
  calcId: string;
  inp: InputDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const { lang, t } = useLang();
  const c = C[calcId][lang].in[inp.k];
  const prefix = inp.kind === 'inr' ? '₹' : '';
  const suffix = inp.kind === 'pct' ? '%' : inp.kind === 'yr' ? t('yrsShort') : '';
  const clamp = (v: number) => Math.min(inp.max, Math.max(inp.min, v));

  return (
    <div className="mb-5">
      <label htmlFor={'in_' + inp.k} className="block text-base sm:text-lg font-semibold text-ink-900">
        {c.l}
      </label>
      {c.h && <p className="text-sm text-ink-500 mt-0.5">{c.h}</p>}
      <div className="mt-2 flex items-center gap-2">
        {prefix && <span className="text-2xl font-bold text-ink-500">{prefix}</span>}
        <input
          id={'in_' + inp.k}
          type="number"
          value={Number.isFinite(value) ? value : ''}
          min={inp.min}
          max={inp.max}
          step={inp.step}
          inputMode="decimal"
          aria-label={c.l}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="num-in w-full text-2xl font-bold text-ink-900 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-500 focus:outline-none"
        />
        {suffix && <span className="text-lg font-semibold text-ink-500 whitespace-nowrap">{suffix}</span>}
      </div>
      {inp.kind === 'inr' && <div className="text-sm font-semibold text-brand-700 mt-1">= {fShort(value || 0)}</div>}
      <input
        type="range"
        value={clamp(value || inp.min)}
        min={inp.min}
        max={inp.max}
        step={inp.step}
        aria-hidden="true"
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
}

export default function CalculatorView({ calc }: { calc: Calculator }) {
  const { lang, t } = useLang();
  const c = C[calc.id][lang];
  const inputs = calc.inputs ?? [];

  const [vals, setVals] = useState<Vals>(() => {
    const o: Vals = {};
    inputs.forEach((i) => (o[i.k] = i.def));
    return o;
  });

  const setVal = (k: string, v: number) => setVals((prev) => ({ ...prev, [k]: v }));

  // setCalcLang must run before compute()/chart() so localized labels + recommendation words match.
  setCalcLang(lang);
  const result = useMemo(() => {
    setCalcLang(lang);
    return calc.compute ? calc.compute(vals) : {};
  }, [calc, vals, lang]);

  const chartSpec = useMemo(() => {
    setCalcLang(lang);
    return calc.chart ? calc.chart(vals, result) : null;
  }, [calc, vals, result, lang]);

  const ctaCalc = CALCS.find((x) => x.id === calc.cta)!;
  const results = calc.results ?? [];
  const bigs = results.filter((r) => r.big);
  const smalls = results.filter((r) => !r.big);

  const renderValue = (kind: string, raw: any) =>
    kind === 'txt' ? String(raw) : fmt(Number(raw), kind as any, lang);

  return (
    <div className="fade">
      {/* header */}
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

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        {/* inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-bold text-lg text-ink-900 mb-4">{t('yourInputs')}</h2>

          {calc.goals && (
            <div className="flex flex-wrap gap-2 mb-4">
              {GOAL_PRESETS.map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => setVals((p) => ({ ...p, target: g.target, years: g.years }))}
                  className="px-3 py-2 rounded-full border-2 border-slate-200 text-sm font-semibold hover:border-brand-500"
                >
                  {g[lang]}
                </button>
              ))}
            </div>
          )}

          {inputs.map((inp) => (
            <InputRow key={inp.k} calcId={calc.id} inp={inp} value={vals[inp.k]} onChange={(v) => setVal(inp.k, v)} />
          ))}
        </div>

        {/* results */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-ink-900">{t('results')}</h2>

          {bigs.map((r) => (
            <div key={r.k} className="bg-white rounded-2xl border-2 border-brand-500 p-6 text-center">
              <p className="text-ink-500 font-semibold">{c.res[r.k]}</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-700 mt-1 num-in">
                {renderValue(r.kind, result[r.k])}
              </p>
            </div>
          ))}

          {smalls.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {smalls.map((r) => (
                <div key={r.k} className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-ink-500 text-sm font-semibold">{c.res[r.k]}</p>
                  <p className="text-xl font-bold text-ink-900 mt-0.5 num-in">{renderValue(r.kind, result[r.k])}</p>
                </div>
              ))}
            </div>
          )}

          {chartSpec && <ChartView spec={chartSpec} />}

          {calc.insight && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <p className="font-bold text-indigo-700 mb-1">🤖 {t('whatThisMeans')}</p>
              <p
                className="text-ink-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: calc.insight(vals, result, lang) }}
              />
            </div>
          )}
        </div>
      </div>

      {/* next step CTA */}
      <div className="mt-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-bold text-lg">{t('nextStep')}</p>
          <p className="text-brand-50 text-sm mt-0.5">
            {C[ctaCalc.id][lang].t} — {C[ctaCalc.id][lang].s}
          </p>
        </div>
        <Link
          href={`/calc/${ctaCalc.id}`}
          className="shrink-0 bg-white text-brand-700 font-bold px-5 py-3 rounded-xl text-center"
        >
          {t('goTo')} →
        </Link>
      </div>
    </div>
  );
}
