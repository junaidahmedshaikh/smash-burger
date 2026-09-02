"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, Award, ShieldCheck, ArrowRight, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            THE OBSESSION & THE CRAFT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight leading-tight mb-4 sm:mb-6">
            BORN FROM <span className="text-brand-red">HEAT & IRON</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/70 font-body leading-relaxed">
            We didn&apos;t set out to make just another burger. We set out to
            eliminate the fluffy, bland mediocrity of fast food and replace it
            with explosive culinary intensity.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-brand-cream uppercase tracking-tight">
              WHY WE SMASH
            </h2>
            <p className="text-sm sm:text-base text-brand-cream/80 font-body leading-relaxed">
              When fresh Angus beef meets a screaming hot 450°F cast iron
              flat-top and gets pressed with immense force, something magical
              occurs: the Maillard reaction. Sugars and amino acids fuse into an
              ultra-crispy, deeply caramelized lace crust that locks all juices
              inside the patty.
            </p>
            <p className="text-sm sm:text-base text-brand-cream/80 font-body leading-relaxed">
              Thick pub burgers lose their crust and get chewy. Our double
              smashed patties maximize surface area contact, delivering maximum
              savory umami in every bite.
            </p>
          </div>

          <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
              alt="Grilling burgers on iron"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* The Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-brand-cream uppercase mb-3">
              1. 100% FRESH ANGUS
            </h3>
            <p className="text-sm text-brand-cream/70 font-body leading-relaxed">
              Ground fresh daily from an 80/20 blend of chuck, brisket, and
              short-rib. Never frozen, no fillers, seasoned only with sea salt
              and cracked black pepper.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-brand-cream uppercase mb-3">
              2. MILK BRIOCHE
            </h3>
            <p className="text-sm text-brand-cream/70 font-body leading-relaxed">
              Custom-baked Hokkaido style buns that hold structural integrity
              without overpowering the beef. Toasted on flat-top with clarified
              French butter.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-brand-cream uppercase mb-3">
              3. SCRATCH SAUCES
            </h3>
            <p className="text-sm text-brand-cream/70 font-body leading-relaxed">
              From our 14-ingredient Umami Smash sauce to roasted black truffle
              aioli, every dip and drizzle is formulated in our test kitchen and
              made from scratch.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-r from-brand-red to-brand-red-dark text-center text-brand-cream shadow-brand-glow">
          <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight mb-3 sm:mb-4">
            READY TO TASTE THE DIFFERENCE?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-cream/90 max-w-xl mx-auto mb-6 sm:mb-8 font-body">
            Experience what real craftsmanship tastes like. Smashed hot to
            order.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-brand-cream text-brand-dark font-display font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all shadow-xl"
          >
            <span>EXPLORE THE MENU</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
