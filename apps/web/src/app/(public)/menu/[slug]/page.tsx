'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, Clock, Plus, Check, Sparkles, ShieldAlert } from 'lucide-react';
import { IProduct } from '@smashd/types';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openCustomizer = useUIStore((state) => state.openCustomizer);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const prod = await ApiClient.getProductBySlug(slug);
        setProduct(prod);
      } catch (err) {
        // Handle not found
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Flame className="w-10 h-10 text-brand-red animate-pulse" />
          <span className="font-mono text-sm text-brand-yellow">LOADING FLAVOR PROFILE...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-display font-black text-4xl text-brand-cream mb-3">BURGER NOT FOUND</h2>
        <p className="text-sm text-brand-cream/60 mb-6">The requested product could not be located.</p>
        <Link
          href="/menu"
          className="px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase"
        >
          BACK TO MENU
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono text-brand-cream/60 hover:text-brand-cream uppercase mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MENU</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-80 sm:h-[480px] w-full rounded-3xl overflow-hidden bg-brand-dark-surface border border-white/10 shadow-2xl">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-red text-white text-xs font-mono font-bold uppercase shadow-brand-glow">
                  {product.isVegetarian ? '100% VEG CRAFT' : 'SIGNATURE SMASH'}
                </span>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === i ? 'border-brand-red scale-105' : 'border-white/10 opacity-60'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-yellow">
                  {typeof product.category === 'object' ? product.category.name : 'SMASH LAB'}
                </span>
                <div className="flex items-center gap-1 text-brand-yellow font-mono text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.ratingAverage || 4.9}</span>
                  <span className="text-brand-cream/40">({product.ratingCount || 120})</span>
                </div>
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-brand-cream uppercase tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              <span className="font-display font-black text-2xl sm:text-3xl text-brand-yellow block">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="text-sm sm:text-base text-brand-cream/80 font-body leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-brand-dark-surface border border-white/10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-yellow" />
                <div>
                  <span className="text-[10px] font-mono text-brand-cream/50 uppercase block">
                    PREP TIME
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-cream">
                    {product.preparationTimeMinutes || 12} MINS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-brand-red" />
                <div>
                  <span className="text-[10px] font-mono text-brand-cream/50 uppercase block">
                    SPICE HEAT
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-cream">
                    {product.spiceLevel === 0
                      ? 'Mild & Rich'
                      : product.spiceLevel === 1
                      ? 'Classic Kick'
                      : product.spiceLevel === 2
                      ? 'Fiery Ghost'
                      : 'Hot Reaper'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-brand-cream uppercase tracking-wider mb-3">
                CHEF INGREDIENTS
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs font-body bg-white/5 border border-white/10 text-brand-cream/90 px-3 py-1.5 rounded-xl"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.nutritionalInformation && (
              <div className="p-4 rounded-2xl bg-brand-dark-surface border border-white/10">
                <h4 className="font-display font-bold text-xs text-brand-cream/60 uppercase tracking-wider mb-3">
                  NUTRITION FACTS
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-brand-dark p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-brand-cream/50 block">CALORIES</span>
                    <span className="font-mono text-sm font-bold text-brand-cream">
                      {product.nutritionalInformation.calories}
                    </span>
                  </div>
                  <div className="bg-brand-dark p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-brand-cream/50 block">PROTEIN</span>
                    <span className="font-mono text-sm font-bold text-brand-yellow">
                      {product.nutritionalInformation.proteinGrams}g
                    </span>
                  </div>
                  <div className="bg-brand-dark p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-brand-cream/50 block">CARBS</span>
                    <span className="font-mono text-sm font-bold text-brand-cream">
                      {product.nutritionalInformation.carbsGrams}g
                    </span>
                  </div>
                  <div className="bg-brand-dark p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-brand-cream/50 block">FAT</span>
                    <span className="font-mono text-sm font-bold text-brand-cream">
                      {product.nutritionalInformation.fatGrams}g
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => openCustomizer(product)}
                className="flex-1 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-brand-cream font-display font-black text-sm uppercase tracking-wider transition-colors"
              >
                CUSTOMIZE BURGER
              </button>
              <button
                onClick={() => {
                  addItem(product);
                  openCartDrawer();
                }}
                className="flex-1 py-4 px-6 rounded-2xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-sm uppercase tracking-wider shadow-brand-glow transition-all active:scale-98"
              >
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
