'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Flame, Clock, Star, Plus, Filter, Sparkles, Check } from 'lucide-react';
import { IProduct, ICategory } from '@smashd/types';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

// Fallback categories
const FALLBACK_CATEGORIES: ICategory[] = [
  { _id: 'cat_1', name: 'All Cravings', slug: 'all', description: 'Everything on the menu', image: '', sortOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat_2', name: 'Smash Burgers', slug: 'smash-burgers', description: 'Crispy iron-smashed prime patties', image: '', sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat_3', name: 'Crispy Chicken', slug: 'crispy-chicken', description: 'Double-dredged buttermilk fried chicken', image: '', sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat_4', name: 'Plant & Veg', slug: 'plant-and-veg', description: 'Artisan vegetarian & portobello crafts', image: '', sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat_5', name: 'Loaded Sides', slug: 'loaded-fries-and-sides', description: 'Truffle russet fries and dirty sides', image: '', sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat_6', name: 'Handspun Shakes', slug: 'handspun-shakes', description: 'Slow-churned thick gelato shakes', image: '', sortOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export default function MenuPage() {
  const [categories, setCategories] = useState<ICategory[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const openCustomizer = useUIStore((state) => state.openCustomizer);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          ApiClient.getCategories().catch(() => FALLBACK_CATEGORIES),
          ApiClient.getProducts().catch(() => []),
        ]);

        if (cats && cats.length > 0) {
          setCategories([
            { _id: 'all', name: 'All Cravings', slug: 'all', description: '', image: '', sortOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            ...cats,
          ]);
        }
        setProducts(prods);
      } catch (e) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'all') {
      const categorySlug =
        typeof product.category === 'object' && product.category?.slug
          ? product.category.slug
          : typeof product.category === 'string'
          ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          : '';
      if (!categorySlug.includes(selectedCategory) && selectedCategory !== categorySlug) {
        return false;
      }
    }

    if (isVegOnly && !product.isVegetarian) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      const ingMatch = product.ingredients.some((ing) => ing.toLowerCase().includes(q));
      if (!nameMatch && !descMatch && !ingMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            FRESH ON THE IRON GRILL
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-brand-cream uppercase tracking-tight leading-none mb-4">
            OUR GOURMET <span className="text-brand-red">MENU</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/70 font-body">
            Every burger is customized to order with double smashed prime patties, secret house
            sauces, and butter-toasted brioche.
          </p>
        </div>

        <div className="bg-brand-dark-surface p-4 sm:p-6 rounded-3xl border border-white/10 mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-brand-cream/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, ingredients, sauces..."
              className="w-full bg-brand-dark border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-mono font-bold uppercase transition-all ${
                isVegOnly
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                  : 'bg-brand-dark border-white/10 text-brand-cream/70 hover:text-brand-cream'
              }`}
            >
              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${isVegOnly ? 'bg-emerald-400 border-emerald-400' : 'border-white/40'}`}>
                {isVegOnly && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
              </span>
              <span>100% VEG ONLY</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar select-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-3.5 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-red text-brand-cream shadow-brand-glow'
                    : 'bg-brand-dark-surface border border-white/10 text-brand-cream/70 hover:text-brand-cream hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-brand-dark-surface animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-brand-dark-surface rounded-3xl border border-white/10 p-8">
            <h3 className="font-display font-black text-3xl text-brand-cream mb-2">NO CRAVINGS FOUND</h3>
            <p className="text-sm text-brand-cream/60 mb-6">
              Try adjusting your search query or reset the category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setIsVegOnly(false);
              }}
              className="px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="group bg-brand-dark-surface rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-brand-red/40 transition-all duration-300 shadow-2xl"
              >
                <div>
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-brand-dark mb-5 flex items-center justify-center">
                    <Image
                      src={product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                          product.isVegetarian
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-brand-red/90 text-white'
                        }`}
                      >
                        {product.isVegetarian ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-brand-yellow text-xs font-mono font-bold border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.ratingAverage || 4.9}</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-black text-2xl text-brand-cream tracking-tight group-hover:text-brand-red transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-display font-black text-2xl text-brand-yellow whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-cream/70 font-body mb-4 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-6">
                    {product.ingredients?.slice(0, 3).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-body bg-white/5 border border-white/5 text-brand-cream/60 px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => openCustomizer(product)}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    CUSTOMIZE
                  </button>
                  <button
                    onClick={() => {
                      addItem(product);
                      openCartDrawer();
                    }}
                    className="p-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream shadow-brand-glow transition-all active:scale-95"
                    aria-label="Quick Add to Bag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
