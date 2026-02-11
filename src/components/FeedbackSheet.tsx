'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ThumbsUp, Snowflake } from 'lucide-react';
import { FeedbackType } from '@/types';
import SuccessAnimation from './SuccessAnimation';

interface FeedbackSheetProps {
  zoneLabel: string;
  zoneId: string;
  cooldownRemaining: number;
  onSubmit: (zoneId: string, feedback: FeedbackType) => boolean;
  onClose: () => void;
}

const feedbackOptions: { type: FeedbackType; label: string; icon: typeof Flame; colors: { bg: string; border: string; text: string; iconColor: string } }[] = [
  {
    type: 'too_hot',
    label: 'Too Hot',
    icon: Flame,
    colors: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-[#EF4337]', iconColor: '#EF4337' },
  },
  {
    type: 'comfort',
    label: 'Comfort',
    icon: ThumbsUp,
    colors: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-[#43A452]', iconColor: '#43A452' },
  },
  {
    type: 'too_cold',
    label: 'Too Cold',
    icon: Snowflake,
    colors: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-[#065BA9]', iconColor: '#065BA9' },
  },
];

export default function FeedbackSheet({
  zoneLabel,
  zoneId,
  cooldownRemaining,
  onSubmit,
  onClose,
}: FeedbackSheetProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selected, setSelected] = useState<FeedbackType | null>(null);

  const hasCooldown = cooldownRemaining > 0;
  const cooldownSec = Math.ceil(cooldownRemaining / 1000);

  const handleSelect = useCallback(
    (type: FeedbackType) => {
      if (hasCooldown) return;
      setSelected(type);
      const success = onSubmit(zoneId, type);
      if (success) {
        setShowSuccess(true);
      }
    },
    [hasCooldown, onSubmit, zoneId]
  );

  const handleSuccessComplete = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white px-4 pb-8 pt-4 shadow-[1px_3px_20px_0px_#9AAACF1A]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#EDEFF9]" />

        {showSuccess ? (
          <SuccessAnimation onComplete={handleSuccessComplete} />
        ) : (
          <>
            <h2 className="mb-1 text-center text-[16px] font-semibold leading-6 text-[#212529]">
              {zoneLabel}
            </h2>
            <p className="mb-5 text-center text-[13px] font-normal leading-[19.5px] text-[#788796]">
              How does this zone feel?
            </p>

            {hasCooldown && (
              <p className="mb-4 text-center text-[12px] font-normal leading-[18px] text-[#788796]">
                You can submit again in {cooldownSec}s
              </p>
            )}

            <div className="flex gap-3">
              {feedbackOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selected === opt.type;
                const isOther = selected !== null && !isSelected;

                return (
                  <button
                    key={opt.type}
                    onClick={() => handleSelect(opt.type)}
                    disabled={hasCooldown}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-2 py-4 transition-all ${
                      opt.colors.bg
                    } ${opt.colors.border} ${
                      hasCooldown
                        ? 'opacity-40 cursor-not-allowed'
                        : isOther
                          ? 'opacity-30'
                          : 'active:scale-95'
                    }`}
                    style={{ minHeight: 80, minWidth: 60 }}
                  >
                    <Icon size={28} color={opt.colors.iconColor} strokeWidth={isSelected ? 2.5 : 2} />
                    <span className={`text-[13px] font-medium ${opt.colors.text}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
