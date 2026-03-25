'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

/* ──────────────────────────────────────────────
   ANIMATION VARIANTS
   ────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ──────────────────────────────────────────────
   SCORE DATA
   ────────────────────────────────────────────── */

interface ScoreItem {
  label: string;
  score: number;
  max: number;
  verdict: string;
  color: string;
}

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

/* ──────────────────────────────────────────────
   REASONS DATA
   ────────────────────────────────────────────── */

interface ReasonItem {
  number: number;
  title: string;
  description: string;
}

const reasons: ReasonItem[] = [
  {
    number: 1,
    title: 'robots.txt blokkeert ALLE AI crawlers',
    description:
      'GPTBot, ClaudeBot, Google-Extended \u2014 allemaal geblokkeerd. Zijn werk is onzichtbaar voor ChatGPT, Perplexity en Google AI.',
  },
  {
    number: 2,
    title: 'Geen meta descriptions op subpagina\u2019s',
    description:
      'Google genereert willekeurige snippets. Potenti\u00eble klanten zien geen overtuigende beschrijving in zoekresultaten.',
  },
  {
    number: 3,
    title: 'Gebroken heading hi\u00ebrarchie',
    description:
      'H4 headings zonder H1-H3. Zoekmachines begrijpen de pagina-structuur niet.',
  },
  {
    number: 4,
    title: '~50 afbeeldingen zonder alt text',
    description:
      'Voor een fotograaf catastrofaal. Google Images \u2014 de grootste bron van verkeer voor fotografen \u2014 kan zijn werk niet indexeren.',
  },
  {
    number: 5,
    title: 'Events-portfolio geeft een 404 error',
    description:
      'Een heel portfolio-onderdeel is stuk. Potenti\u00eble event-opdrachtgevers zien een foutpagina.',
  },
  {
    number: 6,
    title: 'Geen blog = geen SEO-verkeer',
    description:
      '9 pagina\u2019s met ~300 woorden totaal. Concurrenten met blogs ranken op \u2018eventfotograaf Arnhem\u2019 \u2014 Tijmen niet.',
  },
  {
    number: 7,
    title: 'NatGeo-win verstopt als bulletpoint',
    description:
      'Zijn sterkste credential staat als kleine tekst op de about-pagina. Dit zou hero-content moeten zijn.',
  },
  {
    number: 8,
    title: 'Geen services-pagina',
    description:
      'Wat kost een shoot? Welke pakketten bied je aan? Potenti\u00eble klanten moeten raden.',
  },
  {
    number: 9,
    title: 'Geen testimonials of social proof',
    description:
      'Nul reviews, nul client logos, nul aanbevelingen zichtbaar. Ondanks Trouw en NatGeo.',
  },
  {
    number: 10,
    title: 'Instagram outrankt zijn eigen website',
    description:
      'Zoek \u2018Tijmen Berens\u2019 op Google: Instagram staat boven zijn site. Hij bezit zijn eigen merk niet online.',
  },
];

/* ──────────────────────────────────────────────
   SOLUTIONS DATA
   ────────────────────────────────────────────── */

interface SolutionItem {
  title: string;
  description: string;
  color: string;
  icon: string;
}

const solutions: SolutionItem[] = [
  {
    title: 'Website Revolution',
    description:
      'Van Squarespace naar Next.js/Vercel. Edge deployment, <1s laadtijd, GSAP animaties, WebGL signature moment. Van template naar Awwwards-niveau.',
    color: '#7dd3a8',
    icon: '\u26a1',
  },
  {
    title: 'SEO & GEO Explosie',
    description:
      'AI crawlers deblokkeren, structured data, llms.txt, Google Business Profiel, image sitemap. Van 27/100 naar 90+ SEO score.',
    color: '#38bdf8',
    icon: '\ud83d\udd0d',
  },
  {
    title: 'Content Machine',
    description:
      '4 service-pagina\u2019s, 8 project case studies, 12 blog artikelen, awards showcase. Van 9 naar 50+ pagina\u2019s in 90 dagen.',
    color: '#a78bfa',
    icon: '\ud83d\udcdd',
  },
  {
    title: 'Brand & Conversie',
    description:
      'Scherpe positionering, NatGeo badge op homepage, testimonials, booking CTA\u2019s, newsletter. Van museum naar bedrijf.',
    color: '#f59e0b',
    icon: '\ud83c\udfaf',
  },
];

