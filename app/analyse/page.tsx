'use client';

import { useEffect, useRef, useState } from 'react';
import {
  m as motion,
  LazyMotion,
  domAnimation,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
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

/* Cinematic line-by-line reveal for the hero */
const lineReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.5 + i * 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* Slide in from left for score bars */
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
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
      'GPTBot, ClaudeBot, Google-Extended \u2014 allemaal geblokkeerd.',
  },
  {
    number: 2,
    title: 'Geen meta descriptions op subpagina\u2019s',
    description:
      'Google genereert willekeurige snippets.',
  },
  {
    number: 3,
    title: 'Gebroken heading hi\u00ebrarchie',
    description:
      'H4 headings zonder H1-H3.',
  },
  {
    number: 4,
    title: '~50 afbeeldingen zonder alt text',
    description:
      'Google Images kan zijn werk niet indexeren.',
  },
  {
    number: 5,
    title: 'Events-portfolio geeft een 404 error',
    description:
      'Een heel portfolio-onderdeel is stuk.',
  },
  {
    number: 6,
    title: 'Geen blog = geen SEO-verkeer',
    description:
      '9 pagina\u2019s met ~300 woorden totaal.',
  },
  {
    number: 7,
    title: 'NatGeo-win verstopt als bulletpoint',
    description:
      'Zijn sterkste credential staat als kleine tekst op de about-pagina.',
  },
  {
    number: 8,
    title: 'Geen services-pagina',
    description:
      'Potenti\u00eble klanten moeten raden.',
  },
  {
    number: 9,
    title: 'Geen testimonials of social proof',
    description:
      'Nul reviews, nul client logos, nul aanbevelingen zichtbaar.',
  },
  {
    number: 10,
    title: 'Instagram outrankt zijn eigen website',
    description:
      'Hij bezit zijn eigen merk niet online.',
  },
];

/* ──────────────────────────────────────────────
   SOLUTIONS DATA
   ────────────────────────────────────────────── */

interface SolutionItem {
  title: string;
  description: string;
  color: string;
}

const solutions: SolutionItem[] = [
  {
    title: 'Website Revolution',
    description:
      'Van Squarespace naar Next.js. Edge deployment, <1s laadtijd, Awwwards-niveau.',
    color: '#7dd3a8',
  },
  {
    title: 'SEO & GEO Explosie',
    description:
      'AI crawlers deblokkeren, structured data, Google Business. Van 27 naar 90+ SEO score.',
    color: '#38bdf8',
  },
  {
    title: 'Content Machine',
    description:
      '4 service-pagina\u2019s, 8 case studies, 12 blogs. Van 9 naar 50+ pagina\u2019s in 90 dagen.',
    color: '#a78bfa',
  },
  {
    title: 'Brand & Conversie',
    description:
      'NatGeo badge op homepage, testimonials, booking CTA\u2019s. Van museum naar bedrijf.',
    color: '#f59e0b',
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
    metric: 'Bezoekers/mnd',
    a: ['50', '40', '30'],
    b: ['3.000', '8.000', '15.000'],
  },
  {
    metric: 'Google ranking',
    a: ['Pagina 5+', 'Pagina 6+', 'Verdwenen'],
    b: ['Top 5 Arnhem', 'Top 3 NL', '#1 niche'],
  },
  {
    metric: 'Opdrachten/mnd',
    a: ['2', '1-2', '1'],
    b: ['8', '15', '25'],
  },
  {
    metric: 'Jaaromzet',
    a: ['\u20ac24K', '\u20ac20K', '\u20ac16K'],
    b: ['\u20ac60K', '\u20ac120K', '\u20ac200K'],
  },
];

/* ══════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════ */

/* ── ScoreBar ────────────────────────────────── */

