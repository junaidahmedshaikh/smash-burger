'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Award, UtensilsCrossed } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-brand-dark">
      {/* Background Decorative Gradients & Radial Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-brand-red/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-md shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
            <span className="font-mono text-xs text-brand-cream/90 font-bold uppercase tracking-widest">
              NEW: THE TRUFFLE UMAMI MELT IS HERE
            </span>
          </div>
        </div>

        {/* Massive Editorial Headline Grid */}
        <div className="text-center relative">
          <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tighter leading-[0.85] text-brand-cream uppercase select-none">
            <span className="block hover:text-brand-red transition-colors">THE REAL</span>
            <span className="block text-stroke hover:text-stroke-red transition-all">
              SMASH
            </span>
          </h1>

          {/* Centered Burger Hero Composition with Floating Interactive Elements */}
          <div className="relative my-4 sm:-my-12 flex items-center justify-center">
            {/* Floating Badge Left */}
            <div className="hidden lg:flex absolute left-8 top-1/3 z-20 flex-col gap-2 p-4 rounded-2xl bg-brand-dark-surface/90 border border-white/15 backdrop-blur-xl shadow-surface-elevated animate-float">
              <div className="flex items-center gap-2 text-brand-yellow">
                <Flame className="w-4 h-4 fill-current" />
                <span className="font-display font-bold text-xs uppercase tracking-wider">SEAR TEMP</span>
              </div>
              <span className="font-mono font-black text-2xl text-brand-cream">450°F</span>
              <span className="text-[10px] text-brand-cream/60 font-body">Lace-crusted iron smash</span>
            </div>

            {/* Floating Badge Right */}
            <div className="hidden lg:flex absolute right-8 top-1/2 z-20 flex-col gap-2 p-4 rounded-2xl bg-brand-dark-surface/90 border border-white/15 backdrop-blur-xl shadow-surface-elevated animate-float [animation-delay:2s]">
              <div className="flex items-center gap-2 text-emerald-400">
                <Award className="w-4 h-4" />
                <span className="font-display font-bold text-xs uppercase tracking-wider">QUALITY</span>
              </div>
              <span className="font-mono font-black text-2xl text-brand-cream">100% FRESH</span>
              <span className="text-[10px] text-brand-cream/60 font-body">Never frozen prime patties</span>
            </div>

            {/* Central Master Burger Image */}
            <div className="relative w-[320px] sm:w-[460px] md:w-[580px] h-[280px] sm:h-[400px] md:h-[500px] filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=90"
                alt="Signature Smashed Burger"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] tracking-tighter leading-[0.85] text-brand-cream uppercase select-none -mt-4 sm:-mt-8">
            <span className="text-brand-yellow">CRAFTED</span> TO CRAVE
          </h2>
        </div>

        {/* Subtitle & Dual CTA Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto pt-6 border-t border-white/10">
          <p className="text-sm sm:text-base text-brand-cream/70 max-w-md font-body text-center sm:text-left leading-relaxed">
            Ultra-crispy smashed Angus beef, aged Wisconsin cheddar, house-brined pickles, and butter-toasted Hokkaido milk brioche.
          </p>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-base tracking-wider uppercase shadow-brand-glow transition-all active:scale-95 group"
            >
              <span>ORDER NOW</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="flex-1 sm:flex-none flex items-center justify-center px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-brand-cream font-display font-bold text-base tracking-wider uppercase transition-colors"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
