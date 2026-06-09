export type Lang = 'en' | 'hi';
export type Kind = 'inr' | 'pct' | 'yr' | 'num' | 'txt';

export interface InputDef {
  k: string;
  def: number;
  min: number;
  max: number;
  step: number;
  kind: Kind;
}

export interface ResultDef {
  k: string;
  kind: Kind;
  big?: boolean;
}

export interface CalcContent {
  t: string;
  s: string;
  what: string;
  why: string;
  eg: string;
  in: Record<string, { l: string; h?: string }>;
  res: Record<string, string>;
  learn: { q: string; a: string }[];
}

export type Vals = Record<string, number>;
export type CompResult = Record<string, any>;

export interface Calculator {
  id: string;
  cat: 'loan' | 'invest' | 'retire';
  icon: string;
  cta: string;
  special?: boolean;
  goals?: boolean;
  inputs?: InputDef[];
  results?: ResultDef[];
  compute?: (v: Vals) => CompResult;
  /** Returns a Chart.js config (loosely typed). Call setCalcLang() first for localized labels. */
  chart?: (v: Vals, r: CompResult) => any;
  insight?: (v: Vals, r: CompResult, lang: Lang) => string;
}

export interface LoanRow {
  name: string;
  amt: number;
  rate: number;
  emi: number;
}
