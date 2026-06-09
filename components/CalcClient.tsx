'use client';

import { CALCS } from '@/lib/calculators';
import CalculatorView from './CalculatorView';
import WhichFirst from './WhichFirst';

/**
 * Client wrapper: looks up the calculator by id so that the (non-serializable)
 * compute/chart/insight functions never cross the server→client boundary.
 */
export default function CalcClient({ id }: { id: string }) {
  const calc = CALCS.find((c) => c.id === id);
  if (!calc) return null;
  return calc.special ? <WhichFirst calc={calc} /> : <CalculatorView calc={calc} />;
}
