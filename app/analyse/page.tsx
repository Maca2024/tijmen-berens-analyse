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
}

const solutions: SolutionItem[] = [
  {
    title: 'Website Revolution',
    description:
      'Van Squarespace naar Next.js/Vercel. Edge deployment, <1s laadtijd, GSAP animaties, WebGL signature moment. Van template naar Awwwards-niveau.',
    color: '#7dd3a8',
  },
  {
    title: 'SEO & GEO Explosie',
    description:
      'AI crawlers deblokkeren, structured data, llms.txt, Google Business Profiel, image sitemap. Van 27/100 naar 90+ SEO score.',
    color: '#38bdf8',
  },
  {
    title: 'Content Machine',
    description:
      '4 service-pagina\u2019s, 8 project case studies, 12 blog artikelen, awards showcase. Van 9 naar 50+ pagina\u2019s in 90 dagen.',
    color: '#a78bfa',
  },
  {
    title: 'Brand & Conversie',
    description:
      'Scherpe positionering, NatGeo badge op homepage, testimonials, booking CTA\u2019s, newsletter. Van museum naar bedrijf.',
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
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
        <span
          className="text-sm font-medium text-taiga-text/80"
          style={{ minWidth: 'clamp(100px, 30vw, 170px)' }}
        >
          {item.label}
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full text-center"
          style={{
            color: item.color,
            backgroundColor: `${item.color}15`,
            border: `1px solid ${item.color}30`,
          }}
        >
          {item.verdict}
        </span>
        <span
          className="font-heading text-lg font-bold tabular-nums ml-auto"
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

  const pct = Math.round((active / total) * 100);
  const unused = total - active;
  const unusedPct = Math.round((unused / total) * 100);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      {/* Dot grid */}
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

      {/* Legend */}
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

    const particleCount = window.innerWidth < 768 ? 60 : 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        hue: Math.random() * 40 + 140, // green-teal range (brand)
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

        // Gentle mouse attraction
        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.008;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Organic drift (Perlin-like)
        p.vx += Math.sin(time * 0.0005 + p.y * 0.005) * 0.003;
        p.vy += Math.cos(time * 0.0005 + p.x * 0.005) * 0.003;

        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Breathing alpha
        p.life += 0.002;
        const alpha = (Math.sin(p.life * Math.PI * 2) * 0.3 + 0.4) * (dist < 250 ? 0.7 : 0.25);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + mouseRef.current.x * 30}, 60%, 55%, ${alpha})`;
        ctx.fill();

        // Connection lines near mouse (O(n²) — indexed, no indexOf)
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

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', handleVisibility);
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
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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
   MAIN PAGE
   ══════════════════════════════════════════════ */

export default function AnalysePage() {
  const avg = Math.round((scores.reduce((s, i) => s + i.score, 0) / scores.length) * 10) / 10;
  const pct = Math.round((avg / 10) * 100);

  /* ── Reason clusters ─────────────────────── */
  const clusterTech = reasons.slice(0, 5);
  const clusterContent = reasons.slice(5, 8);
  const clusterConversie = reasons.slice(8, 10);

  const clusterMeta = [
    {
      id: 'tech',
      label: 'Technische Fouten',
      labelColor: '#f87171',
      bg: 'rgba(248,113,113,0.06)',
      border: 'rgba(248,113,113,0.2)',
      items: clusterTech,
    },
    {
      id: 'content',
      label: 'Content & Strategie',
      labelColor: '#a78bfa',
      bg: 'rgba(167,139,250,0.06)',
      border: 'rgba(167,139,250,0.2)',
      items: clusterContent,
    },
    {
      id: 'conversie',
      label: 'Conversie & Merk',
      labelColor: '#f59e0b',
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.2)',
      items: clusterConversie,
    },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
    <main className="relative" id="main-content">
      {/* ── Nano Bannana: Living Canvas + Magnetic Cursor ── */}
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

      {/* =============================================
          SECTION 1 — HERO (cinematic full-screen)
          ============================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            variants={fadeIn}
            className="text-xs font-semibold uppercase mb-6"
            style={{ letterSpacing: '0.35em', color: '#7dd3a8' }}
          >
            Vertrouwelijk Rapport
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading font-bold mb-6 text-gradient-aurora"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', letterSpacing: '0.03em', lineHeight: 1 }}
          >
            DIGITALE ANALYSE
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="font-heading font-light text-xl md:text-3xl mb-3"
            style={{ color: '#e8f0ec', lineHeight: '0.92' }}
          >
            Tijmen Berens Photography
          </motion.div>

          <motion.p
            variants={fadeIn}
            className="text-sm mt-4 mb-10"
            style={{ color: '#4a6358' }}
          >
            AetherLink B.V. &middot; Maart 2026
          </motion.p>

          {/* Dramatic score panel — two towers */}
          <motion.div
            variants={fadeUp}
            className="glass rounded-2xl px-8 py-8 inline-block mb-10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16">
              {/* Vakmanschap */}
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#4a6358' }}>
                  Vakmanschap
                </div>
                <div
                  className="font-heading font-bold leading-none"
                  style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', color: '#7dd3a8' }}
                >
                  9<span className="text-2xl" style={{ color: '#4a6358' }}>/10</span>
                </div>
                <div className="text-xs mt-2" style={{ color: '#7dd3a8' }}>Wereldklasse fotografie</div>
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-12 sm:w-12 sm:h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.12)', letterSpacing: '0.2em' }}>
                  VS
                </span>
                <div className="w-px h-12 sm:w-12 sm:h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Digitaal */}
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#4a6358' }}>
                  Digitaal
                </div>
                <div
                  className="font-heading font-bold leading-none"
                  style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', color: '#f87171' }}
                >
                  1.7<span className="text-2xl" style={{ color: '#4a6358' }}>/10</span>
                </div>
                <div className="text-xs mt-2" style={{ color: '#f87171' }}>Nagenoeg onzichtbaar</div>
              </div>
            </div>
          </motion.div>

          {/* Three credential pills */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
          >
            {['National Geographic Winner NL 2022', 'Documentaire & Event Fotograaf', 'Arnhem, Nederland'].map((pill) => (
              <div
                key={pill}
                className="glass rounded-full px-4 py-1.5 text-xs font-medium"
                style={{ color: 'rgba(232,240,236,0.5)' }}
              >
                {pill}
              </div>
            ))}
          </motion.div>

          {/* SVG scroll arrow */}
          <motion.div variants={fadeIn} className="flex justify-center">
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
        </motion.div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 2 — THE VERDICT (one powerful statement)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* The dramatic statement */}
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2
                className="font-heading font-bold leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              >
                <span style={{ color: '#7dd3a8' }}>National Geographic winnaar.</span>
                <br />
                <span style={{ color: '#f87171' }}>Onzichtbaar op Google.</span>
              </h2>
            </motion.div>

            {/* Glass card with average + potential bar */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-7 md:p-10 text-center max-w-xl mx-auto">
              <div className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: '#4a6358' }}>
                Digitale Totaalscore
              </div>
              <div className="font-heading font-bold mb-4" style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', color: '#f87171' }}>
                {avg}<span className="text-xl" style={{ color: '#4a6358' }}>/10</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #f87171, #f59e0b)',
                    boxShadow: '0 0 20px rgba(248,113,113,0.3)',
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: '#4a6358' }}>
                <span className="font-semibold" style={{ color: '#f87171' }}>{pct}%</span> van het potentieel benut
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 3 — SCORECARD (inside ONE glass container)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#7dd3a8' }}>
                Scorekaart
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Negen Dimensies
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Het pijnlijke contrast tussen talent en digitale zichtbaarheid.
              </p>
            </motion.div>

            {/* ONE glass container wrapping ALL score bars */}
            <div className="glass rounded-2xl p-7 md:p-10">
              <div className="space-y-5">
                {scores.map((item, i) => (
                  <ScoreBar key={item.label} item={item} index={i} />
                ))}
              </div>

              <div className="section-divider mt-8" />

              <div className="mt-6 flex items-center justify-between">
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
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 4 — THREE NUMBERS (dramatic stacked)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#38bdf8' }}>
                Realiteit
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Drie Cijfers
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Die het hele verhaal vertellen.
              </p>
            </motion.div>

            <div className="space-y-5">
              {/* Awards — green */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 90% 30%, rgba(125,211,168,0.1) 0%, transparent 60%)',
                  }}
                />
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 relative">
                  <div
                    className="font-heading font-bold leading-none"
                    style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: '#7dd3a8' }}
                  >
                    <CountUp target={5} />
                  </div>
                  <div className="text-center md:text-left pb-2">
                    <div className="text-lg font-semibold mb-1" style={{ color: 'rgba(232,240,236,0.8)' }}>
                      Awards &amp; Erkenningen
                    </div>
                    <div className="text-sm" style={{ color: 'rgba(232,240,236,0.35)' }}>
                      NatGeo, Fotomuseum, 2&times; Life Framer, Trouw
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pages — amber */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 90% 30%, rgba(245,158,11,0.1) 0%, transparent 60%)',
                  }}
                />
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 relative">
                  <div
                    className="font-heading font-bold leading-none"
                    style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: '#f59e0b' }}
                  >
                    <CountUp target={9} />
                  </div>
                  <div className="text-center md:text-left pb-2">
                    <div className="text-lg font-semibold mb-1" style={{ color: 'rgba(232,240,236,0.8)' }}>
                      Pagina&rsquo;s op zijn website
                    </div>
                    <div className="text-sm" style={{ color: 'rgba(232,240,236,0.35)' }}>
                      Zou 50+ moeten zijn voor een fotograaf van dit niveau
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Blog — red */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 90% 30%, rgba(248,113,113,0.1) 0%, transparent 60%)',
                  }}
                />
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 relative">
                  <div
                    className="font-heading font-bold leading-none"
                    style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: '#f87171' }}
                  >
                    <CountUp target={0} />
                  </div>
                  <div className="text-center md:text-left pb-2">
                    <div className="text-lg font-semibold mb-1" style={{ color: 'rgba(232,240,236,0.8)' }}>
                      Blog artikelen
                    </div>
                    <div className="text-sm" style={{ color: 'rgba(232,240,236,0.35)' }}>
                      Nul SEO-verkeer. Nul zoekresultaten. Nul kansen.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 5 — DIAGNOSE (3 clustered groups)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#f87171' }}>
                Forensische Diagnose
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                10 Redenen van Onzichtbaarheid
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Gegroepeerd naar type fout &mdash; van technisch tot strategisch.
              </p>
            </motion.div>

            <div className="space-y-6">
              {clusterMeta.map((cluster) => (
                <motion.div
                  key={cluster.id}
                  variants={fadeUp}
                  className="glass rounded-2xl p-7 md:p-9"
                  style={{ borderLeft: `3px solid ${cluster.border}` }}
                >
                  {/* Cluster header */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                      style={{
                        color: cluster.labelColor,
                        backgroundColor: cluster.bg,
                        border: `1px solid ${cluster.border}`,
                      }}
                    >
                      {cluster.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(232,240,236,0.25)' }}>
                      {cluster.items.length} bevindingen
                    </span>
                  </div>

                  {/* Compact reason items */}
                  <div className="space-y-4">
                    {cluster.items.map((reason) => (
                      <div key={reason.number} className="flex gap-4">
                        <div
                          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold mt-0.5"
                          style={{
                            backgroundColor: cluster.bg,
                            color: cluster.labelColor,
                            border: `1px solid ${cluster.border}`,
                          }}
                        >
                          {reason.number}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-taiga-text mb-1 leading-tight">
                            {reason.title}
                          </h3>
                          <p className="text-xs text-taiga-text/50 leading-relaxed">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 6 — CONTENT WASTE (formula + dots)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#a78bfa' }}>
                Content Analyse
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Content Verspilling
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                300 potenti&euml;le content stukken. Slechts 10% benut.
              </p>
            </motion.div>

            {/* Formula card */}
            <motion.div
              variants={fadeUp}
              className="glass rounded-2xl p-7 md:p-10 mb-6 text-center"
            >
              <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#4a6358' }}>
                Beschikbaar content potentieel
              </p>
              <div
                className="font-heading font-light mb-3"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'rgba(232,240,236,0.7)' }}
              >
                4 projecten &times; 15 beelden &times; 5 content vormen
              </div>
              <div
                className="font-heading font-bold"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#a78bfa' }}
              >
                = 300 potentieel
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(232,240,236,0.4)' }}>Je benut er </span>
                <span className="font-bold" style={{ color: '#f87171' }}>30</span>
                <span style={{ color: 'rgba(232,240,236,0.4)' }}> &mdash; dat is slechts </span>
                <span className="font-bold" style={{ color: '#f87171' }}>10%</span>
              </div>
            </motion.div>

            {/* Dot grid */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-8">
              <DotGrid total={300} active={30} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 7 — FINANCIAL IMPACT (3 dramatic cards)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#f59e0b' }}>
                Financi&euml;le Impact
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Wat het Kost
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Concrete gemiste kansen, nu, elke maand.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 — blue */}
              <motion.div
                variants={staggerItem}
                className="glass tilt-card glow-border rounded-2xl p-8 text-center relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.1) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="font-heading font-bold mb-3 relative"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#38bdf8' }}
                >
                  1.000&ndash;5.000
                </div>
                <div className="text-sm font-semibold mb-1 relative" style={{ color: 'rgba(232,240,236,0.7)' }}>
                  Gemiste bezoekers/mnd
                </div>
                <div className="text-xs relative" style={{ color: 'rgba(232,240,236,0.35)' }}>
                  Organisch verkeer door SEO = 0
                </div>
              </motion.div>

              {/* Card 2 — amber */}
              <motion.div
                variants={staggerItem}
                className="glass tilt-card glow-border rounded-2xl p-8 text-center relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.1) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="font-heading font-bold mb-3 relative"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#f59e0b' }}
                >
                  &euro;500&ndash;2.000
                </div>
                <div className="text-sm font-semibold mb-1 relative" style={{ color: 'rgba(232,240,236,0.7)' }}>
                  Per gemiste opdracht
                </div>
                <div className="text-xs relative" style={{ color: 'rgba(232,240,236,0.35)' }}>
                  Event shoot, redactioneel werk
                </div>
              </motion.div>

              {/* Card 3 — red */}
              <motion.div
                variants={staggerItem}
                className="glass tilt-card glow-border rounded-2xl p-8 text-center relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 80% 20%, rgba(248,113,113,0.1) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="font-heading font-bold mb-3 relative"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#f87171' }}
                >
                  &euro;15K&ndash;30K
                </div>
                <div className="text-sm font-semibold mb-1 relative" style={{ color: 'rgba(232,240,236,0.7)' }}>
                  Gemiste jaaromzet
                </div>
                <div className="text-xs relative" style={{ color: 'rgba(232,240,236,0.35)' }}>
                  Door digitale onzichtbaarheid
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 8 — SOLUTIONS (2x2 grid with impact)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#7dd3a8' }}>
                Oplossing
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Het Plan
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Vier modules die Tijmen van onzichtbaar naar onvermijdelijk brengen.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {solutions.map((solution, i) => (
                <motion.div
                  key={solution.title}
                  variants={staggerItem}
                  className="glass glass-hover rounded-2xl p-7 relative overflow-hidden"
                  style={{ borderTop: `2px solid ${solution.color}40` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold font-heading"
                      style={{
                        backgroundColor: `${solution.color}14`,
                        color: solution.color,
                        border: `1px solid ${solution.color}30`,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h4
                      className="text-base font-semibold leading-tight"
                      style={{ color: solution.color }}
                    >
                      {solution.title}
                    </h4>
                  </div>
                  <p className="text-sm text-taiga-text/55 leading-relaxed">
                    {solution.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 9 — BEFORE/AFTER (clean comparison)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#38bdf8' }}>
                Transformatie
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Voor &amp; Na
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Het verschil na 6 maanden met AetherLink.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass rounded-2xl p-7 md:p-10">
              {/* Header row */}
              <div
                className="grid grid-cols-3 gap-4 pb-4 mb-1 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="text-xs text-taiga-muted uppercase tracking-wider">Kanaal</div>
                <div
                  className="text-xs uppercase tracking-wider text-center font-semibold"
                  style={{ color: '#f87171' }}
                >
                  Nu
                </div>
                <div
                  className="text-xs uppercase tracking-wider text-center font-semibold"
                  style={{ color: '#7dd3a8' }}
                >
                  Na 6 maanden
                </div>
              </div>

              {/* Data rows */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={staggerContainer}
              >
                {compareData.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={staggerItem}
                    className="grid grid-cols-3 gap-4 py-3.5 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="text-sm text-taiga-text/65">{item.label}</div>
                    <div
                      className="text-sm font-semibold text-center"
                      style={{ color: '#f87171' }}
                    >
                      {item.before}
                    </div>
                    <div
                      className="text-sm font-semibold text-center"
                      style={{ color: '#7dd3a8' }}
                    >
                      {item.after}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <p className="text-xs text-center mt-5" style={{ color: 'rgba(232,240,236,0.2)' }}>
                Prognose gebaseerd op vergelijkbare trajecten
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 10 — 3-YEAR PROJECTION (the climax)
          ============================================= */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Section header inline */}
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-heading tracking-[0.25em] uppercase text-sm mb-3 font-semibold" style={{ color: '#a78bfa' }}>
                3-Jaar Projectie
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-bold" style={{ color: '#e8f0ec' }}>
                Twee Toekomsten
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: '#4a6358' }}>
                Dezelfde fotograaf. Radicaal verschillende resultaten. Jij kiest.
              </p>
            </motion.div>

            {/* Two scenario panels side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Scenario A — red */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-6"
                style={{ borderLeft: '3px solid rgba(239,68,68,0.6)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(239,68,68,0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.25)',
                    }}
                  >
                    A
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: '#f87171' }}>
                    Niets Verandert
                  </h3>
                </div>
                <p className="text-xs mb-5" style={{ color: 'rgba(232,240,236,0.35)' }}>
                  Dalend &mdash; concurrenten met SEO winnen terrein
                </p>
                <div className="space-y-3">
                  {projectionData.map((row) => (
                    <div key={`a-${row.metric}`} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-xs text-taiga-text/55 font-medium">{row.metric}</span>
                      <div className="flex gap-4">
                        {row.a.map((val, i) => (
                          <span key={i} className="text-xs font-semibold w-12 sm:w-16 text-center" style={{ color: 'rgba(248,113,113,0.75)' }}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J1</span>
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J2</span>
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J3</span>
                </div>
              </motion.div>

              {/* Scenario B — green */}
              <motion.div
                variants={staggerItem}
                className="glass rounded-2xl p-6"
                style={{ borderLeft: '3px solid rgba(125,211,168,0.6)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(125,211,168,0.12)',
                      color: '#7dd3a8',
                      border: '1px solid rgba(125,211,168,0.25)',
                    }}
                  >
                    B
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: '#7dd3a8' }}>
                    Met AetherLink
                  </h3>
                </div>
                <p className="text-xs mb-5" style={{ color: 'rgba(232,240,236,0.35)' }}>
                  Exponenti&euml;le groei dankzij SEO + AI discoverability
                </p>
                <div className="space-y-3">
                  {projectionData.map((row) => (
                    <div key={`b-${row.metric}`} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-xs text-taiga-text/55 font-medium">{row.metric}</span>
                      <div className="flex gap-4">
                        {row.b.map((val, i) => (
                          <span key={i} className="text-xs font-semibold w-12 sm:w-16 text-center" style={{ color: 'rgba(125,211,168,0.9)' }}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J1</span>
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J2</span>
                  <span className="text-[10px] text-taiga-muted w-12 sm:w-16 text-center">J3</span>
                </div>
              </motion.div>
            </div>

            {/* THE BIG REVEAL panel */}
            <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 animate-aurora-pulse pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(125,211,168,0.08) 0%, rgba(56,189,248,0.05) 40%, transparent 70%)',
                }}
              />
              <div className="glass relative rounded-2xl p-8 md:p-12">
                <h3
                  className="text-center font-heading text-lg font-semibold mb-10 uppercase tracking-[0.15em]"
                  style={{ color: 'rgba(232,240,236,0.4)' }}
                >
                  Cumulatief omzetverschil over 3 jaar
                </h3>

                {/* The dramatic comparison */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mb-10">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#4a6358' }}>
                      Scenario A
                    </div>
                    <div
                      className="font-heading font-bold"
                      style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#f87171' }}
                    >
                      &euro;60.000
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 md:hidden" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <span
                      className="text-xs font-bold tracking-[0.3em] my-2"
                      style={{ color: 'rgba(255,255,255,0.15)' }}
                    >
                      VS
                    </span>
                    <div className="w-px h-8 md:hidden" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  </div>

                  <div className="text-center">
                    <div className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#4a6358' }}>
                      Scenario B
                    </div>
                    <div
                      className="font-heading font-bold"
                      style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#7dd3a8' }}
                    >
                      &euro;380.000
                    </div>
                  </div>
                </div>

                {/* HUGE difference number */}
                <div className="text-center mb-10">
                  <div
                    className="font-heading font-bold text-gradient-aurora"
                    style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                  >
                    +&euro;320.000
                  </div>
                  <p className="text-sm mt-2" style={{ color: 'rgba(232,240,236,0.4)' }}>
                    extra omzet met AetherLink
                  </p>
                </div>

                {/* Emotional text */}
                <p
                  className="text-center font-heading text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto"
                  style={{ color: 'rgba(232,240,236,0.5)' }}
                >
                  Dat is het verschil tussen onzichtbaar blijven en een platform worden.
                </p>

                {/* Three metric cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-5 text-center">
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#4a6358' }}>
                      Investering
                    </div>
                    <div className="font-heading text-2xl font-bold" style={{ color: '#e8f0ec' }}>
                      &euro;28.125
                    </div>
                  </div>
                  <div className="glass rounded-xl p-5 text-center">
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#4a6358' }}>
                      Extra Omzet Jaar 1
                    </div>
                    <div className="font-heading text-2xl font-bold" style={{ color: '#7dd3a8' }}>
                      &euro;36.000
                    </div>
                  </div>
                  <div className="glass rounded-xl p-5 text-center">
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#4a6358' }}>
                      ROI
                    </div>
                    <div className="font-heading text-2xl font-bold" style={{ color: '#f59e0b' }}>
                      127%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider mx-auto w-2/3" />

      {/* =============================================
          SECTION 11 — CTA (dramatic close)
          ============================================= */}
      <section className="py-32 md:py-48 px-6 relative overflow-hidden">
        {/* Two ambient glow circles */}
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
            <motion.div
              variants={fadeIn}
              className="text-xs font-semibold uppercase mb-8"
              style={{ letterSpacing: '0.35em', color: '#4a6358' }}
            >
              Volgende stap
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-heading font-bold mb-8"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.05 }}
            >
              <span style={{ color: '#e8f0ec' }}>Klaar om </span>
              <span className="text-gradient-aurora">gezien te worden?</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg max-w-xl mx-auto mb-14 leading-relaxed"
              style={{ color: 'rgba(232,240,236,0.45)' }}
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
              className="mt-24 text-xs"
              style={{ color: '#4a6358' }}
            >
              <p>AetherLink B.V. &mdash; Maart 2026</p>
              <p className="mt-1" style={{ color: 'rgba(74,99,88,0.4)' }}>
                Deze analyse is vertrouwelijk opgesteld voor Tijmen Berens
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
    </LazyMotion>
  );
}
