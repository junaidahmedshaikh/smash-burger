'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Plus,
  Minus,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Layers,
  Activity,
  Award,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { formatPrice } from '@/lib/utils';
import { IProduct, ISelectedCustomization } from '@smashd/types';
import confetti from 'canvas-confetti';

interface CustomOption {
  id: string;
  name: string;
  priceDelta: number;
  caloriesDelta: number;
  description: string;
  isDefault?: boolean;
}

interface CustomGroup {
  id: string;
  name: string;
  code: string;
  minSelect: number;
  maxSelect: number;
  options: CustomOption[];
}

const CUSTOMIZATION_MATRIX: CustomGroup[] = [
  {
    id: 'buns',
    name: 'Artisan Bun & Crown',
    code: 'SPEC // 01',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'bun-brioche', name: 'Toasted Hokkaido Milk Brioche', priceDelta: 0, caloriesDelta: 180, description: 'Baked fresh daily with grass-fed butter & sesame seeds', isDefault: true },
      { id: 'bun-pretzel', name: 'Artisan Toasted Pretzel Bun', priceDelta: 30, caloriesDelta: 210, description: 'Dense, chewy with coarse sea salt crystals' },
      { id: 'bun-gf', name: 'Gluten-Free Seeded Brioche', priceDelta: 45, caloriesDelta: 160, description: 'Soft crumb with flaxseed & toasted sesame' },
      { id: 'bun-lettuce', name: 'Fresh Butterhead Lettuce Wrap', priceDelta: 0, caloriesDelta: 25, description: 'Zero carb crispy hydroponic wrap' },
    ],
  },
  {
    id: 'patties',
    name: '450°F Iron Smashed Patties',
    code: 'SPEC // 02',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'patty-double', name: 'Double Prime Angus Smash (Default)', priceDelta: 0, caloriesDelta: 380, description: 'Two 450°F cast-iron lace-crusted patties', isDefault: true },
      { id: 'patty-single', name: 'Single Prime Angus Smash', priceDelta: -70, caloriesDelta: 190, description: 'One crispy lacy seared patty' },
      { id: 'patty-triple', name: 'Triple Monster Angus Smash', priceDelta: 120, caloriesDelta: 570, description: 'Three massive lacy smashed patties' },
      { id: 'patty-chicken', name: 'Crispy Buttermilk Chicken Breast', priceDelta: 20, caloriesDelta: 320, description: 'Double-dredged golden fried chicken' },
      { id: 'patty-portobello', name: 'Charred Portobello Mushroom Cap', priceDelta: 10, caloriesDelta: 110, description: 'Garlic-herb marinated roasted mushroom' },
    ],
  },
  {
    id: 'cheese',
    name: 'Molten Cheese Selection',
    code: 'SPEC // 03',
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: 'cheese-wisconsin', name: 'Aged Wisconsin Smoked Cheddar', priceDelta: 0, caloriesDelta: 140, description: 'Sharp 18-month aged cheddar with velvety steam melt', isDefault: true },
      { id: 'cheese-swiss', name: 'Melted Swiss Gruyère (+₹35)', priceDelta: 35, caloriesDelta: 150, description: 'Nutty, rich alpine melt under cloche' },
      { id: 'cheese-pepperjack', name: 'Spicy Monterey Pepper Jack (+₹30)', priceDelta: 30, caloriesDelta: 140, description: 'Infused with roasted jalapeños & habanero' },
      { id: 'cheese-double', name: 'Double Cheese Stack (+₹60)', priceDelta: 60, caloriesDelta: 280, description: 'Dual layers of Wisconsin cheddar & Swiss' },
      { id: 'cheese-none', name: 'No Cheese', priceDelta: 0, caloriesDelta: 0, description: 'Pure burger flavor without cheese' },
    ],
  },
  {
    id: 'veggies',
    name: 'Farm Fresh Crunch & Pickles',
    code: 'SPEC // 04',
    minSelect: 0,
    maxSelect: 4,
    options: [
      { id: 'veg-pickles', name: 'House-Brined Dill Pickles', priceDelta: 0, caloriesDelta: 10, description: 'Crinkle-cut tangy acid crunch', isDefault: true },
      { id: 'veg-lettuce', name: 'Hydroponic Butterhead Lettuce', priceDelta: 0, caloriesDelta: 10, description: 'Crisp green leaves', isDefault: true },
      { id: 'veg-tomato', name: 'Vine-Ripened Sliced Tomatoes', priceDelta: 0, caloriesDelta: 15, description: 'Fresh ruby red slices', isDefault: true },
      { id: 'veg-onions', name: 'Charred Caramelized Sweet Onions', priceDelta: 20, caloriesDelta: 35, description: 'Slow-cooked in grass-fed butter', isDefault: true },
      { id: 'veg-jalapeno', name: 'Pickled Fire Jalapeño Rings', priceDelta: 25, caloriesDelta: 15, description: 'Tangy spicy heat burst' },
    ],
  },
  {
    id: 'sauce',
    name: 'Signature Scratch Sauces',
    code: 'SPEC // 05',
    minSelect: 1,
    maxSelect: 2,
    options: [
      { id: 'sauce-umami', name: 'Secret Umami Smash Sauce', priceDelta: 0, caloriesDelta: 90, description: '14-ingredient confit garlic & smoked paprika emulsion', isDefault: true },
      { id: 'sauce-garlic', name: 'Roasted Garlic Confit Aioli', priceDelta: 25, caloriesDelta: 100, description: 'Slow-roasted garlic with fresh chives' },
      { id: 'sauce-truffle', name: 'Black Summer Truffle Butter Glaze', priceDelta: 45, caloriesDelta: 110, description: 'Rich French butter with Italian black truffles' },
      { id: 'sauce-bbq', name: 'Texas Bourbon Hickory BBQ', priceDelta: 20, caloriesDelta: 75, description: 'Sweet smoky bourbon reduction' },
    ],
  },
];

