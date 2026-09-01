'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Flame, Star, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { IProduct } from '@smashd/types';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await ApiClient.getProducts();
      setProducts(data);
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
            MENU MANAGEMENT
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-cream uppercase tracking-tight">
            PRODUCT CATALOG ({products.length})
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-brand-dark-surface animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden bg-brand-dark mb-4">
                  <Image
                    src={product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-red text-white text-[10px] font-mono font-bold uppercase">
                    {product.isVegetarian ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-black text-xl text-brand-cream leading-tight">
                    {product.name}
                  </h3>
                  <span className="font-mono font-black text-xl text-brand-yellow whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <p className="text-xs text-brand-cream/70 font-body mb-4 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-cream/60">
                <span>Rating: {product.ratingAverage || 4.9} ★</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active in Store
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
