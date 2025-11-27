'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { gradeColors } from '@/lib/utils';

interface HealthRingProps {
  score: number;
  grade: string;
  verdict: string;
  isLoading?: boolean;
}

const circleLength = 440;

export function HealthRing({ score, grade, verdict, isLoading }: HealthRingProps) {
  const progress = useSpring(0, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (!isLoading) {
      progress.set(score);
    }
  }, [progress, score, isLoading]);

  const dashOffset = useTransform(progress, (value) => circleLength - (circleLength * value) / 100);
  const tone = gradeColors[grade] ?? 'text-zinc-100';

  // Loading animation
  useEffect(() => {
    if (isLoading) {
      let frame: number;
      let angle = 0;

      const animate = () => {
        angle = (angle + 2) % 100;
        progress.set(angle);
        frame = requestAnimationFrame(animate);
      };

      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, [isLoading, progress]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-56 w-56">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#27272a"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Progress circle with glow */}
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="url(#ringGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circleLength}
            style={{
              strokeDashoffset: dashOffset,
              filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
            }}
            strokeLinecap="round"
            className={isLoading ? 'opacity-60' : ''}
          />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute text-center">
          {isLoading ? (
            <>
              <div className="text-4xl font-semibold text-zinc-400 animate-pulse">--</div>
              <p className="text-sm text-zinc-500 mt-2">Analyzing...</p>
            </>
          ) : (
            <>
              <motion.p
                className="text-6xl font-semibold text-zinc-50"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {score}
              </motion.p>
              <motion.p
                className={`text-xl font-semibold ${tone}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {grade}
              </motion.p>
              <p className="text-xs uppercase tracking-[0.5em] text-zinc-500 mt-1">verdict</p>
              <motion.p
                className="text-sm text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {verdict}
              </motion.p>
            </>
          )}
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-zinc-500">
        {isLoading
          ? 'Collecting browser fingerprints...'
          : 'Score derived from BrowserScan Authority algorithm v1.0'
        }
      </div>
    </div>
  );
}
