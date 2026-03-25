import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { StructuredData } from './structured-data';
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
  title: 'Website & SEO Analyse | Tijmen Berens Photography',
  description:
    'National Geographic award-winnende fotograaf — ontdek waarom een Tier-1 fotograaf onzichtbaar is online en hoe we dat fixeren. Digitale analyse door AetherLink.',
  openGraph: {
    title: 'Website & SEO Analyse | Tijmen Berens Photography',
    description:
      'National Geographic winnaar. Onzichtbaar online. Ontdek het onbenutte potentieel.',
    type: 'article',
    url: 'https://tijmen-berens-analyse.vercel.app/analyse',
    siteName: 'AetherLink B.V.',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website & SEO Analyse | Tijmen Berens Photography',
    description:
      'National Geographic winnaar. Onzichtbaar online. Ontdek het onbenutte potentieel.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://tijmen-berens-analyse.vercel.app/analyse',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-taiga-bg text-taiga-text antialiased" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
        <StructuredData />
        <a href="#main-content" className="skip-link">
          Ga naar hoofdinhoud
        </a>
        {children}
      </body>
    </html>
  );
}
