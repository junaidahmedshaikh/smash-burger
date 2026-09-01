'use client';

interface MarqueeProps {
  items?: string[];
  reverse?: boolean;
  className?: string;
}

const defaultItems = [
  'SMASHED PATTIES',
  'TOASTED BRIOCHE',
  'BOLD UMAMI SAUCE',
  'AGED CHEDDAR',
  '100% FRESH INGREDIENTS',
  'MADE TO ORDER',
  'ZERO SHORTCUTS',
];

export default function MarqueeStrip({
  items = defaultItems,
  reverse = false,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`py-4 sm:py-6 overflow-hidden border-y border-white/10 bg-brand-dark-surface select-none ${className}`}
    >
      <div className={`flex whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {Array.from({ length: 3 }).map((_, repeatIndex) => (
          <div key={repeatIndex} className="flex items-center gap-8 mx-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-brand-cream tracking-tight uppercase">
                  {item}
                </span>
                <span className="w-3 h-3 rounded-full bg-brand-red flex-shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
