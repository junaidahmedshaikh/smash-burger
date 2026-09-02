'use client';

import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Fast kinetic loader (0 to 100 within ~1.2 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 300);
          return 100;
        }
        const step = Math.floor(Math.random() * 18) + 8;
        return Math.min(100, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-between p-8 sm:p-12 text-brand-cream select-none transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
      {/* Top Brand Tag */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-brand-cream">
          <Flame className="w-5 h-5 fill-current animate-pulse" />
        </div>
        <span className="font-display font-black text-lg tracking-wider text-brand-cream">
          SMASH BURGER
        </span>
      </div>

      {/* Center Kinetic Message */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-tight text-brand-cream mb-3">
          SMASHING
          <br />
          <span className="text-stroke-red">THE STANDARD</span>
        </h2>
        <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-brand-yellow uppercase animate-pulse">
          PREPARING YOUR CRAVING...
        </p>
      </div>

      {/* Bottom Counter & Progress Bar */}
      <div className="w-full max-w-md space-y-3">
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="text-brand-cream/60">HEATING GRILL TO 450°F</span>
          <span className="font-bold text-brand-yellow">{progress}%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
