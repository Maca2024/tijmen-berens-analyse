'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(10, 15, 13, 0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(125, 211, 168, 0.06)',
          }}
        >
          <span className="font-heading text-lg font-bold text-taiga-text tracking-wide">
            TB <span className="text-taiga-muted mx-1">&times;</span> AL
          </span>

          <a
            href="https://cal.com/aetherlink"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-sm px-5 py-2"
          >
            Plan een Gesprek
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
