'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function CountUp({ target, suffix = '', duration = 2 }: CountUpProps) {
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
      onUpdate: (v) => {
        if (mounted) setDisplay(Math.round(v));
      },
    });
    return () => {
      mounted = false;
      controls.stop();
    };
  }, [isInView, target, duration, motionVal]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString('nl-NL')}
      {suffix}
    </span>
  );
}
