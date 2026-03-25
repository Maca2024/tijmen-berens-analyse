'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DotGridProps {
  total: number;
  active: number;
}

export function DotGrid({ total, active }: DotGridProps) {
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
