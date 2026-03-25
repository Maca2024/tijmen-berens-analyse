'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollTextRevealProps {
  text: string;
  className?: string;
}

export function ScrollTextReveal({ text, className = '' }: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  });

  const words = text.split(' ');

  return (
    <div
      ref={containerRef}
      className={`py-24 md:py-40 px-6 max-w-5xl mx-auto ${className}`}
    >
      <p className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <Word key={`${word}-${i}`} word={word} range={[start, end]} progress={scrollYProgress} />
          );
        })}
      </p>
    </div>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, [
    'rgba(232, 240, 236, 0.15)',
    'rgba(232, 240, 236, 1)',
  ]);

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.3em]"
    >
      {word}
    </motion.span>
  );
}
