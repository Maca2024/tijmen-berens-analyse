'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ─── ANIMATION PRESETS ─── */
const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 1, ease },
  viewport: { once: true, margin: '-80px' as const },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/* ─── COUNTUP HOOK ─── */
function useCountUp(target: number, duration = 2) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

/* ─── SCORE BAR ─── */
function ScoreBar({ label, score, verdict, isGood }: {
  label: string; score: number; verdict: string; isGood: boolean;
}) {
  const color = isGood ? '#d4a857' : '#c73e3e';
  return (
    <motion.div variants={staggerChild} className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm tracking-wide" style={{ color: 'rgba(240,236,226,0.6)' }}>{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{verdict}</span>
          <span className="font-heading text-xl font-bold" style={{ color }}>{score}/10</span>
        </div>
      </div>
      <div className="h-[2px] w-full rounded-full" style={{ background: 'rgba(240,236,226,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${score * 10}%` }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );
}

/* ─── PARALLAX SECTION ─── */
function ParallaxText({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ─── DATA ─── */
const scores = [
  { label: 'Fotografie Kwaliteit', score: 9, verdict: 'Wereldklasse', isGood: true },
  { label: 'Awards & Erkenning', score: 9, verdict: 'Tier 1', isGood: true },
  { label: 'Redactioneel Werk', score: 8, verdict: 'Professioneel', isGood: true },
  { label: 'Website & SEO', score: 2, verdict: 'Kritiek', isGood: false },
  { label: 'Google Vindbaarheid', score: 2, verdict: 'Onzichtbaar', isGood: false },
  { label: 'AI Search (GEO)', score: 1, verdict: 'Geblokkeerd', isGood: false },
  { label: 'Content Strategie', score: 1, verdict: 'Afwezig', isGood: false },
  { label: 'Social Media', score: 3, verdict: 'Minimaal', isGood: false },
  { label: 'Conversie', score: 1, verdict: 'Nul', isGood: false },
];

const findings = [
  { cat: 'Technisch', items: [
    'robots.txt blokkeert alle AI crawlers',
    'Geen meta descriptions',
    'Gebroken heading hiërarchie',
    '~50 afbeeldingen zonder alt text',
    'Events-portfolio geeft 404',
  ]},
  { cat: 'Content', items: [
    'Geen blog = geen organisch verkeer',
    'NatGeo-overwinning verstopt',
    'Geen services-pagina',
  ]},
  { cat: 'Conversie', items: [
    'Geen testimonials of social proof',
    'Instagram outrankt eigen website',
  ]},
];

const solutions = [
  { title: 'Website Revolution', desc: 'Van Squarespace naar Next.js. Edge deployment, sub-seconde laadtijd, Awwwards-niveau design.', color: '#d4a857' },
  { title: 'SEO & GEO Explosie', desc: 'AI crawlers deblokkeren, structured data, Google Business. Van 27 naar 90+ SEO score.', color: '#7a9e87' },
  { title: 'Content Machine', desc: '4 service-pagina\'s, 8 case studies, 12 blogs. Van 9 naar 50+ pagina\'s in 90 dagen.', color: '#a78bfa' },
  { title: 'Brand & Conversie', desc: 'NatGeo badge op homepage, testimonials, booking CTA\'s. Van museum naar bedrijf.', color: '#f0ece2' },
];

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function AnalysePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.95]);

  const visitors = useCountUp(50, 1.5);
  const seoScore = useCountUp(27, 1.5);
  const futureVisitors = useCountUp(15000, 2.5);
  const futureRevenue = useCountUp(380, 2.5);

  return (
    <main>
      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        {/* Ambient light */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute"
            style={{
              top: '-30%', left: '50%', transform: 'translateX(-50%)',
              width: '120%', height: '80%', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(212,168,87,0.06) 0%, transparent 60%)',
              filter: 'blur(100px)',
            }}
          />
        </div>

        <div className="text-center max-w-5xl mx-auto relative">
          {/* Small label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.5, ease }}
            className="text-xs uppercase mb-8"
            style={{ color: '#d4a857' }}
          >
            Digitale Analyse
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
            className="font-heading font-light"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)', letterSpacing: '-0.03em', color: '#f0ece2' }}
          >
            Tijmen Berens
          </motion.h1>

          {/* Subtitle line */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
          >
            <span className="font-heading text-lg sm:text-xl font-light" style={{ color: '#d4a857' }}>
              National Geographic Winnaar
            </span>
            <span className="hidden sm:block w-12 h-[1px]" style={{ background: 'rgba(240,236,226,0.15)' }} />
            <span className="font-heading text-lg sm:text-xl font-light" style={{ color: '#c73e3e' }}>
              Onzichtbaar Online
            </span>
          </motion.div>

          {/* The gap — two numbers */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.3 }}
            className="mt-24 flex items-end justify-center gap-8 sm:gap-20"
          >
            <div className="text-center">
              <div className="font-heading font-bold" style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', lineHeight: 0.85, color: '#d4a857' }}>
                9
              </div>
              <div className="text-[10px] uppercase tracking-[0.35em] mt-3" style={{ color: 'rgba(212,168,87,0.5)' }}>
                vakmanschap
              </div>
            </div>
            <div className="text-center">
              <div className="font-heading font-bold" style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', lineHeight: 0.85, color: '#c73e3e' }}>
                1.7
              </div>
              <div className="text-[10px] uppercase tracking-[0.35em] mt-3" style={{ color: 'rgba(199,62,62,0.5)' }}>
                digitaal
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-24"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto w-[1px] h-12"
              style={{ background: 'linear-gradient(to bottom, rgba(212,168,87,0.4), transparent)' }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATEMENT ── */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ParallaxText>
            <motion.p
              {...reveal}
              className="font-heading font-light leading-[1.3]"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', color: 'rgba(240,236,226,0.4)' }}
            >
              Een fotograaf die de{' '}
              <span style={{ color: '#d4a857' }}>National Geographic</span>{' '}
              heeft gewonnen, zou niet verslagen mogen worden door{' '}
              <span style={{ color: '#c73e3e' }}>zijn eigen website</span>.
            </motion.p>
          </ParallaxText>
        </div>
      </section>

      {/* ── SCORECARD ── */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div {...reveal} className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: '#d4a857' }}>Analyse</p>
            <h2 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#f0ece2' }}>
              Scorekaart
            </h2>
            <p className="mt-4 text-sm" style={{ color: 'rgba(240,236,226,0.35)' }}>
              9 dimensies. 1 onverbiddelijk beeld.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-6"
          >
            {scores.map((s) => (
              <ScoreBar key={s.label} {...s} />
            ))}
          </motion.div>

          {/* Average */}
          <motion.div
            {...reveal}
            className="mt-12 pt-8 text-center"
            style={{ borderTop: '1px solid rgba(240,236,226,0.06)' }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(240,236,226,0.3)' }}>
              Gemiddeld
            </p>
            <span className="font-heading text-4xl font-bold" style={{ color: '#c73e3e' }}>
              4.0<span className="text-xl font-light">/10</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── BIG NUMBERS ── */}
      <section className="py-24 md:py-40 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(199,62,62,0.03), transparent)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...reveal} className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: '#c73e3e' }}>Impact</p>
            <h2 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#f0ece2' }}>
              Wat er op het spel staat
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            <motion.div {...reveal}>
              <span ref={visitors.ref} className="font-heading text-6xl md:text-7xl font-bold" style={{ color: '#c73e3e' }}>
                {visitors.count}
              </span>
              <p className="mt-3 text-sm" style={{ color: 'rgba(240,236,226,0.4)' }}>bezoekers per maand</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: '#c73e3e' }}>voor een NatGeo winnaar</p>
            </motion.div>

            <motion.div {...reveal}>
              <span ref={seoScore.ref} className="font-heading text-6xl md:text-7xl font-bold" style={{ color: '#c73e3e' }}>
                {seoScore.count}<span className="text-3xl">/100</span>
              </span>
              <p className="mt-3 text-sm" style={{ color: 'rgba(240,236,226,0.4)' }}>SEO score</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: 'rgba(240,236,226,0.25)' }}>branche-gemiddelde: 65</p>
            </motion.div>

            <motion.div {...reveal}>
              <span className="font-heading text-6xl md:text-7xl font-bold" style={{ color: '#c73e3e' }}>
                0
              </span>
              <p className="mt-3 text-sm" style={{ color: 'rgba(240,236,226,0.4)' }}>blog artikelen</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: 'rgba(240,236,226,0.25)' }}>geen content = geen verkeer</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DIAGNOSIS ── */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...reveal} className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: '#c73e3e' }}>Diagnose</p>
            <h2 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#f0ece2' }}>
              10 Kritieke Bevindingen
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16"
          >
            {findings.map((group) => (
              <motion.div key={group.cat} variants={staggerChild} className="text-center md:text-left">
                <h3
                  className="font-heading text-lg font-semibold uppercase tracking-[0.15em] mb-8"
                  style={{ color: group.cat === 'Technisch' ? '#c73e3e' : group.cat === 'Content' ? '#d4a857' : '#a78bfa' }}
                >
                  {group.cat}
                </h3>
                <div className="space-y-5">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 justify-center md:justify-start">
                      <span className="font-heading text-sm font-bold mt-0.5 flex-shrink-0" style={{ color: 'rgba(240,236,226,0.15)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: 'rgba(240,236,226,0.55)' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Punchline */}
          <motion.p
            {...reveal}
            className="font-heading text-center mt-24 font-light"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)', color: 'rgba(240,236,226,0.3)' }}
          >
            Tier 1 fotograaf.{' '}
            <span style={{ color: '#c73e3e' }}>Tier 4 website.</span>
          </motion.p>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section className="py-24 md:py-40 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(212,168,87,0.02), transparent)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...reveal} className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: '#d4a857' }}>Oplossing</p>
            <h2 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#f0ece2' }}>
              Het Plan
            </h2>
            <p className="mt-4 text-sm" style={{ color: 'rgba(240,236,226,0.35)' }}>
              Vier pijlers. 90 dagen. Een transformatie.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-1"
          >
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                variants={staggerChild}
                className="group py-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 text-center sm:text-left"
                style={{ borderBottom: i < solutions.length - 1 ? '1px solid rgba(240,236,226,0.04)' : 'none' }}
              >
                <span className="font-heading text-5xl font-bold flex-shrink-0" style={{ color: 'rgba(240,236,226,0.06)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-heading text-xl font-semibold mb-2" style={{ color: sol.color }}>
                    {sol.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,236,226,0.4)' }}>
                    {sol.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VOOR VS NA ── */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...reveal} className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(240,236,226,0.3)' }}>Projectie</p>
            <h2 className="font-heading text-3xl md:text-5xl font-light" style={{ color: '#f0ece2' }}>
              Twee Scenario&apos;s
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg">
            {/* Without */}
            <motion.div
              {...reveal}
              className="p-10 md:p-14 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(199,62,62,0.06) 0%, rgba(8,8,10,0.95) 100%)',
                borderRight: '1px solid rgba(240,236,226,0.03)',
              }}
            >
              <div className="w-full h-[1px] mb-10" style={{ background: 'linear-gradient(90deg, #c73e3e, transparent)' }} />
              <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.25em] mb-12" style={{ color: '#c73e3e' }}>
                Zonder actie
              </h3>
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(199,62,62,0.4)' }}>Bezoekers / maand</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#c73e3e' }}>50 &rarr; 30</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(199,62,62,0.4)' }}>Opdrachten / maand</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#c73e3e' }}>2 &rarr; 1</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(199,62,62,0.4)' }}>Jaaromzet</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#c73e3e' }}>&euro;24K &rarr; &euro;16K</p>
                </div>
              </div>
            </motion.div>

            {/* With AetherLink */}
            <motion.div
              {...reveal}
              className="p-10 md:p-14 text-center"
              style={{
                background: 'linear-gradient(225deg, rgba(212,168,87,0.06) 0%, rgba(8,8,10,0.95) 100%)',
              }}
            >
              <div className="w-full h-[1px] mb-10" style={{ background: 'linear-gradient(270deg, #d4a857, transparent)' }} />
              <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.25em] mb-12" style={{ color: '#d4a857' }}>
                Met AetherLink
              </h3>
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(212,168,87,0.4)' }}>Bezoekers / maand</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#d4a857' }}>
                    50 &rarr; <span ref={futureVisitors.ref}>{futureVisitors.count.toLocaleString('nl-NL')}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(212,168,87,0.4)' }}>Opdrachten / maand</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#d4a857' }}>2 &rarr; 25</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(212,168,87,0.4)' }}>Jaaromzet</p>
                  <p className="font-heading text-3xl font-bold" style={{ color: '#d4a857' }}>
                    &euro;24K &rarr; &euro;<span ref={futureRevenue.ref}>{futureRevenue.count}</span>K
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Big reveal */}
          <motion.div {...reveal} className="text-center mt-20">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(240,236,226,0.2)' }}>
              Verschil over 3 jaar
            </p>
            <div
              className="font-heading font-bold"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #d4a857 0%, #f0ece2 50%, #d4a857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              +&euro;320.000
            </div>
          </motion.div>

          {/* ROI metrics */}
          <motion.div
            {...reveal}
            className="mt-16 flex flex-wrap items-center justify-center gap-12"
          >
            {[
              { label: 'Investering', value: '\u20AC28.125', color: 'rgba(240,236,226,0.6)' },
              { label: 'ROI', value: '127%', color: '#d4a857' },
              { label: 'Terugverdiend in', value: '8 maanden', color: '#7a9e87' },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(240,236,226,0.2)' }}>{m.label}</p>
                <p className="font-heading text-xl font-semibold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-36 md:py-52 px-6 relative">
        {/* Ambient gold glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,168,87,0.04) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div {...reveal}>
            <h2 className="font-heading font-light mb-6" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>
              Klaar om{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #d4a857, #f0ece2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                gezien te worden?
              </span>
            </h2>
            <p className="text-sm mb-12" style={{ color: 'rgba(240,236,226,0.3)' }}>
              Eén gesprek. Geen verplichtingen.
            </p>
          </motion.div>

          <motion.div {...reveal} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com/aetherlink"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm overflow-hidden transition-transform duration-300 hover:scale-105"
              style={{ background: '#d4a857', color: '#08080a' }}
            >
              <span className="relative z-10">Plan een Gesprek</span>
              <span className="relative z-10">&rarr;</span>
              {/* Shimmer */}
              <span
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.3) 55%, transparent 60%)',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
              <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
            </a>

            <a
              href="mailto:info@aetherlink.ai"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105"
              style={{
                color: 'rgba(240,236,226,0.5)',
                border: '1px solid rgba(240,236,226,0.08)',
              }}
            >
              info@aetherlink.ai
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6 text-center" style={{ borderTop: '1px solid rgba(240,236,226,0.04)' }}>
        <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(240,236,226,0.15)' }}>
          AetherLink B.V. &mdash; Maart 2026
        </p>
        <p className="mt-2 text-[10px]" style={{ color: 'rgba(240,236,226,0.08)' }}>
          Vertrouwelijk opgesteld voor Tijmen Berens
        </p>
      </footer>
    </main>
  );
}
