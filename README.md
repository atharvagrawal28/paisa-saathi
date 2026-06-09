# Paisa Saathi — Next.js + TypeScript

A mobile-first, **bilingual (English / हिन्दी)** personal-finance calculator platform for Indian families (ages 35–65). Every calculator educates first, then calculates, and ends with a plain-language recommendation.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Chart.js**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (statically generates all 12 calculator routes)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

## The 12 calculators

**Loans** — EMI · Loan Prepayment · Which Loan First · FD vs Loan · Invest vs Repay
**Investments** — SIP · Lumpsum · Goal Planner
**Retirement** — Retirement Corpus · SWP · Can I Retire? · Will My Money Last?

## Project structure

```
app/
  layout.tsx            Root layout: fonts, metadata, LanguageProvider, Header, Footer
  page.tsx              Home dashboard (3 grouped sections of cards)
  calc/<id>/page.tsx    One small static route per calculator (12 folders), each
                        with its own SEO metadata, rendering <CalcClient id="..." />
components/
  LanguageProvider.tsx  EN/HI context, persisted to localStorage, sets <body> font
  Header.tsx Footer.tsx Sticky header w/ language toggle, footer + credit
  CalcClient.tsx        Client wrapper that picks the right view by id
  CalculatorView.tsx    Generic educate→input→result→insight→CTA flow
  WhichFirst.tsx        Special multi-loan ranking calculator
  EduBlock.tsx          "What is this / Why / Example / Learn in 30 seconds"
  ChartView.tsx         Chart.js (doughnut / bar / line) renderer
lib/
  types.ts              Shared types (Calculator, InputDef, ...)
  format.ts             Indian ₹ formatting (lakh/crore), years, percentages
  content.ts            All bilingual UI + per-calculator copy (EN + HI)
  calculators.ts        The 12 calculators: inputs, compute(), chart(), insight()
```

## How language works

`LanguageProvider` exposes `{ lang, setLang, t, L }` via React context and remembers the
choice in `localStorage`. All copy lives in `lib/content.ts` as natural, conversational Hindi
(not machine translation). The few places that need a language inside pure logic
(chart labels, the Invest-vs-Repay recommendation words) call `setCalcLang(lang)` before
`compute()`/`chart()` run in the render pass.

## Adding a calculator

1. Add its bilingual copy to `C` in `lib/content.ts`.
2. Add its definition (inputs, `compute`, optional `chart`, `insight`) to `CALCS` in `lib/calculators.ts`.
3. That's it — the home card, the `/calc/[id]` route and SEO metadata are generated automatically.

## Notes

- All financial figures are educational estimates, not financial advice.
- Default values use sensible 2026 India assumptions (home loan 8.5%, FD 7%, equity 12%, inflation 6%).
- Calculator formulas are verified: EMI ₹26,035 on ₹30L/8.5%/20y, SIP ₹50.5L on ₹10k/12%/15y, etc.
