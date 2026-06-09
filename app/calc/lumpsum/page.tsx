import type { Metadata } from 'next';
import { C } from '@/lib/content';
import CalcClient from '@/components/CalcClient';

const c = C['lumpsum'].en;

export const metadata: Metadata = {
  title: `${c.t} — Paisa Saathi`,
  description: c.what,
};

export default function Page() {
  return <CalcClient id="lumpsum" />;
}
