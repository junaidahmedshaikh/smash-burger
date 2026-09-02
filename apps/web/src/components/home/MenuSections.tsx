"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Drumstick,
  Leaf,
  Utensils,
  CupSoda,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { IProduct } from "@smashd/types";
import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";

interface MenuCategoryItem {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
}

const MENU_CATEGORIES: MenuCategoryItem[] = [
  {
    id: "smash-burgers",
    name: "Smash Burgers",
    tagline: "450°F Iron Smashed Angus",
    icon: Flame,
  },
  {
    id: "crispy-chicken",
    name: "Crispy Chicken",
    tagline: "Double-Dredged Buttermilk Fried",
    icon: Drumstick,
  },
  {
    id: "plant-and-veg",
    name: "Plant & Veg",
    tagline: "Artisan Portobello & Truffle",
    icon: Leaf,
  },
  {
    id: "loaded-sides",
    name: "Loaded Sides",
    tagline: "Truffle Fries & Animal Crunch",
    icon: Utensils,
  },
  {
    id: "handspun-shakes",
    name: "Shakes & Sips",
    tagline: "Slow-Churned Madagascar Custard",
    icon: CupSoda,
  },
];

const COMPREHENSIVE_MENU: Record<string, IProduct[]> = {
  "smash-burgers": [
    {
      _id: "prod_smash_1",
      id: "prod_smash_1",
      name: "The OG Double Smash",
      slug: "the-og-double-smash",
      description:
        "Two ultra-crispy smashed Angus beef patties, double aged smoked cheddar, house-brined dill pickles, charred onions, and our secret Umami Smash Sauce.",
      shortDescription:
        "Double Angus smash, aged cheddar, pickles & umami smash sauce",
      price: 329,
      compareAtPrice: 389,
      images: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Smash Burgers",
      ingredients: [
        "Double Angus Beef",
        "Smoked Cheddar",
        "Dill Pickles",
        "Umami Smash Sauce",
        "Brioche Bun",
      ],
      nutritionalInformation: {
        calories: 780,
        proteinGrams: 42,
        carbsGrams: 38,
        fatGrams: 48,
      },
      customizationOptions: [],
      spiceLevel: 1,
      preparationTimeMinutes: 10,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 1,
      ratingAverage: 4.9,
      ratingCount: 210,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_smash_2",
      id: "prod_smash_2",
      name: "Truffle Umami Melt",
      slug: "truffle-umami-melt",
      description:
        "Double smashed patty glazed with black summer truffle butter, sauteed portobello mushroom ragout, melted Swiss gruyère, and roasted garlic confit aioli.",
      shortDescription:
        "Double smash, black truffle glaze, sauteed portobello & gruyère melt",
      price: 429,
      compareAtPrice: 489,
      images: [
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Smash Burgers",
      ingredients: [
        "Angus Beef",
        "Black Truffle Butter",
        "Portobello Mushrooms",
        "Swiss Gruyère",
        "Garlic Aioli",
      ],
      nutritionalInformation: {
        calories: 840,
        proteinGrams: 44,
        carbsGrams: 36,
        fatGrams: 54,
      },
      customizationOptions: [],
      spiceLevel: 0,
      preparationTimeMinutes: 12,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 2,
      ratingAverage: 5.0,
      ratingCount: 168,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_smash_3",
      id: "prod_smash_3",
      name: "Smoked BBQ Bacon Beast",
      slug: "smoky-bbq-bacon-beast",
      description:
        "Smashed patties layered with thick crispy applewood smoked bacon, molten cheddar, crispy fried onion straws, and Texas bourbon hickory BBQ reduction.",
      shortDescription:
        "Double smash, applewood bacon, crisp onion straws & bourbon BBQ",
      price: 379,
      compareAtPrice: 429,
      images: [
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Smash Burgers",
      ingredients: [
        "Angus Beef",
        "Applewood Bacon",
        "Smoked Cheddar",
        "Crispy Onion Straws",
        "Bourbon BBQ",
      ],
      nutritionalInformation: {
        calories: 890,
        proteinGrams: 46,
        carbsGrams: 48,
        fatGrams: 56,
      },
      customizationOptions: [],
      spiceLevel: 1,
      preparationTimeMinutes: 14,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 3,
      ratingAverage: 4.8,
      ratingCount: 135,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  "crispy-chicken": [
    {
      _id: "prod_chick_1",
      id: "prod_chick_1",
      name: "Nashville Hot Firebird",
      slug: "nashville-hot-firebird",
      description:
        "Double-dredged crispy buttermilk chicken breast dunked in fiery Nashville chili oil, honey-butter drizzle, vinegar slaw, and bread-and-butter pickles.",
      shortDescription:
        "Buttermilk crispy chicken, fiery chili oil dip, vinegar slaw & honey",
      price: 349,
      compareAtPrice: 399,
      images: [
        "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Crispy Chicken",
      ingredients: [
        "Buttermilk Chicken Breast",
        "Nashville Chili Oil",
        "Cider Slaw",
        "Honey Butter",
        "Pickles",
      ],
      nutritionalInformation: {
        calories: 740,
        proteinGrams: 39,
        carbsGrams: 49,
        fatGrams: 41,
      },
      customizationOptions: [],
      spiceLevel: 3,
      preparationTimeMinutes: 12,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 1,
      ratingAverage: 4.9,
      ratingCount: 194,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_chick_2",
      id: "prod_chick_2",
      name: "Korean Gochujang Crunch",
      slug: "korean-gochujang-crunch",
      description:
        "Ultra-crunchy fried chicken tossed in sweet spicy gochujang glaze, toasted sesame seeds, pickled daikon radish, and kewpie mayo.",
      shortDescription:
        "Gochujang glazed chicken, pickled daikon, kewpie mayo & sesame",
      price: 359,
      compareAtPrice: 409,
      images: [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Crispy Chicken",
      ingredients: [
        "Crispy Chicken Thigh",
        "Sticky Gochujang Glaze",
        "Pickled Radish",
        "Kewpie Mayo",
      ],
      nutritionalInformation: {
        calories: 760,
        proteinGrams: 38,
        carbsGrams: 52,
        fatGrams: 43,
      },
      customizationOptions: [],
      spiceLevel: 2,
      preparationTimeMinutes: 12,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 2,
      ratingAverage: 4.9,
      ratingCount: 142,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  "plant-and-veg": [
    {
      _id: "prod_veg_1",
      id: "prod_veg_1",
      name: "Portobello Truffle Melt",
      slug: "portobello-truffle-melt",
      description:
        "Charred garlic-herb marinated portobello cap, aged Swiss gruyère melt, caramelized sweet onions, crispy wild arugula, and black truffle aioli.",
      shortDescription:
        "Marinated portobello cap, Swiss gruyère, truffle aioli & wild arugula",
      price: 349,
      compareAtPrice: 399,
      images: [
        "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Plant & Veg",
      ingredients: [
        "Portobello Mushroom",
        "Swiss Gruyère",
        "Caramelized Onions",
        "Truffle Aioli",
        "Arugula",
      ],
      nutritionalInformation: {
        calories: 590,
        proteinGrams: 22,
        carbsGrams: 44,
        fatGrams: 36,
      },
      customizationOptions: [],
      spiceLevel: 0,
      preparationTimeMinutes: 10,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 1,
      ratingAverage: 4.9,
      ratingCount: 128,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_veg_2",
      id: "prod_veg_2",
      name: "Crispy Paneer Fire Smash",
      slug: "crispy-paneer-fire-smash",
      description:
        "Thick block of spiced malai paneer with crispy panko crust, charred bell pepper chutney, molten pepper jack, and mint-coriander emulsion.",
      shortDescription:
        "Panko malai paneer, charred pepper chutney, pepper jack & mint aioli",
      price: 319,
      compareAtPrice: 369,
      images: [
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Plant & Veg",
      ingredients: [
        "Panko Malai Paneer",
        "Pepper Chutney",
        "Pepper Jack Cheese",
        "Mint Aioli",
      ],
      nutritionalInformation: {
        calories: 680,
        proteinGrams: 28,
        carbsGrams: 46,
        fatGrams: 42,
      },
      customizationOptions: [],
      spiceLevel: 2,
      preparationTimeMinutes: 11,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 2,
      ratingAverage: 4.8,
      ratingCount: 96,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  "loaded-sides": [
    {
      _id: "prod_side_1",
      id: "prod_side_1",
      name: "Truffle Parmesan Russet Fries",
      slug: "truffle-parmesan-fries",
      description:
        "Triple-cooked Idaho russet skin-on fries tossed in white truffle oil, freshly grated 24-month Parmigiano Reggiano, sea salt, and fresh parsley.",
      shortDescription:
        "Skin-on russet fries, white truffle oil & aged Parmigiano Reggiano",
      price: 219,
      compareAtPrice: 259,
      images: [
        "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Loaded Sides",
      ingredients: [
        "Idaho Russet Potatoes",
        "White Truffle Oil",
        "Parmigiano Reggiano",
        "Rosemary Parsley",
      ],
      nutritionalInformation: {
        calories: 480,
        proteinGrams: 8,
        carbsGrams: 58,
        fatGrams: 24,
      },
      customizationOptions: [],
      spiceLevel: 0,
      preparationTimeMinutes: 6,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 1,
      ratingAverage: 4.9,
      ratingCount: 185,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_side_2",
      id: "prod_side_2",
      name: "Dirty Animal Smash Fries",
      slug: "dirty-animal-smash-fries",
      description:
        "Crispy fries smothered in molten cheddar cheese fondue, caramelized onions, chopped crispy smash patty bits, and secret smash sauce.",
      shortDescription:
        "Fries drenched in molten cheese fondue, caramelized onions & smash bits",
      price: 269,
      compareAtPrice: 299,
      images: [
        "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Loaded Sides",
      ingredients: [
        "Crispy Fries",
        "Molten Cheese Fondue",
        "Caramelized Onions",
        "Smash Patty Bits",
      ],
      nutritionalInformation: {
        calories: 680,
        proteinGrams: 18,
        carbsGrams: 64,
        fatGrams: 38,
      },
      customizationOptions: [],
      spiceLevel: 1,
      preparationTimeMinutes: 8,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 2,
      ratingAverage: 5.0,
      ratingCount: 220,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  "handspun-shakes": [
    {
      _id: "prod_shake_1",
      id: "prod_shake_1",
      name: "Salted Caramel Pretzel Shake",
      slug: "salted-caramel-pretzel-shake",
      description:
        "Slow-churned Madagascar vanilla custard blended with burnt copper caramel, Maldon sea salt, butter pretzel crunch, and torched marshmallow cream.",
      shortDescription:
        "Madagascar vanilla custard, burnt copper caramel & butter pretzel crunch",
      price: 249,
      compareAtPrice: 289,
      images: [
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Handspun Shakes",
      ingredients: [
        "Madagascar Vanilla Custard",
        "Burnt Caramel",
        "Maldon Sea Salt",
        "Pretzel Crunch",
      ],
      nutritionalInformation: {
        calories: 620,
        proteinGrams: 12,
        carbsGrams: 78,
        fatGrams: 28,
      },
      customizationOptions: [],
      spiceLevel: 0,
      preparationTimeMinutes: 5,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 1,
      ratingAverage: 5.0,
      ratingCount: 172,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "prod_shake_2",
      id: "prod_shake_2",
      name: "Dark Chocolate Fudge Lava Shake",
      slug: "dark-chocolate-fudge-shake",
      description:
        "70% Valrhona dark chocolate gelato blended with warm fudge sauce, cocoa nibs, and house-made vanilla bean whipped cream.",
      shortDescription:
        "70% Valrhona dark chocolate, warm fudge lava & cocoa nibs",
      price: 249,
      compareAtPrice: 289,
      images: [
        "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1000&q=80",
      ],
      category: "Handspun Shakes",
      ingredients: [
        "Valrhona Dark Chocolate",
        "Fudge Sauce",
        "Cocoa Nibs",
        "Whipped Cream",
      ],
      nutritionalInformation: {
        calories: 650,
        proteinGrams: 14,
        carbsGrams: 82,
        fatGrams: 30,
      },
      customizationOptions: [],
      spiceLevel: 0,
      preparationTimeMinutes: 5,
      isFeatured: true,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 2,
      ratingAverage: 4.9,
      ratingCount: 148,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export default function MenuSections({ products }: { products?: IProduct[] }) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("smash-burgers");

  const openCustomizer = useUIStore((state) => state.openCustomizer);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const currentProducts =
    COMPREHENSIVE_MENU[selectedCategory] || COMPREHENSIVE_MENU["smash-burgers"];
  const activeCategory =
    MENU_CATEGORIES.find((c) => c.id === selectedCategory) ||
    MENU_CATEGORIES[0];

  return (
    <section
      id="menu-sections"
      className="py-24 bg-brand-dark-surface border-y border-white/10 relative overflow-hidden"
    >
      {/* Ambient Radial Atmosphere */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brand-yellow mb-3">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>CRAFTED ON 450°F CAST IRON</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-brand-cream uppercase tracking-tight leading-none">
              EXPLORE OUR <span className="text-brand-red">MENU</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-cream/70 font-body max-w-xl mt-3">
              Select a section below to browse our chef-curated smash burgers,
              double-fried crispy chicken, loaded sides, and handspun shakes.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-brand-cream font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>FULL MENU & NUTRITION</span>
            <ArrowRight className="w-4 h-4 text-brand-yellow" />
          </Link>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar select-none">
          {MENU_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? "bg-brand-red border-brand-red text-brand-cream shadow-brand-glow scale-[1.02]"
                    : "bg-brand-dark border-white/10 text-brand-cream/70 hover:text-brand-cream hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isSelected ? "text-brand-yellow" : "text-brand-cream/50"}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Category Tagline Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-dark/80 border border-white/10 backdrop-blur-md mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold text-brand-cream uppercase tracking-wide">
              {activeCategory.name.toUpperCase()} //{" "}
              {activeCategory.tagline.toUpperCase()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-brand-cream/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% FRESH INGREDIENTS</span>
          </div>
        </div>

        {/* Products Grid for Current Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="group bg-brand-dark rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-brand-red/50 transition-all duration-300 shadow-2xl hover:shadow-brand-glow hover:-translate-y-1"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-brand-dark-surface mb-5 flex items-center justify-center">
                  <Image
                    src={
                      product.images[0] ||
                      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dietary Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur-md ${
                        product.isVegetarian
                          ? "bg-emerald-500/90 text-white"
                          : "bg-brand-red/90 text-white"
                      }`}
                    >
                      {product.isVegetarian ? "100% VEG" : "PRIME ANGUS"}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-brand-yellow text-xs font-mono font-bold border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.ratingAverage || 4.9}</span>
                  </div>
                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-black text-2xl text-brand-cream tracking-tight group-hover:text-brand-red transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-display font-black text-2xl text-brand-yellow whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-brand-cream/70 font-body mb-4 line-clamp-2 leading-relaxed">
                  {product.shortDescription || product.description}
                </p>

                {/* Ingredients chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.ingredients?.slice(0, 3).map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-white/5 border border-white/10 text-brand-cream/70 px-2.5 py-0.5 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => openCustomizer(product)}
                  className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  CUSTOMIZE
                </button>
                <button
                  onClick={() => {
                    addItem(product);
                    openCartDrawer();
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs uppercase tracking-wider shadow-brand-glow transition-all active:scale-95"
                  aria-label="Add to Bag"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
