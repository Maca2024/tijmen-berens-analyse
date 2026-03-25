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
  title: 'Digitale Analyse | Tijmen Berens Photography',
  description:
    'Uitgebreide digitale analyse van tijmenberens.com — website, SEO, AI-vindbaarheid en groeipotentieel voor een National Geographic winnende fotograaf.',
  openGraph: {
    title: 'Digitale Analyse | Tijmen Berens Photography',
    description:
      'National Geographic winnaar. Onzichtbaar online. Ontdek het onbenutte potentieel.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-taiga-bg text-taiga-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
