'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface SuccessAnimationProps {
  onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#43A452"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: 'easeOut' },
            },
          }}
        />
        <motion.path
          d="M20 33 L28 41 L44 25"
          fill="none"
          stroke="#43A452"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.3, delay: 0.3, ease: 'easeOut' },
            },
          }}
        />
      </motion.svg>
      <motion.p
        className="text-[14px] font-semibold text-[#43A452]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        Thank you for your feedback!
      </motion.p>
    </div>
  );
}
