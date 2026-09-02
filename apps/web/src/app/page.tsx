'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/home/Preloader';
import Hero from '@/components/home/Hero';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import MenuSections from '@/components/home/MenuSections';
import IngredientAssembly from '@/components/home/IngredientAssembly';
import StorySection from '@/components/home/StorySection';
import ExperienceSection from '@/components/home/ExperienceSection';
import CityDeliverySection from '@/components/home/CityDeliverySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ApiClient from '@/lib/api';
import { IProduct } from '@smashd/types';

// High-quality fallback data in case database is seeding or cold starting
const FALLBACK_PRODUCTS: IProduct[] = [
  {
    _id: 'prod_1',
    id: 'prod_1',
    name: 'The OG Double Smash',
    slug: 'the-og-double-smash',
    description:
      'Two ultra-crispy smashed beef patties, double aged smoked cheddar, house-brined dill pickles, charred onions, and our secret Umami Smash Sauce.',
    shortDescription: 'Double Angus smash, aged cheddar, pickles & umami smash sauce',
    price: 329,
    compareAtPrice: 389,
    images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80'],
    category: 'Smash Burgers',
    ingredients: ['Double Angus Beef', 'Smoked Cheddar', 'Dill Pickles', 'Umami Smash Sauce', 'Brioche Bun'],
    nutritionalInformation: { calories: 780, proteinGrams: 42, carbsGrams: 38, fatGrams: 48 },
    customizationOptions: [
      {
        groupName: 'Patty Count',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          { name: 'Single Smashed Patty', priceDelta: 0, isDefault: true },
          { name: 'Double Smashed Patty (+₹100)', priceDelta: 100 },
          { name: 'Triple Monster Smash (+₹190)', priceDelta: 190 },
        ],
      },
      {
        groupName: 'Artisan Cheese',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          { name: 'Aged Wisconsin Smoked Cheddar', priceDelta: 0, isDefault: true },
          { name: 'Swiss Emmental Melt (+₹35)', priceDelta: 35 },
          { name: 'No Cheese', priceDelta: 0 },
        ],
      },
    ],
    spiceLevel: 1,
    preparationTimeMinutes: 12,
    isFeatured: true,
    isAvailable: true,
    isVegetarian: false,
    sortOrder: 1,
    ratingAverage: 4.9,
    ratingCount: 184,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'prod_2',
    id: 'prod_2',
    name: 'Truffle Umami Melt',
    slug: 'truffle-umami-melt',
    description:
      'Double smashed patty glazed with black summer truffle butter, sauteed portobello mushroom ragout, melted Swiss gruyère, and roasted garlic confit aioli.',
    shortDescription: 'Double smash, black truffle glaze, sauteed portobello & gruyère melt',
    price: 429,
    compareAtPrice: 489,
    images: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80'],
    category: 'Smash Burgers',
    ingredients: ['Angus Beef', 'Black Truffle Butter', 'Portobello Mushrooms', 'Swiss Gruyère', 'Garlic Aioli'],
    nutritionalInformation: { calories: 840, proteinGrams: 44, carbsGrams: 36, fatGrams: 54 },
    customizationOptions: [],
    spiceLevel: 0,
    preparationTimeMinutes: 14,
    isFeatured: true,
    isAvailable: true,
    isVegetarian: false,
    sortOrder: 2,
    ratingAverage: 5.0,
    ratingCount: 142,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'prod_3',
    id: 'prod_3',
    name: 'Nashville Hot Firebird',
    slug: 'nashville-hot-firebird',
    description:
      'Double-dredged crispy buttermilk chicken breast dunked in fiery Nashville chili oil, honey-butter drizzle, vinegar slaw, and bread-and-butter pickles.',
    shortDescription: 'Buttermilk crispy chicken, fiery chili oil dip, vinegar slaw & honey',
    price: 349,
    compareAtPrice: 399,
    images: ['https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=1000&q=80'],
    category: 'Crispy Chicken',
    ingredients: ['Buttermilk Chicken Breast', 'Nashville Chili Oil', 'Cider Slaw', 'Honey Butter', 'Pickles'],
    nutritionalInformation: { calories: 740, proteinGrams: 39, carbsGrams: 49, fatGrams: 41 },
    customizationOptions: [],
    spiceLevel: 3,
    preparationTimeMinutes: 14,
    isFeatured: true,
    isAvailable: true,
    isVegetarian: false,
    sortOrder: 3,
    ratingAverage: 4.9,
    ratingCount: 165,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'prod_4',
    id: 'prod_4',
    name: 'Smoked BBQ Bacon Beast',
    slug: 'smoky-bbq-bacon-beast',
    description:
      'Smashed patties layered with thick crispy applewood smoked bacon, molten cheddar, crispy fried onion straws, and Texas bourbon hickory BBQ reduction.',
    shortDescription: 'Double smash, applewood bacon, crisp onion straws & bourbon BBQ',
    price: 379,
    compareAtPrice: 429,
    images: ['https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80'],
    category: 'Smash Burgers',
    ingredients: ['Angus Beef', 'Applewood Bacon', 'Smoked Cheddar', 'Crispy Onion Straws', 'Bourbon BBQ'],
    nutritionalInformation: { calories: 890, proteinGrams: 46, carbsGrams: 48, fatGrams: 56 },
    customizationOptions: [],
    spiceLevel: 1,
    preparationTimeMinutes: 15,
    isFeatured: true,
    isAvailable: true,
    isVegetarian: false,
    sortOrder: 4,
    ratingAverage: 4.8,
    ratingCount: 98,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await ApiClient.getFeaturedProducts();
        if (data && data.length > 0) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        // Use fallback products silently
      }
    }
    loadFeatured();
  }, []);

  return (
    <>
      <Preloader />
      <Hero />
      <MarqueeStrip />
      <MenuSections products={featuredProducts} />
      <IngredientAssembly />
      <StorySection />
      <ExperienceSection />
      <MarqueeStrip reverse className="bg-brand-red text-brand-cream border-none" />
      <CityDeliverySection />
      <TestimonialsSection />
    </>
  );
}