function ScoreBar({ item, index }: { item: ScoreItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const springValue = useSpring(0, { stiffness: 60, damping: 18 });
  const width = useTransform(springValue, (v) => `${v}%`);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      springValue.set((item.score / item.max) * 100);
    }, index * 100);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, item.score, item.max, index]);

  const glow = `${item.color}66`;

  return (
    <motion.div
      ref={ref}
      role="meter"
      aria-label={item.label}
      aria-valuenow={item.score}
      aria-valuemin={0}
      aria-valuemax={item.max}
      aria-valuetext={`${item.score} van ${item.max}, ${item.verdict}`}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={slideFromLeft}
      className="group"
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-sm font-medium text-taiga-text/80"
          style={{ minWidth: '170px' }}
        >
          {item.label}
        </span>
        <span
          className="flex-1 text-xs font-semibold px-2 py-0.5 rounded-full text-center"
          style={{
            color: item.color,
            backgroundColor: `${item.color}15`,
            border: `1px solid ${item.color}30`,
          }}
        >
          {item.verdict}
        </span>
        <span
          className="font-heading text-lg font-bold tabular-nums"
          style={{ color: item.color }}
        >
          {item.score}/{item.max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width,
            background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
            boxShadow: `0 0 12px ${glow}`,
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
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let mounted = true;
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (mounted) setDisplay(Math.round(v)); },
    });
    return () => { mounted = false; controls.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString('nl-NL')}
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

  const pct = Math.round((active / total) * 100);
  const unused = total - active;
  const unusedPct = Math.round((unused / total) * 100);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div
        className="flex flex-wrap gap-[3px] justify-center"
        style={{ maxWidth: '440px' }}
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
                        delay: i * 0.0012,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  : {}
              }
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isActive ? '#7dd3a8' : 'rgba(255,255,255,0.06)',
                boxShadow: isActive ? '0 0 6px rgba(125,211,168,0.4)' : 'none',
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span style={{ color: '#7dd3a8', fontSize: '16px' }}>&#9679;</span>
          <span className="text-taiga-text/70">
            Benut ({active} = {pct}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '16px' }}>&#9679;</span>
          <span className="text-taiga-text/70">
            Onbenut ({unused} = {unusedPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NANO BANNANA — LIVING CANVAS (mouse-reactive particle field)
   ══════════════════════════════════════════════ */

function LivingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; hue: number; life: number;
    }> = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        hue: Math.random() * 40 + 140,
        life: Math.random(),
      });
    }

    const draw = (time: number) => {
      ctx.fillStyle = 'rgba(11, 20, 16, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x * canvas.width;
      const my = mouseRef.current.y * canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.008;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.vx += Math.sin(time * 0.0005 + p.y * 0.005) * 0.003;
        p.vy += Math.cos(time * 0.0005 + p.x * 0.005) * 0.003;

        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        p.life += 0.002;
        const alpha = (Math.sin(p.life * Math.PI * 2) * 0.3 + 0.4) * (dist < 250 ? 0.7 : 0.25);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + mouseRef.current.x * 30}, 60%, 55%, ${alpha})`;
        ctx.fill();

        if (dist < 180) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const d2 = Math.hypot(p.x - q.x, p.y - q.y);
            if (d2 < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `hsla(${p.hue}, 40%, 50%, ${0.06 * (1 - d2 / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ══════════════════════════════════════════════
   NANO BANNANA — MAGNETIC CURSOR
   ══════════════════════════════════════════════ */

function MagneticCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });
  const [hoverType, setHoverType] = useState<'default' | 'link' | 'glass'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-magnetic]')) {
        setHoverType('link');
      } else if (t.closest('.glass')) {
        setHoverType('glass');
      } else {
        setHoverType('default');
      }
    };

    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const sizes = { default: 16, link: 48, glass: 28 };

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: sizes[hoverType],
          height: sizes[hoverType],
          opacity: hoverType === 'link' ? 0.9 : 0.6,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE — THE EXPOSURE
   ══════════════════════════════════════════════ */

