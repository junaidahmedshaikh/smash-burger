'use client';

import { Flame, Award, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'FRESH NOT FROZEN',
    description: 'Fresh prime cuts ground daily. Zero frozen meat pucks.',
  },
  {
    icon: Zap,
    title: 'HIGH PROTEIN',
    description: 'Up to 44g of clean protein per double smashed burger.',
  },
  {
    icon: Award,
    title: 'ARTISANAL BUNS',
    description: 'Hokkaido milk brioche toasted with clarified butter.',
  },
  {
    icon: ShieldCheck,
    title: 'HOUSE-MADE SAUCES',
    description: 'Small batch craft emulsions made fresh every sunrise.',
  },
];

export default function ExperienceSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-brand-dark-surface relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            THE SMASH BURGER STANDARD
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight">
            FOOD THAT <span className="text-brand-red">FEELS GOOD</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-brand-dark border border-white/10 hover:border-brand-red/40 transition-all duration-300 group shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red mb-6 group-hover:bg-brand-red group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-cream/70 font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
