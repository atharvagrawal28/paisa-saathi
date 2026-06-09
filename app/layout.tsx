import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Paisa Saathi — Your Family Money Helper | पैसा साथी',
  description:
    'Simple, bilingual personal finance calculators for Indian families. EMI, prepayment, SIP, retirement, SWP and more — explained in plain English and Hindi.',
  keywords: [
    'EMI calculator',
    'SIP calculator',
    'retirement calculator India',
    'prepayment calculator',
    'SWP calculator',
    'Hindi finance calculator',
  ],
  openGraph: {
    title: 'Paisa Saathi — Your Family Money Helper',
    description: 'Bilingual personal finance calculators for Indian families.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-ink-900 antialiased">
        <LanguageProvider>
          <Header />
          <main className="max-w-5xl mx-auto px-4 pb-24 pt-6">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