export default function AnalysePage() {
  const avg = Math.round((scores.reduce((s, i) => s + i.score, 0) / scores.length) * 10) / 10;
  const pct = Math.round((avg / 10) * 100);

  const clusterTech = reasons.slice(0, 5);
  const clusterContent = reasons.slice(5, 8);
  const clusterConversie = reasons.slice(8, 10);

  /* Use projection data for the split-screen future section */
  const scenarioA = projectionData;
  const metricsCount = compareData.length;

  return (
    <LazyMotion features={domAnimation} strict>
    <main className="relative" id="main-content">
      <LivingCanvas />
      <MagneticCursor />

      {/* ── Ambient Background ── */}
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

      {/* ==============================================
          MOMENT 1 — THE OPENING
          ============================================== */}
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

          {/* The two towers: 9 vs 1.7 */}
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

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 2 — THE SCORE
          ============================================== */}
      <section className="py-28 md:py-40 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p
              className="font-heading tracking-[0.3em] uppercase text-sm mb-16 font-semibold"
              style={{ color: '#7dd3a8' }}
            >
              Scorekaart
            </p>
          </motion.div>

          <div className="glass rounded-2xl p-7 md:p-10">
            <div className="space-y-5">
              {scores.map((item, i) => (
                <ScoreBar key={item.label} item={item} index={i} />
              ))}
            </div>

            <div className="section-divider mt-8" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
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
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 3 — THE DIAGNOSIS
          ============================================== */}
      <section className="py-28 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Technisch */}
              <motion.div variants={staggerItem}>
                <h3
                  className="font-heading text-xl md:text-2xl font-bold mb-8"
                  style={{ color: '#f87171' }}
                >
                  Technisch
                </h3>
                <div className="space-y-4">
                  {clusterTech.map((r) => (
                    <div key={r.number} className="flex gap-3 items-start">
                      <span
                        className="flex-shrink-0 font-heading font-bold text-lg"
                        style={{ color: 'rgba(248,113,113,0.5)' }}
                      >
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
              <motion.div variants={staggerItem}>
                <h3
                  className="font-heading text-xl md:text-2xl font-bold mb-8"
                  style={{ color: '#f59e0b' }}
                >
                  Content
                </h3>
                <div className="space-y-4">
                  {clusterContent.map((r) => (
                    <div key={r.number} className="flex gap-3 items-start">
                      <span
                        className="flex-shrink-0 font-heading font-bold text-lg"
                        style={{ color: 'rgba(245,158,11,0.5)' }}
                      >
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
              <motion.div variants={staggerItem}>
                <h3
                  className="font-heading text-xl md:text-2xl font-bold mb-8"
                  style={{ color: '#a78bfa' }}
                >
                  Conversie
                </h3>
                <div className="space-y-4">
                  {clusterConversie.map((r) => (
                    <div key={r.number} className="flex gap-3 items-start">
                      <span
                        className="flex-shrink-0 font-heading font-bold text-lg"
                        style={{ color: 'rgba(167,139,250,0.5)' }}
                      >
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

            <motion.p
              variants={fadeUp}
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
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 4 — THE WASTE
          ============================================== */}
      <section className="py-28 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p
                className="font-heading font-bold"
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                  color: 'rgba(232,240,236,0.7)',
                }}
              >
                <span style={{ color: '#a78bfa' }}>300</span> mogelijkheden.{' '}
                <span style={{ color: '#7dd3a8' }}>30</span> benut.{' '}
                <span style={{ color: '#f87171' }}>10%.</span>
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <DotGrid total={300} active={30} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 5 — THE SOLUTION
          ============================================== */}
      <section className="py-28 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl md:text-5xl font-bold mb-16"
              style={{ color: '#e8f0ec' }}
            >
              Wat AetherLink Doet
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-5">
              {solutions.map((sol) => (
                <motion.div
                  key={sol.title}
                  variants={staggerItem}
                  className="glass glass-hover rounded-2xl p-8 relative overflow-hidden"
                  style={{ borderTop: `2px solid ${sol.color}` }}
                >
                  <h4
                    className="font-heading text-lg font-bold mb-3"
                    style={{ color: sol.color }}
                  >
                    {sol.title}
                  </h4>
                  <p className="text-sm text-taiga-text/55 leading-relaxed">
                    {sol.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 6 — THE FUTURE
          ============================================== */}
      <section className="py-28 md:py-40 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Split screen */}
            {metricsCount > 0 && (
              <span className="sr-only">{metricsCount} metrics geanalyseerd</span>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-20 rounded-2xl overflow-hidden">
              {/* LEFT: red */}
              <motion.div
                variants={staggerItem}
                className="relative p-10 md:p-14"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,113,113,0.08) 0%, rgba(11,20,16,0.95) 100%)',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ background: 'linear-gradient(90deg, #f87171, transparent)' }}
                />
                <h3
                  className="font-heading text-lg font-bold uppercase tracking-[0.2em] mb-12"
                  style={{ color: '#f87171' }}
                >
                  Zonder actie
                </h3>
                <div className="space-y-10">
                  {scenarioA.filter((_, idx) => idx !== 1).map((row) => (
                    <div key={`a-${row.metric}`}>
                      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(248,113,113,0.5)' }}>
                        {row.metric}
                      </div>
                      <div className="font-heading font-bold text-4xl" style={{ color: '#f87171' }}>
                        {row.a[0]} &rarr; {row.a[2]}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT: green */}
              <motion.div
                variants={staggerItem}
                className="relative p-10 md:p-14"
                style={{
                  background: 'linear-gradient(225deg, rgba(125,211,168,0.08) 0%, rgba(11,20,16,0.95) 100%)',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-full h-1"
                  style={{ background: 'linear-gradient(270deg, #7dd3a8, transparent)' }}
                />
                <h3
                  className="font-heading text-lg font-bold uppercase tracking-[0.2em] mb-12"
                  style={{ color: '#7dd3a8' }}
                >
                  Met AetherLink
                </h3>
                <div className="space-y-10">
                  <div>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>
                      Bezoekers / maand
                    </div>
                    <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                      50 &rarr; <CountUp target={15000} duration={2.5} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>
                      Opdrachten / maand
                    </div>
                    <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                      2 &rarr; <CountUp target={25} duration={2} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(125,211,168,0.5)' }}>
                      Jaaromzet
                    </div>
                    <div className="font-heading font-bold text-4xl" style={{ color: '#7dd3a8' }}>
                      &euro;<CountUp target={380} suffix="K" duration={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* THE BIG REVEAL */}
            <motion.div variants={fadeUp} className="text-center">
              <div
                className="font-heading font-bold text-gradient-aurora"
                style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1 }}
              >
                +&euro;320.000
              </div>
              <p
                className="text-lg mt-4 mb-16"
                style={{ color: 'rgba(232,240,236,0.4)' }}
              >
                verschil over 3 jaar
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>
                    Investering
                  </div>
                  <div className="font-heading text-xl font-bold" style={{ color: '#e8f0ec' }}>
                    &euro;28.125
                  </div>
                </div>
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>
                    ROI
                  </div>
                  <div className="font-heading text-xl font-bold" style={{ color: '#f59e0b' }}>
                    127%
                  </div>
                </div>
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4a6358' }}>
                    Terugverdiend in
                  </div>
                  <div className="font-heading text-xl font-bold" style={{ color: '#7dd3a8' }}>
                    8 maanden
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* ==============================================
          MOMENT 7 — THE CLOSE
          ============================================== */}
      <section className="py-36 md:py-52 px-6 relative overflow-hidden">
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading font-bold mb-12"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.05 }}
            >
              <span style={{ color: '#e8f0ec' }}>Klaar om </span>
              <span className="text-gradient-aurora">gezien te worden?</span>
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                variants={staggerItem}
                href="https://cal.com/aetherlink"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #7dd3a8 0%, #38bdf8 100%)',
                  color: '#0b1410',
                  boxShadow: '0 0 40px rgba(125,211,168,0.2)',
                }}
              >
                Plan een Gesprek
                <span className="text-base" aria-hidden="true">&rarr;</span>
              </motion.a>

              <motion.a
                variants={staggerItem}
                href="mailto:info@aetherlink.ai"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm glass glass-hover transition-all duration-300 hover:scale-105"
                style={{ color: 'rgba(232,240,236,0.75)' }}
              >
                info@aetherlink.ai
              </motion.a>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-28 text-xs"
              style={{ color: '#4a6358' }}
            >
              <p>AetherLink B.V. &mdash; Maart 2026</p>
              <p className="mt-1" style={{ color: 'rgba(74,99,88,0.4)' }}>
                Vertrouwelijk opgesteld voor Tijmen Berens
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
    </LazyMotion>
  );
}
