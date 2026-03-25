'use client';

import { motion } from 'framer-motion';

import { AuroraCanvas } from '../components/AuroraCanvas';
import { ScrollTextReveal } from '../components/ScrollTextReveal';
import { ScoreBar, type ScoreItem } from '../components/ScoreBar';
import { DotGrid } from '../components/DotGrid';
import { CountUp } from '../components/CountUp';
import { Navbar } from '../components/Navbar';

/* ──────────────────────────────────────────────
   ANIMATION CONFIG (Nieuwe Tijd standard)
   ────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  viewport: { once: true, margin: '-60px' as const },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const lineReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.5 + i * 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const scores: ScoreItem[] = [
  { label: 'Fotografie Kwaliteit', score: 9, max: 10, verdict: 'Wereldklasse', color: '#7dd3a8' },
  { label: 'Awards & Erkenning', score: 9, max: 10, verdict: 'Tier 1', color: '#7dd3a8' },
  { label: 'Redactioneel Werk', score: 8, max: 10, verdict: 'Professioneel', color: '#7dd3a8' },
  { label: 'Website (SEO)', score: 2, max: 10, verdict: 'KRITIEK', color: '#f87171' },
  { label: 'Google Vindbaarheid', score: 2, max: 10, verdict: 'Onzichtbaar', color: '#f87171' },
  { label: 'AI Search (GEO)', score: 1, max: 10, verdict: 'Geblokkeerd', color: '#f87171' },
  { label: 'Content Strategie', score: 1, max: 10, verdict: 'Afwezig', color: '#f87171' },
  { label: 'Social Media', score: 3, max: 10, verdict: 'Minimaal', color: '#f59e0b' },
  { label: 'Conversie & Commercie', score: 1, max: 10, verdict: 'Nul', color: '#f87171' },
];

interface DiagnosisItem {
  number: number;
  title: string;
}

const techIssues: DiagnosisItem[] = [
  { number: 1, title: 'robots.txt blokkeert ALLE AI crawlers' },
  { number: 2, title: 'Geen meta descriptions op subpagina\u2019s' },
  { number: 3, title: 'Gebroken heading hi\u00ebrarchie' },
  { number: 4, title: '~50 afbeeldingen zonder alt text' },
  { number: 5, title: 'Events-portfolio geeft een 404 error' },
];

const contentIssues: DiagnosisItem[] = [
  { number: 6, title: 'Geen blog = geen SEO-verkeer' },
  { number: 7, title: 'NatGeo-win verstopt als bulletpoint' },
  { number: 8, title: 'Geen services-pagina' },
];

const conversionIssues: DiagnosisItem[] = [
  { number: 9, title: 'Geen testimonials of social proof' },
  { number: 10, title: 'Instagram outrankt zijn eigen website' },
];

interface SolutionItem {
  title: string;
  description: string;
  color: string;
}

const solutions: SolutionItem[] = [
  {
    title: 'Website Revolution',
    description: 'Van Squarespace naar Next.js. Edge deployment, <1s laadtijd, Awwwards-niveau.',
    color: '#7dd3a8',
  },
  {
    title: 'SEO & GEO Explosie',
    description: 'AI crawlers deblokkeren, structured data, Google Business. Van 27 naar 90+ SEO score.',
    color: '#38bdf8',
  },
  {
    title: 'Content Machine',
    description: '4 service-pagina\u2019s, 8 case studies, 12 blogs. Van 9 naar 50+ pagina\u2019s in 90 dagen.',
    color: '#a78bfa',
  },
  {
    title: 'Brand & Conversie',
    description: 'NatGeo badge op homepage, testimonials, booking CTA\u2019s. Van museum naar bedrijf.',
    color: '#f59e0b',
  },
];

interface CompareItem {
  label: string;
  before: string;
  after: string;
}

const compareData: CompareItem[] = [
  { label: 'Website pagina\u2019s', before: '9', after: '50+' },
  { label: 'Blog artikelen', before: '0', after: '12+' },
  { label: 'Google verkeer/mnd', before: '~50', after: '2.000-5.000' },
  { label: 'SEO Score', before: '27/100', after: '90+' },
  { label: 'GEO Score', before: '8/100', after: '85+' },
  { label: 'Opdrachten/mnd', before: '~2', after: '10-15' },
];

/* ══════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════ */

