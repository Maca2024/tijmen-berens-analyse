import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tijmen-berens-analyse.vercel.app'),
  title: 'Digitale Analyse | Tijmen Berens Photography',
  description:
    'National Geographic award-winnende fotograaf — ontdek waarom een Tier-1 fotograaf onzichtbaar is online. Analyse door AetherLink.',
  openGraph: {
    title: 'Digitale Analyse | Tijmen Berens Photography',
    description: 'National Geographic winnaar. Onzichtbaar online. Het volledige verhaal.',
    type: 'article',
    url: 'https://tijmen-berens-analyse.vercel.app/analyse',
    siteName: 'AetherLink B.V.',
    locale: 'nl_NL',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://tijmen-berens-analyse.vercel.app/analyse' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
