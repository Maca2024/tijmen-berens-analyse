'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

export interface ScoreItem {
  label: string;
  score: number;
  max: number;
  verdict: string;
  color: string;
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function ScoreBar({ item, index }: { item: ScoreItem; index: number }) {
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
  }, [isInView, item.score, item.max, index, springValue]);

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