export default function AnalysePage() {
  const avg = Math.round((scores.reduce((s, i) => s + i.score, 0) / scores.length) * 10) / 10;
  const pct = Math.round((avg / 10) * 100);

  return (
    <main className="relative" id="main-content">
      <Navbar />
      <AuroraCanvas />

      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="animate-aurora-pulse absolute"
          style={{
            top: '-20%', left: '-10%', width: '60%', height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(125,211,168,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="animate-aurora-pulse absolute"
          style={{
            top: '30%', right: '-15%', width: '50%', height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)', animationDelay: '3s',
          }}
        />
        <div
          className="animate-aurora-pulse absolute"
          style={{
            bottom: '-10%', left: '20%', width: '55%', height: '55%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)', animationDelay: '6s',
          }}
        />
      </div>

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              lineHeight: 0.9,
              color: '#e8f0ec',
              letterSpacing: '-0.02em',
            }}
          >
            Tijmen Berens
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            className="font-heading font-light mt-6"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              color: '#7dd3a8',
              letterSpacing: '0.05em',
            }}
          >
            National Geographic Winnaar
          </motion.p>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            className="font-heading font-light"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              color: '#f87171',
              letterSpacing: '0.05em',
            }}
          >
            Onzichtbaar op Google.
          </motion.p>

          {/* Score towers: 9 vs 1.7 */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            className="mt-20 flex items-end justify-center gap-12 sm:gap-24"
          >
            <div className="text-center">
              <div
                className="font-heading font-bold leading-none"
                style={{ fontSize: 'clamp(6rem, 18vw, 13rem)', color: '#7dd3a8' }}
              >
                9
              </div>
              <div
                className="text-xs uppercase tracking-[0.3em] mt-2"
                style={{ color: 'rgba(125,211,168,0.6)' }}
              >
                vakmanschap
              </div>
            </div>
            <div className="text-center">
              <div
                className="font-heading font-bold leading-none"
                style={{ fontSize: 'clamp(6rem, 18vw, 13rem)', color: '#f87171' }}
              >
                1.7
              </div>
              <div
                className="text-xs uppercase tracking-[0.3em] mt-2"
                style={{ color: 'rgba(248,113,113,0.6)' }}
              >
                digitaal
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            className="mt-20 flex justify-center"
          >
            <svg
              className="animate-scroll-down"
              width="24" height="40" viewBox="0 0 24 40"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="1" y="1" width="22" height="38" rx="11" stroke="rgba(74,99,88,0.5)" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="3" fill="rgba(125,211,168,0.6)" />
              <path d="M8 28l4 4 4-4" stroke="rgba(74,99,88,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ── 2. SCROLL TEXT REVEAL ── */}
      <ScrollTextReveal text="National Geographic winnaar. Onzichtbaar op Google. Een Tier-1 fotograaf met een Tier-4 website. Dit is het volledige verhaal." />

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 3. SCORECARD ── */}
      <section className="py-24 md:py-40 px-6 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-primary font-heading text-sm tracking-[0.25em] uppercase mb-3">Analyse</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">Scorekaart</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">9 dimensies. 1 onverbiddelijk beeld.</p>
        </motion.div>

        <div className="glass rounded-2xl p-7 md:p-10">
          <div className="space-y-5">
            {scores.map((item, i) => (
              <ScoreBar key={item.label} item={item} index={i} />
            ))}
          </div>

          <div className="section-divider mt-8" />

          <motion.div
            {...fadeUp}
            className="mt-6 flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-taiga-text/50 uppercase tracking-wider">
              Gemiddeld
            </span>
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold" style={{ color: '#f87171' }}>
                {avg}/10
              </span>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  color: '#f87171',
                  backgroundColor: 'rgba(248,113,113,0.12)',
                  border: '1px solid rgba(248,113,113,0.25)',
                }}
              >
                {pct}%
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 4. BIG NUMBERS ── */}
      <section className="py-24 md:py-40 px-6 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-accent font-heading text-sm tracking-[0.25em] uppercase mb-3">Impact</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">De Cijfers</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">Wat er op het spel staat.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div {...fadeUp} className="glass glass-hover rounded-2xl p-8 text-center glow-primary">
            <div className="font-heading text-5xl md:text-6xl font-bold text-taiga-primary mb-3">
              <CountUp target={50} />
            </div>
            <p className="text-taiga-muted text-sm">bezoekers per maand</p>
            <p className="text-taiga-danger text-xs mt-2 font-semibold">voor een NatGeo winnaar</p>
          </motion.div>

          <motion.div {...fadeUp} className="glass glass-hover rounded-2xl p-8 text-center glow-accent">
            <div className="font-heading text-5xl md:text-6xl font-bold text-taiga-accent mb-3">
              <CountUp target={27} suffix="/100" />
            </div>
            <p className="text-taiga-muted text-sm">SEO score</p>
            <p className="text-taiga-danger text-xs mt-2 font-semibold">branche-gemiddelde: 65</p>
          </motion.div>

          <motion.div {...fadeUp} className="glass glass-hover rounded-2xl p-8 text-center glow-warm">
            <div className="font-heading text-5xl md:text-6xl font-bold text-taiga-warm mb-3">
              <CountUp target={0} />
            </div>
            <p className="text-taiga-muted text-sm">blog artikelen</p>
            <p className="text-taiga-danger text-xs mt-2 font-semibold">content = verkeer = opdrachten</p>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 5. DIAGNOSIS ── */}
      <section className="py-24 md:py-40 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-danger font-heading text-sm tracking-[0.25em] uppercase mb-3">Diagnose</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">10 Kritieke Bevindingen</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">Drie clusters. Eenzelfde conclusie.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Technisch */}
            <motion.div variants={staggerItem} className="glass rounded-2xl p-8">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-8" style={{ color: '#f87171' }}>
                Technisch
              </h3>
              <div className="space-y-4">
                {techIssues.map((r) => (
                  <div key={r.number} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 font-heading font-bold text-lg" style={{ color: 'rgba(248,113,113,0.5)' }}>
                      {String(r.number).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-semibold text-taiga-text/80 leading-tight">
                      {r.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={staggerItem} className="glass rounded-2xl p-8">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-8" style={{ color: '#f59e0b' }}>
                Content
              </h3>
              <div className="space-y-4">
                {contentIssues.map((r) => (
                  <div key={r.number} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 font-heading font-bold text-lg" style={{ color: 'rgba(245,158,11,0.5)' }}>
                      {String(r.number).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-semibold text-taiga-text/80 leading-tight">
                      {r.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Conversie */}
            <motion.div variants={staggerItem} className="glass rounded-2xl p-8">
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-8" style={{ color: '#a78bfa' }}>
                Conversie
              </h3>
              <div className="space-y-4">
                {conversionIssues.map((r) => (
                  <div key={r.number} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 font-heading font-bold text-lg" style={{ color: 'rgba(167,139,250,0.5)' }}>
                      {String(r.number).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-semibold text-taiga-text/80 leading-tight">
                      {r.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          {...fadeUp}
          className="font-heading text-center mt-20"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            color: 'rgba(232,240,236,0.5)',
            fontWeight: 300,
            lineHeight: 1.3,
          }}
        >
          Tier 1 fotograaf. <span style={{ color: '#f87171' }}>Tier 4 website.</span>
        </motion.p>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 6. CONTENT WASTE ── */}
      <section className="py-24 md:py-40 px-6 max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-secondary font-heading text-sm tracking-[0.25em] uppercase mb-3">Verspilling</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">Content Potentieel</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">
            <span style={{ color: '#a78bfa' }}>300</span> mogelijkheden.{' '}
            <span style={{ color: '#7dd3a8' }}>30</span> benut.{' '}
            <span style={{ color: '#f87171' }}>10%.</span>
          </p>
        </motion.div>

        <motion.div {...fadeUp}>
          <DotGrid total={300} active={30} />
        </motion.div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 7. SOLUTIONS ── */}
      <section className="py-24 md:py-40 px-6 max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-primary font-heading text-sm tracking-[0.25em] uppercase mb-3">Oplossing</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">Wat AetherLink Doet</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">Vier pijlers. Een transformatie.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-5"
        >
          {solutions.map((sol) => (
            <motion.div
              key={sol.title}
              variants={staggerItem}
              className="glass glass-hover rounded-2xl p-8 relative overflow-hidden"
              style={{ borderTop: `2px solid ${sol.color}` }}
            >
              <h4 className="font-heading text-lg font-bold mb-3" style={{ color: sol.color }}>
                {sol.title}
              </h4>
              <p className="text-sm text-taiga-text/55 leading-relaxed">
                {sol.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 8. COMPARISON ── */}
      <section className="py-24 md:py-40 px-6 max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-accent font-heading text-sm tracking-[0.25em] uppercase mb-3">Verschil</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">Voor vs Na</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">Dezelfde fotograaf. Een ander verhaal.</p>
        </motion.div>

        <motion.div {...fadeUp} className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 text-center py-4 px-6 border-b border-white/5">
            <span className="text-sm font-semibold text-taiga-muted">Metric</span>
            <span className="text-sm font-semibold" style={{ color: '#f87171' }}>Nu</span>
            <span className="text-sm font-semibold" style={{ color: '#7dd3a8' }}>Na 90 Dagen</span>
          </div>
          {compareData.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 text-center py-4 px-6 border-b border-white/5 last:border-0"
            >
              <span className="text-sm text-taiga-text/70">{row.label}</span>
              <span className="text-sm font-bold" style={{ color: '#f87171' }}>{row.before}</span>
              <span className="text-sm font-bold" style={{ color: '#7dd3a8' }}>{row.after}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 9. PROJECTION ── */}
      <section className="py-24 md:py-40 px-6 max-w-6xl mx-auto relative overflow-hidden">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-taiga-warm font-heading text-sm tracking-[0.25em] uppercase mb-3">Projectie</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-taiga-text">Twee Scenario&apos;s</h2>
          <p className="text-taiga-muted mt-4 text-base md:text-lg">Waar sta je over 3 jaar?</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-20 rounded-2xl overflow-hidden">
            {/* Scenario A: red */}
            <motion.div
              variants={staggerItem}
              className="relative p-10 md:p-14"
              style={{
                background: 'linear-gradient(135deg, rgba(248,113,113,0.08) 0%, rgba(10,15,13,0.95) 100%)',
                borderRight: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #f87171, transparent)' }} />
              <h3 className="font-heading text-lg font-bold uppercase tracking-[0.2em] mb-12" style={{ color: '#f87171' }}>
                Zonder actie
              </h3>
              <div className="space-y-10">
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(248,113,113,0.5)' }}>Bezoekers / maand</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#f87171' }}>50 &rarr; 30</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(248,113,113,0.5)' }}>Opdrachten / maand</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#f87171' }}>2 &rarr; 1</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(248,113,113,0.5)' }}>Jaaromzet</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#f87171' }}>&euro;24K &rarr; &euro;16K</div>
                </div>
              </div>
            </motion.div>

            {/* Scenario B: green */}
            <motion.div
              variants={staggerItem}
              className="relative p-10 md:p-14"
              style={{
                background: 'linear-gradient(225deg, rgba(125,211,168,0.08) 0%, rgba(10,15,13,0.95) 100%)',
              }}
            >
              <div className="absolute top-0 right-0 w-full h-1" style={{ background: 'linear-gradient(270deg, #7dd3a8, transparent)' }} />
              <h3 className="font-heading text-lg font-bold uppercase tracking-[0.2em] mb-12" style={{ color: '#7dd3a8' }}>
                Met AetherLink
              </h3>
              <div className="space-y-10">
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>Bezoekers / maand</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                    50 &rarr; <CountUp target={15000} duration={2.5} />
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>Opdrachten / maand</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                    2 &rarr; <CountUp target={25} duration={2} />
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>Jaaromzet</div>
                  <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                    &euro;<CountUp target={380} suffix="K" duration={2.5} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* THE BIG REVEAL */}
          <motion.div variants={staggerItem} className="text-center">
            <div
              className="font-heading font-bold text-gradient-aurora"
              style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1 }}
            >
              +&euro;320.000
            </div>
            <p className="text-lg mt-4 mb-16" style={{ color: 'rgba(232,240,236,0.4)' }}>
              verschil over 3 jaar
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="glass rounded-xl px-6 py-4 text-center">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>Investering</div>
                <div className="font-heading text-xl font-bold" style={{ color: '#e8f0ec' }}>&euro;28.125</div>
              </div>
              <div className="glass rounded-xl px-6 py-4 text-center">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>ROI</div>
                <div className="font-heading text-xl font-bold" style={{ color: '#f59e0b' }}>127%</div>
              </div>
              <div className="glass rounded-xl px-6 py-4 text-center">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>Terugverdiend in</div>
                <div className="font-heading text-xl font-bold" style={{ color: '#7dd3a8' }}>8 maanden</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ── 10. CTA ── */}
      <section className="py-36 md:py-52 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '5%', left: '-20%', width: '55%', height: '55%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(125,211,168,0.09) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '5%', right: '-20%', width: '50%', height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div {...fadeUp}>
            <h2
              className="font-heading font-bold mb-12"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.05 }}
            >
              <span style={{ color: '#e8f0ec' }}>Klaar om </span>
              <span className="text-gradient-aurora">gezien te worden?</span>
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com/aetherlink"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta inline-flex items-center gap-2 text-sm"
            >
              Plan een Gesprek
              <span className="text-base" aria-hidden="true">&rarr;</span>
            </a>

            <a
              href="mailto:info@aetherlink.ai"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm glass glass-hover transition-all duration-300 hover:scale-105"
              style={{ color: 'rgba(232,240,236,0.75)' }}
            >
              info@aetherlink.ai
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 11. FOOTER ── */}
      <footer className="py-12 px-6 text-center" style={{ borderTop: '1px solid rgba(125, 211, 168, 0.06)' }}>
        <p className="text-xs" style={{ color: '#4a6358' }}>
          AetherLink B.V. &mdash; Maart 2026
        </p>
        <p className="mt-1 text-xs" style={{ color: 'rgba(74,99,88,0.4)' }}>
          Vertrouwelijk opgesteld voor Tijmen Berens
        </p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <a href="https://aetherlink.ai" target="_blank" rel="noopener noreferrer" className="text-xs text-taiga-muted hover:text-taiga-primary transition-colors">
            aetherlink.ai
          </a>
          <a href="mailto:info@aetherlink.ai" className="text-xs text-taiga-muted hover:text-taiga-primary transition-colors">
            info@aetherlink.ai
          </a>
        </div>
      </footer>
    </main>
  );
}
