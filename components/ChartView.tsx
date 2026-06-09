'use client';

import { Chart as ReactChart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  BarController,
  LineController,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  BarController,
  LineController
);

/** Renders a Chart.js config object (as produced by Calculator.chart). */
export default function ChartView({ spec }: { spec: any }) {
  if (!spec) return null;
  const options = { responsive: true, maintainAspectRatio: false, ...(spec.options || {}) };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div style={{ height: 220 }}>
        <ReactChart type={spec.type} data={spec.data} options={options} />
      </div>
    </div>
  );
}