/* ──────────────────────────────────────────────
   BEFORE / AFTER DATA
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   PROJECTION DATA
   ────────────────────────────────────────────── */

interface ProjectionRow {
  metric: string;
  a: [string, string, string];
  b: [string, string, string];
}

const projectionData: ProjectionRow[] = [
  {
    metric: 'Website bezoekers/mnd',
    a: ['50', '40', '30'],
    b: ['3.000', '8.000', '15.000'],
  },
  {
    metric: 'Google ranking',
    a: ['Pagina 5+', 'Pagina 6+', 'Verdwenen'],
    b: ['Top 5 Arnhem', 'Top 3 NL doc foto', '#1 niche'],
  },
  {
    metric: 'Opdrachten/mnd',
    a: ['2', '1-2', '1'],
    b: ['8', '15', '25'],
  },
  {
    metric: 'Jaaromzet',
    a: ['\u20ac24.000', '\u20ac20.000', '\u20ac16.000'],
    b: ['\u20ac60.000', '\u20ac120.000', '\u20ac200.000'],
  },
];

/* ══════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════ */

/* ── ScoreBar ────────────────────────────────── */

function ScoreBar({ item, index }: { item: ScoreItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  const width = useTransform(springValue, (v) => `${v}%`);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      springValue.set((item.score / item.max) * 100);
    }, index * 100);
    return () => clearTimeout(timeout);
  }, [isInView, springValue, item.score, item.max, index]);

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-taiga-text/80">
          {item.label}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: item.color,
              backgroundColor: `${item.color}15`,
              border: `1px solid ${item.color}30`,
            }}
          >
            {item.verdict}
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: item.color }}
          >
            {item.score}/{item.max}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-taiga-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width,
            backgroundColor: item.color,
            boxShadow: `0 0 12px ${item.color}40`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── CountUp ─────────────────────────────────── */

