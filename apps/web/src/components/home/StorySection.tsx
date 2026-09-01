'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StorySection() {
  const pillars = [
    '100% Prime Angus Beef with zero additives or fillers',
    'Cast iron smash at 450°F creating signature crispy lace edges',
    'Custom brioche baked daily with clarified butter',
    'All sauces and pickles crafted from scratch in-house',
  ];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80"
                alt="Chefs grilling smash burgers"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
                  OUR PHILOSOPHY
                </span>
                <p className="font-display font-black text-2xl text-brand-cream uppercase">
                  &ldquo;NEVER FREEZE. NEVER COMPROMISE. SMASH WITH INTENT.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-mono font-bold uppercase tracking-widest">
              THE ART OF THE SMASH
            </div>

            <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-cream uppercase tracking-tight leading-tight">
              BORN ON THE FLAT TOP.
              <span className="block text-brand-yellow">PERFECTED FOR YOU.</span>
            </h2>

            <p className="text-base text-brand-cream/70 font-body leading-relaxed">
              We started with a simple obsession: why do so many burgers hide behind thick, soggy,
              bland meat? We believe in the power of the high-heat smash — locking in juices while
              creating an intense, caramelized Maillard reaction crust.
            </p>

            {/* Core Pillars */}
            <div className="space-y-3 pt-2">
              {pillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-brand-cream/90 font-body">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{pillar}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-sm tracking-wider uppercase transition-colors"
              >
                <span>READ THE FULL STORY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
