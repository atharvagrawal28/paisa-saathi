import type { Kind, Lang } from './types';

/** Full Indian-grouped rupee value, e.g. ₹12,34,567 */
export const fINR = (n: number): string => '₹' + Math.round(n).toLocaleString('en-IN');

/** Short rupee value in lakh / crore, e.g. ₹3.8 Cr, ₹50 L */
export const fShort = (n: number): string => {
  n = Math.round(n);
  if (Math.abs(n) >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.00$/, '') + ' Cr';
  if (Math.abs(n) >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.00$/, '') + ' L';
  return '₹' + n.toLocaleString('en-IN');
};

/** Years with localized unit */
export const fYr = (n: number, lang: Lang): string => {
  const v = Math.round(n * 10) / 10;
  const unit = lang === 'hi' ? 'साल' : Math.abs(v) === 1 ? 'year' : 'years';
  return v + ' ' + unit;
};

/** Generic formatter used by result cards */
export const fmt = (v: number, kind: Kind, lang: Lang): string =>
  kind === 'inr'
    ? fShort(v)
    : kind === 'pct'
    ? Math.round(v * 100) / 100 + '%'
    : kind === 'yr'
    ? fYr(v, lang)
    : Math.round(v).toLocaleString('en-IN');

export const PALETTE = {
  brand: '#0f9d6e',
  brandLight: '#d4f5e7',
  indigo: '#4f46e5',
  amber: '#d97706',
  slate: '#94a3b8',
  red: '#dc2626',
};