function CountUp({
  target,
  suffix = '',
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 25,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, springValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* ── DotGrid ─────────────────────────────────── */

function DotGrid({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const cols = 25;

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          maxWidth: `${cols * 14}px`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i < active;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: i * 0.003,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  : {}
              }
              className="rounded-sm"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: isActive ? '#7dd3a8' : 'rgba(255,255,255,0.06)',
                boxShadow: isActive ? '0 0 6px rgba(125,211,168,0.4)' : 'none',
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: '#7dd3a8' }}
          />
          <span className="text-taiga-text/70">
            Benut ({active} stuks = {Math.round((active / total) * 100)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          />
          <span className="text-taiga-text/70">
            Onbenut ({total - active} stuks = {Math.round(((total - active) / total) * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── ReasonCard ───────────────────────────────── */

function ReasonCard({ reason }: { reason: ReasonItem }) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass glass-hover rounded-xl p-5 transition-all duration-300"
    >
      <div className="flex gap-4">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: 'rgba(248, 113, 113, 0.1)',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.2)',
          }}
        >
          {reason.number}
        </div>
        <div>
          <h4 className="text-taiga-text font-semibold mb-1.5 leading-tight">
            {reason.title}
          </h4>
          <p className="text-sm text-taiga-text/60 leading-relaxed">
            {reason.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ImpactCard ───────────────────────────────── */

function ImpactCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass rounded-xl p-6 text-center"
    >
      <div
        className="text-3xl md:text-4xl font-bold mb-2 font-heading"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-sm text-taiga-text/60">{label}</div>
    </motion.div>
  );
}

/* ── SolutionCard ─────────────────────────────── */

function SolutionCard({ solution, index }: { solution: SolutionItem; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass glass-hover rounded-xl p-6 transition-all duration-300"
      style={{
        borderColor: `${solution.color}20`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{
            backgroundColor: `${solution.color}10`,
            border: `1px solid ${solution.color}25`,
          }}
        >
          {solution.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: solution.color,
                backgroundColor: `${solution.color}15`,
              }}
            >
              Module {index + 1}
            </span>
          </div>
          <h4
            className="text-lg font-semibold mb-2"
            style={{ color: solution.color }}
          >
            {solution.title}
          </h4>
          <p className="text-sm text-taiga-text/60 leading-relaxed">
            {solution.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── CompareRow ───────────────────────────────── */

function CompareRow({ item }: { item: CompareItem }) {
  return (
    <motion.div
      variants={staggerItem}
      className="grid grid-cols-3 gap-4 py-3 border-b border-taiga-border"
    >
      <div className="text-sm text-taiga-text/70">{item.label}</div>
      <div className="text-sm text-taiga-danger font-semibold text-center">
        {item.before}
      </div>
      <div className="text-sm text-taiga-primary font-semibold text-center">
        {item.after}
      </div>
    </motion.div>
  );
}

/* ── SectionHeading ───────────────────────────── */

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-12 text-center">
      <div className="text-xs tracking-[0.3em] text-taiga-muted uppercase mb-3 font-medium">
        {number}
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-taiga-text mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-taiga-text/50 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */

export default function AnalysePage() {
  return (
    <main className="relative">
      {/* ── Ambient Background ──────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="aurora-pulse absolute"
          style={{
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(125,211,168,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="aurora-pulse absolute"
          style={{
            top: '30%',
            right: '-15%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '3s',
          }}
        />
        <div
          className="aurora-pulse absolute"
          style={{
            bottom: '-10%',
            left: '20%',
            width: '55%',
            height: '55%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '6s',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            variants={fadeIn}
            className="text-xs tracking-[0.4em] text-taiga-muted uppercase mb-6 font-medium"
          >
            AetherLink Intelligence
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-6"
          >
            <span className="gradient-text">DIGITALE ANALYSE</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="mb-4">
            <span className="text-xl md:text-2xl text-taiga-text/80 font-heading font-light">
              Tijmen Berens Photography
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-taiga-text/40 text-lg md:text-xl font-light max-w-2xl mx-auto mb-4"
          >
            Waar sta je nu?
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-12"
          >
            <div className="glass rounded-full px-4 py-1.5 text-xs text-taiga-text/50">
              National Geographic Winner NL 2022
            </div>
            <div className="glass rounded-full px-4 py-1.5 text-xs text-taiga-text/50">
              Documentaire & Event Fotograaf
            </div>
            <div className="glass rounded-full px-4 py-1.5 text-xs text-taiga-text/50">
              Arnhem, Nederland
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="glass rounded-2xl px-8 py-5 inline-block mb-16"
          >
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-taiga-muted">Totaalscore</span>
                <div className="text-2xl font-bold gradient-text-warm mt-0.5">
                  4.0<span className="text-base text-taiga-muted">/10</span>
                </div>
              </div>
              <div className="w-px h-10 bg-taiga-border" />
              <div>
                <span className="text-taiga-muted">Vakmanschap</span>
                <div className="text-2xl font-bold text-taiga-primary mt-0.5">
                  9/10
                </div>
              </div>
              <div className="w-px h-10 bg-taiga-border" />
              <div>
                <span className="text-taiga-muted">Digitaal</span>
                <div className="text-2xl font-bold text-taiga-danger mt-0.5">
                  1.7/10
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <div className="scroll-indicator text-taiga-muted text-2xl">
              &#8595;
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 2: SCORECARD
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="01"
              title="De Score"
              subtitle="Negen dimensies. Een pijnlijk contrast tussen talent en digitale zichtbaarheid."
            />

            <div className="space-y-6">
              {scores.map((item, i) => (
                <ScoreBar key={item.label} item={item} index={i} />
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              className="glass rounded-xl p-6 mt-10 text-center"
            >
              <p className="text-sm text-taiga-text/60 leading-relaxed">
                <span className="text-taiga-primary font-semibold">
                  Het patroon is helder:
                </span>{' '}
                Tijmen scoort <span className="text-taiga-primary font-semibold">9/10</span> op vakmanschap
                maar <span className="text-taiga-danger font-semibold">1.4/10</span> op digitale
                aanwezigheid. Zijn fotografie is wereldklasse. Zijn vindbaarheid is
                onzichtbaar.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 3: BIG NUMBERS
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="02"
              title="De Realiteit"
              subtitle="Drie cijfers die het hele verhaal vertellen."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-6xl md:text-7xl font-heading font-light text-taiga-primary mb-3">
                  <CountUp target={5} />
                </div>
                <div className="text-sm text-taiga-text/50 uppercase tracking-wider mb-2">
                  Awards & Erkenningen
                </div>
                <div className="text-xs text-taiga-text/30">
                  NatGeo, Fotomuseum, 2x Life Framer, Trouw
                </div>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-6xl md:text-7xl font-heading font-light text-taiga-warm mb-3">
                  <CountUp target={9} />
                </div>
                <div className="text-sm text-taiga-text/50 uppercase tracking-wider mb-2">
                  Pagina&rsquo;s op zijn website
                </div>
                <div className="text-xs text-taiga-text/30">
                  Zou 50+ moeten zijn voor een fotograaf van dit niveau
                </div>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-6xl md:text-7xl font-heading font-light text-taiga-danger mb-3">
                  <CountUp target={0} />
                </div>
                <div className="text-sm text-taiga-text/50 uppercase tracking-wider mb-2">
                  Blog artikelen
                </div>
                <div className="text-xs text-taiga-text/30">
                  Nul SEO-verkeer. Nul zoekresultaten. Nul kansen.
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 4: 10 REASONS WHY
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="03"
              title="10 Redenen Waarom"
              subtitle="Concrete technische en strategische tekortkomingen die Tijmen onzichtbaar houden."
            />

            <div className="space-y-4">
              {reasons.map((reason) => (
                <ReasonCard key={reason.number} reason={reason} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 5: CONTENT WASTE
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="04"
              title="Content Verspilling"
              subtitle="Elk groen vierkant is een benut content stuk. De rest? Onbenut potentieel."
            />

            <motion.div variants={fadeUp} className="glass rounded-2xl p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-taiga-text/50 mb-2">
                  4 documentaire projecten &times; 15 beelden &times; 5 content vormen
                  (blog, Instagram, behind the scenes, print shop, case study)
                </p>
                <p className="text-lg">
                  <span className="text-taiga-primary font-semibold">300</span>{' '}
                  <span className="text-taiga-text/40">
                    potenti&#235;le content stukken
                  </span>
                  {' '}&mdash;{' '}
                  <span className="text-taiga-danger font-semibold">
                    slechts 30 benut (10%)
                  </span>
                </p>
              </div>

              <DotGrid total={300} active={30} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 6: FINANCIAL IMPACT
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="05"
              title="Financi&#235;le Impact"
              subtitle="Wat digitale onzichtbaarheid Tijmen daadwerkelijk kost."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImpactCard
                value="1.000-5.000"
                label="Gemiste website bezoekers per maand door SEO = 0"
                color="#38bdf8"
              />
              <ImpactCard
                value="&#8364;500-2.000"
                label="Per gemiste opdracht (event shoot, redactioneel werk)"
                color="#f59e0b"
              />
              <ImpactCard
                value="&#8364;15.000-30.000"
                label="Gemiste jaaromzet door digitale onzichtbaarheid"
                color="#f87171"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 7: SOLUTIONS
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="06"
              title="De Oplossing"
              subtitle="Vier modules die Tijmen van onzichtbaar naar onvermijdelijk brengen."
            />

            <div className="space-y-5">
              {solutions.map((solution, i) => (
                <SolutionCard key={solution.title} solution={solution} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 8: BEFORE / AFTER
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="07"
              title="Voor & Na"
              subtitle="Het verschil na 6 maanden met AetherLink."
            />

            <motion.div variants={fadeUp} className="glass rounded-2xl p-8">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 mb-2 border-b border-taiga-border">
                <div className="text-xs text-taiga-muted uppercase tracking-wider">
                  Metric
                </div>
                <div className="text-xs text-taiga-danger uppercase tracking-wider text-center">
                  Nu
                </div>
                <div className="text-xs text-taiga-primary uppercase tracking-wider text-center">
                  Na 6 Maanden
                </div>
              </div>

              {compareData.map((item) => (
                <CompareRow key={item.label} item={item} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 9: 3-YEAR PROJECTION
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="08"
              title="3-Jaar Projectie"
              subtitle="Twee scenario's. Dezelfde fotograaf. Radicaal verschillende resultaten."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Scenario A */}
              <motion.div variants={staggerItem} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#f87171' }}
                  />
                  <h3 className="text-lg font-semibold text-taiga-danger">
                    Scenario A: Niets Verandert
                  </h3>
                </div>
                <p className="text-xs text-taiga-text/40 mb-4">
                  Dalend &mdash; concurrenten met SEO winnen terrein
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-taiga-border">
                        <th className="text-left py-2 text-taiga-muted text-xs font-normal">
                          Metric
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 1
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 2
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 3
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectionData.map((row) => (
                        <tr
                          key={row.metric}
                          className="border-b border-taiga-border/50"
                        >
                          <td className="py-2.5 text-taiga-text/60 text-xs">
                            {row.metric}
                          </td>
                          {row.a.map((val, i) => (
                            <td
                              key={i}
                              className="py-2.5 text-center text-taiga-danger/80 text-xs font-medium"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Scenario B */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-6"
                style={{ borderColor: 'rgba(125,211,168,0.15)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#7dd3a8' }}
                  />
                  <h3 className="text-lg font-semibold text-taiga-primary">
                    Scenario B: Met AetherLink
                  </h3>
                </div>
                <p className="text-xs text-taiga-text/40 mb-4">
                  Exponenti&#235;le groei dankzij SEO + AI discoverability
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-taiga-border">
                        <th className="text-left py-2 text-taiga-muted text-xs font-normal">
                          Metric
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 1
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 2
                        </th>
                        <th className="text-center py-2 text-taiga-muted text-xs font-normal">
                          Jaar 3
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectionData.map((row) => (
                        <tr
                          key={row.metric}
                          className="border-b border-taiga-border/50"
                        >
                          <td className="py-2.5 text-taiga-text/60 text-xs">
                            {row.metric}
                          </td>
                          {row.b.map((val, i) => (
                            <td
                              key={i}
                              className="py-2.5 text-center text-taiga-primary/90 text-xs font-medium"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Cumulative comparison */}
            <motion.div
              variants={fadeUp}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-center text-lg font-heading text-taiga-text/80 mb-6">
                Cumulatief Verschil over 3 Jaar
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-xs text-taiga-muted uppercase tracking-wider mb-1">
                    Scenario A
                  </div>
                  <div className="text-xl font-bold text-taiga-danger">
                    &euro;60.000
                  </div>
                </div>
                <div>
                  <div className="text-xs text-taiga-muted uppercase tracking-wider mb-1">
                    Scenario B
                  </div>
                  <div className="text-xl font-bold text-taiga-primary">
                    &euro;380.000
                  </div>
                </div>
                <div>
                  <div className="text-xs text-taiga-muted uppercase tracking-wider mb-1">
                    Verschil
                  </div>
                  <div className="text-xl font-bold gradient-text">
                    +&euro;320.000
                  </div>
                </div>
                <div>
                  <div className="text-xs text-taiga-muted uppercase tracking-wider mb-1">
                    ROI Jaar 1
                  </div>
                  <div className="text-xl font-bold text-taiga-warm">127%</div>
                </div>
              </div>
              <div className="text-center mt-6 pt-4 border-t border-taiga-border">
                <p className="text-sm text-taiga-text/40">
                  AetherLink investering:{' '}
                  <span className="text-taiga-text/60 font-semibold">
                    &euro;28.125
                  </span>{' '}
                  &mdash; terugverdiend in{' '}
                  <span className="text-taiga-primary font-semibold">
                    8 maanden
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════
          SECTION 10: CTA
          ═══════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="text-xs tracking-[0.3em] text-taiga-muted uppercase mb-6 font-medium"
            >
              Volgende stap
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6"
            >
              <span className="gradient-text">
                Klaar om gezien te worden?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-taiga-text/50 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Jouw foto&rsquo;s vertellen al verhalen die de wereld moet zien.
              Laten we ervoor zorgen dat de wereld ze ook vindt.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                variants={staggerItem}
                href="https://cal.com/aetherlink"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg, #7dd3a8 0%, #38bdf8 100%)',
                  color: '#0b1410',
                }}
              >
                Plan een Gesprek
                <span className="text-base">&rarr;</span>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href="mailto:info@aetherlink.ai"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm glass glass-hover transition-all duration-300 hover:scale-105 text-taiga-text/80"
              >
                info@aetherlink.ai
              </motion.a>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-20 text-xs text-taiga-muted"
            >
              <p>AetherLink B.V. &mdash; Maart 2026</p>
              <p className="mt-1 text-taiga-muted/50">
                Deze analyse is vertrouwelijk opgesteld voor Tijmen Berens
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
