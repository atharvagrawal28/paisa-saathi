import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CALCS } from '@/lib/calculators';
import { C } from '@/lib/content';
import CalcClient from '@/components/CalcClient';

export function generateStaticParams() {
  return CALCS.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const c = C[params.id]?.en;
  if (!c) return { title: 'Calculator — Paisa Saathi' };
  return {
    title: `${c.t} — Paisa Saathi`,
    description: c.what,
  };
}

export default function CalcPage({ params }: { params: { id: string } }) {
  const calc = CALCS.find((c) => c.id === params.id);
  if (!calc) notFound();
  return <CalcClient id={params.id} />;
}
