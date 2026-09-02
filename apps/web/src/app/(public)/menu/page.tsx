"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Flame,
  Clock,
  Star,
  Plus,
  Check,
  Drumstick,
  Leaf,
  Utensils,
  CupSoda,
  Sparkles,
} from "lucide-react";
import { IProduct, ICategory } from "@smashd/types";
import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import ApiClient from "@/lib/api";

const FALLBACK_CATEGORIES: ICategory[] = [
  {
    _id: "all",
    name: "All Cravings",
    slug: "all",
    description: "Explore full menu",
    image: "",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "smash-burgers",
    name: "Smash Burgers",
    slug: "smash-burgers",
    description: "Crispy iron-smashed prime patties",
    image: "",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "crispy-chicken",
    name: "Crispy Chicken",
    slug: "crispy-chicken",
    description: "Double-dredged buttermilk fried chicken",
    image: "",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "plant-and-veg",
    name: "Plant & Veg",
    slug: "plant-and-veg",
    description: "Artisan vegetarian & portobello crafts",
    image: "",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "loaded-sides",
    name: "Loaded Sides",
    slug: "loaded-fries-and-sides",
    description: "Truffle russet fries and dirty sides",
    image: "",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "handspun-shakes",
    name: "Handspun Shakes",
    slug: "handspun-shakes",
    description: "Slow-churned thick gelato shakes",
    image: "",
    sortOrder: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const COMPREHENSIVE_FALLBACK_PRODUCTS: IProduct[] = [
  {
    _id: "prod_1",
    id: "prod_1",
    name: "The OG Double Smash",
    slug: "the-og-double-smash",
    description:
      "Two ultra-crispy smashed Angus beef patties, double aged smoked cheddar, house-brined dill pickles, charred onions, and our secret Umami Smash Sauce on buttered Hokkaido brioche.",
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
    ratingCount: 240,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_2",
    id: "prod_2",
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
    ratingCount: 182,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_3",
    id: "prod_3",
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
    ratingCount: 145,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_4",
    id: "prod_4",
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
    sortOrder: 4,
    ratingAverage: 4.9,
    ratingCount: 198,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_5",
    id: "prod_5",
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
    sortOrder: 5,
    ratingAverage: 4.9,
    ratingCount: 154,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_6",
    id: "prod_6",
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
    sortOrder: 6,
    ratingAverage: 4.9,
    ratingCount: 132,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_7",
    id: "prod_7",
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
    sortOrder: 7,
    ratingAverage: 4.9,
    ratingCount: 195,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_8",
    id: "prod_8",
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
    sortOrder: 8,
    ratingAverage: 5.0,
    ratingCount: 235,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_9",
    id: "prod_9",
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
    sortOrder: 9,
    ratingAverage: 5.0,
    ratingCount: 184,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_10",
    id: "prod_10",
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
    sortOrder: 10,
    ratingAverage: 4.9,
    ratingCount: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function MenuPage() {
  const [categories, setCategories] =
    useState<ICategory[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [products, setProducts] = useState<IProduct[]>(
    COMPREHENSIVE_FALLBACK_PRODUCTS,
  );
  const [isLoading, setIsLoading] = useState(false);

  const openCustomizer = useUIStore((state) => state.openCustomizer);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          ApiClient.getCategories().catch(() => FALLBACK_CATEGORIES),
          ApiClient.getProducts().catch(() => COMPREHENSIVE_FALLBACK_PRODUCTS),
        ]);

        if (cats && cats.length > 0) {
          setCategories([
            {
              _id: "all",
              name: "All Cravings",
              slug: "all",
              description: "",
              image: "",
              sortOrder: 0,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...cats,
          ]);
        }
        if (prods && prods.length > 0) {
          setProducts(prods);
        }
      } catch (e) {
        // Fallback
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all") {
      const categorySlug =
        typeof product.category === "object" && product.category?.slug
          ? product.category.slug
          : typeof product.category === "string"
            ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : "";
      if (
        !categorySlug.includes(selectedCategory) &&
        selectedCategory !== categorySlug
      ) {
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
      const ingMatch = product.ingredients.some((ing) =>
        ing.toLowerCase().includes(q),
      );
      if (!nameMatch && !descMatch && !ingMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center  mx-auto mb-12">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            FRESH ON THE 450°F IRON GRILL
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight leading-tight mb-3 sm:mb-4">
            OUR GOURMET <span className="text-brand-red">MENU SECTIONS</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/70 font-body">
            Every burger is customized to order with double smashed prime
            patties, secret house sauces, and butter-toasted brioche.
          </p>
        </div>

        {/* Search & Filter Bar */}
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
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-brand-dark border-white/10 text-brand-cream/70 hover:text-brand-cream"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isVegOnly ? "bg-emerald-400 border-emerald-400" : "border-white/40"}`}
              >
                {isVegOnly && (
                  <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                )}
              </span>
              <span>100% VEG ONLY</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar select-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-3.5 rounded-2xl font-display font-bold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-brand-red text-brand-cream shadow-brand-glow"
                    : "bg-brand-dark-surface border border-white/10 text-brand-cream/70 hover:text-brand-cream hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-brand-dark-surface rounded-3xl border border-white/10 p-8">
            <h3 className="font-display font-black text-3xl text-brand-cream mb-2">
              NO CRAVINGS FOUND
            </h3>
            <p className="text-sm text-brand-cream/60 mb-6">
              Try adjusting your search query or reset the category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setIsVegOnly(false);
              }}
              className="px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="group bg-brand-dark-surface rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-brand-red/40 transition-all duration-300 shadow-2xl hover:shadow-brand-glow"
              >
                <div>
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-brand-dark mb-5 flex items-center justify-center">
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
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                          product.isVegetarian
                            ? "bg-emerald-500/90 text-white"
                            : "bg-brand-red/90 text-white"
                        }`}
                      >
                        {product.isVegetarian ? "VEG" : "NON-VEG"}
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

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.ingredients?.slice(0, 3).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-body bg-white/5 border border-white/5 text-brand-cream/60 px-2.5 py-1 rounded-md"
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