export default function CustomizerPage() {
  const [selectedOptions, setSelectedOptions] = useState<{ [groupId: string]: string[] }>({
    buns: ['bun-brioche'],
    patties: ['patty-double'],
    cheese: ['cheese-wisconsin'],
    veggies: ['veg-pickles', 'veg-lettuce', 'veg-tomato', 'veg-onions'],
    sauce: ['sauce-umami'],
  });

  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const handleToggleOption = (group: CustomGroup, option: CustomOption) => {
    setSelectedOptions((prev) => {
      const current = prev[group.id] || [];

      if (group.maxSelect === 1) {
        return { ...prev, [group.id]: [option.id] };
      }

      if (current.includes(option.id)) {
        if (current.length <= group.minSelect) return prev;
        return { ...prev, [group.id]: current.filter((id) => id !== option.id) };
      } else {
        if (current.length >= group.maxSelect) return prev;
        return { ...prev, [group.id]: [...current, option.id] };
      }
    });
  };

  const handleReset = () => {
    setSelectedOptions({
      buns: ['bun-brioche'],
      patties: ['patty-double'],
      cheese: ['cheese-wisconsin'],
      veggies: ['veg-pickles', 'veg-lettuce', 'veg-tomato', 'veg-onions'],
      sauce: ['sauce-umami'],
    });
    setQuantity(1);
  };

  // Pricing & Nutritional Calculation
  const BASE_PRICE = 329;
  let totalDelta = 0;
  let totalCalories = 0;
  const flatSelectedList: ISelectedCustomization[] = [];

  CUSTOMIZATION_MATRIX.forEach((group) => {
    const selectedIds = selectedOptions[group.id] || [];
    selectedIds.forEach((optId) => {
      const option = group.options.find((o) => o.id === optId);
      if (option) {
        totalDelta += option.priceDelta;
        totalCalories += option.caloriesDelta;
        flatSelectedList.push({
          groupName: group.name,
          choiceName: option.name,
          priceDelta: option.priceDelta,
        });
      }
    });
  });

  const unitPrice = BASE_PRICE + totalDelta;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customizedProduct: IProduct = {
      _id: 'custom_engineered_burger_' + Date.now(),
      id: 'custom_engineered_burger_' + Date.now(),
      name: 'Custom Engineered 450°F Smash',
      slug: 'custom-engineered-smash',
      description: 'Hand-calibrated custom double smashed burger on 450°F cast iron.',
      shortDescription: 'Custom calibrated with premium artisan ingredients',
      price: unitPrice,
      images: ['/burger/master-burger.png'],
      category: 'Smash Burgers',
      ingredients: flatSelectedList.map((c) => c.choiceName),
      nutritionalInformation: { calories: totalCalories, proteinGrams: 42, carbsGrams: 36, fatGrams: 44 },
      customizationOptions: [],
      spiceLevel: 1,
      preparationTimeMinutes: 10,
      isFeatured: false,
      isAvailable: true,
      isVegetarian: selectedOptions.patties?.[0] === 'patty-portobello',
      sortOrder: 99,
      ratingAverage: 5.0,
      ratingCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addItem(customizedProduct, flatSelectedList, quantity);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#FFA700', '#E6392E', '#FFFFFF'],
    });
    openCartDrawer();
  };

  return (
    <div className="pt-28 pb-32 bg-brand-dark min-h-screen text-brand-cream select-none">
      {/* Blueprint Grid Atmosphere */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-xs font-mono text-brand-yellow font-bold uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>450°F BURGER LAB // CUSTOMIZER ENGINE</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-brand-cream uppercase tracking-tight leading-none">
              ENGINEER YOUR <span className="text-brand-red">BURGER</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-brand-cream/70 hover:text-brand-cream transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET CALIBRATION</span>
            </button>
          </div>
        </div>

        {/* Main Customizer Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ======================================================================= */}
          {/* LEFT: LIVE BURGER STACK VISUALIZER & REAL-TIME HUD TELEMETRY */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 rounded-3xl bg-brand-dark-surface border border-white/15 backdrop-blur-xl shadow-surface-elevated relative overflow-hidden flex flex-col items-center justify-center">
              {/* Telemetry Header */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
                <span className="text-brand-yellow font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>CALIBRATION ACTIVE</span>
                </span>
                <span className="text-white/40">SYS.001</span>
              </div>

              {/* Central Visualizer Burger */}
              <div className="relative w-72 sm:w-80 h-72 sm:h-80 my-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/25 via-brand-yellow/15 to-transparent rounded-full blur-3xl pointer-events-none" />
                <Image
                  src="/burger/master-burger.png"
                  alt="Custom Smashed Burger Visualization"
                  fill
                  priority
                  className="object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]"
                />
              </div>

              {/* Dynamic Nutrition & Calorie Readout */}
              <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono text-brand-cream/50 uppercase block">CALORIES</span>
                  <span className="font-mono font-black text-lg text-brand-cream">{totalCalories} kcal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono text-brand-cream/50 uppercase block">SEAR TEMP</span>
                  <span className="font-mono font-black text-lg text-brand-yellow">450°F</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-mono text-brand-cream/50 uppercase block">PREP TIME</span>
                  <span className="font-mono font-black text-lg text-emerald-400">10 MIN</span>
                </div>
              </div>
            </div>

            {/* Quality Assurance Assurance Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 text-xs text-brand-cream/70 font-body">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                100% Certified Prime Angus Beef. Never frozen, smashed to order on our seasoned iron flat-top.
              </span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT: INGREDIENT CALIBRATION MATRIX OPTIONS */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            {CUSTOMIZATION_MATRIX.map((group) => {
              const selectedIds = selectedOptions[group.id] || [];

              return (
                <div
                  key={group.id}
                  className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-brand-yellow uppercase tracking-widest block mb-0.5">
                        {group.code}
                      </span>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-brand-cream tracking-tight">
                        {group.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-brand-cream/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {group.maxSelect === 1 ? 'SELECT 1' : `CHOOSE UP TO ${group.maxSelect}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {group.options.map((option) => {
                      const isSelected = selectedIds.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleToggleOption(group, option)}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-brand-dark-elevated border-brand-yellow shadow-[0_0_20px_rgba(255,167,0,0.15)] scale-[1.01]'
                              : 'bg-brand-dark border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-display font-black text-sm text-brand-cream">
                              {option.name}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-brand-yellow border-brand-yellow text-black'
                                  : 'border-white/30 bg-white/5'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                          </div>

                          <p className="text-xs text-brand-cream/60 font-body mb-3 leading-relaxed">
                            {option.description}
                          </p>

                          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
                            <span className="text-brand-cream/40">+{option.caloriesDelta} kcal</span>
                            <span
                              className={`font-bold ${
                                option.priceDelta > 0
                                  ? 'text-brand-yellow'
                                  : option.priceDelta < 0
                                  ? 'text-emerald-400'
                                  : 'text-brand-cream/50'
                              }`}
                            >
                              {option.priceDelta === 0
                                ? 'INCLUDED'
                                : option.priceDelta > 0
                                ? `+${formatPrice(option.priceDelta)}`
                                : formatPrice(option.priceDelta)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING BOTTOM CHECKOUT ACTION DOCK */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-brand-dark-surface/95 border-t border-white/15 backdrop-blur-xl py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] font-mono text-brand-cream/50 uppercase tracking-widest block">
                TOTAL CALIBRATION PRICE
              </span>
              <span className="font-display font-black text-2xl sm:text-3xl text-brand-yellow">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-brand-dark border border-white/10 rounded-2xl p-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-cream transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm px-2 text-brand-cream">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-cream transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-sm sm:text-base tracking-wider uppercase shadow-brand-glow transition-all active:scale-95 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>ADD ENGINEERED BURGER TO BAG</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
