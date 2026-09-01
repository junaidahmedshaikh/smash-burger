'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Flame, Clock, Star, ArrowUpRight } from 'lucide-react';
import { IProduct } from '@smashd/types';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';

export default function FeaturedBurgers({ products = [] }: { products?: IProduct[] }) {
  const openCustomizer = useUIStore((state) => state.openCustomizer);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const displayProducts = products.length > 0 ? products.slice(0, 4) : [];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-brand-red fill-current" />
              <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest">
                CHEF&apos;S MASTER SELECTION
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-brand-cream uppercase tracking-tight leading-none">
              TOP PICKS
              <span className="block text-stroke-red text-3xl sm:text-5xl md:text-6xl mt-1">
                JUICY • CHEESY • FULLY LOADED
              </span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-display font-bold text-brand-cream hover:text-brand-red uppercase tracking-wider transition-colors pb-2 border-b border-brand-red"
          >
            <span>VIEW FULL MENU</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProducts.map((burger) => (
            <div
              key={burger._id || burger.id}
              className="group relative bg-brand-dark-surface rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/40 transition-all duration-300 shadow-2xl hover:shadow-brand-glow"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-brand-cream/80">
                        {burger.isVegetarian ? 'VEG CRAFT' : 'ANGUS SMASH'}
                      </span>
                      <div className="flex items-center text-brand-yellow text-xs font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        {burger.ratingAverage || 4.9}
                      </div>
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-cream tracking-tight group-hover:text-brand-red transition-colors">
                      {burger.name}
                    </h3>
                  </div>

                  <span className="font-display font-black text-2xl sm:text-3xl text-brand-yellow">
                    {formatPrice(burger.price)}
                  </span>
                </div>

                <p className="text-sm text-brand-cream/70 font-body mb-6 line-clamp-2">
                  {burger.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-8">
                  {burger.ingredients.slice(0, 4).map((ing, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-body bg-white/5 border border-white/5 text-brand-cream/60 px-2.5 py-1 rounded-lg"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-56 sm:h-72 my-2 overflow-hidden rounded-2xl bg-brand-dark flex items-center justify-center">
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={burger.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                    alt={burger.name}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/10 mt-4">
                <button
                  onClick={() => openCustomizer(burger)}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  CUSTOMIZE
                </button>

                <button
                  onClick={() => {
                    addItem(burger);
                    openCartDrawer();
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs uppercase tracking-wider shadow-brand-glow transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
