'use client';

import { useState } from 'react';
import { Flame, Sparkles, Layers, Info } from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  category: string;
  description: string;
  temperature?: string;
  flavorProfile: string;
  color: string;
}

const INGREDIENT_LAYERS: LayerItem[] = [
  {
    id: 'top-bun',
    name: 'Toasted Hokkaido Milk Brioche Bun',
    category: 'THE CROWN',
    description:
      'Baked fresh every morning with pure grass-fed butter and whole milk. Toasted on the flat-top with clarified butter until golden and pillow-soft.',
    temperature: '180°F Toasted',
    flavorProfile: 'Sweet, buttery, cloud-like texture',
    color: '#D49B5B',
  },
  {
    id: 'sauce-top',
    name: 'House Secret Umami Smash Sauce',
    category: 'THE SIGNATURE',
    description:
      'A 14-ingredient scratch emulsion featuring smoked Spanish paprika, roasted garlic confit, apple cider vinegar, pickle brine, and Japanese Kewpie.',
    flavorProfile: 'Tangy, smoky, savory umami bomb',
    color: '#E6392E',
  },
  {
    id: 'pickles-greens',
    name: 'Crisp Dill Pickles & Butterhead Lettuce',
    category: 'THE CRUNCH',
    description:
      'Farm-fresh hydroponic butter lettuce with thick crinkle-cut pickles brined in mustard seed and fresh dill for razor-sharp acidity.',
    flavorProfile: 'Acidic, crisp, palate-cleansing snap',
    color: '#84CC16',
  },
  {
    id: 'cheese',
    name: 'Molten Aged Wisconsin Smoked Cheddar',
    category: 'THE MELT',
    description:
      'Sharp 18-month aged cheddar blended with vintage American cheese for the ultimate velvety melt under a stainless steel basting cloche.',
    flavorProfile: 'Rich, sharp, smoky, ultra-creamy',
    color: '#FFA700',
  },
  {
    id: 'patty',
    name: 'Double Smashed Prime Angus Beef',
    category: 'THE HEART',
    description:
      'Fresh 80/20 chuck, brisket, and short-rib blend smashed paper-thin on 450°F cast iron, creating an unbeatable crispy lacy Maillard crust.',
    temperature: '450°F Searing Iron',
    flavorProfile: 'Deep caramelized beef essence, salty crispy edges',
    color: '#582C18',
  },
  {
    id: 'bottom-bun',
    name: 'Heavy-Duty Buttered Bottom Heel Bun',
    category: 'THE FOUNDATION',
    description:
      'Double-toasted to create an impermeable flavor barrier that catches every drop of sizzling beef jus and melted cheese without getting soggy.',
    flavorProfile: 'Golden, structured, sturdy bite',
    color: '#C48946',
  },
];

export default function IngredientAssembly() {
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(4); // Default to Patty

  const activeLayer = INGREDIENT_LAYERS[activeLayerIndex];

  return (
    <section className="py-24 bg-brand-dark-surface border-y border-white/10 relative overflow-hidden">
      {/* Background Decorative Atmosphere */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brand-yellow mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>ANATOMY OF PERFECTION</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight leading-tight mb-3">
            A STORY IN
            <span className="block text-brand-red">EVERY SINGLE BITE</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-cream/70 font-body">
            Every layer is engineered with mathematical precision to achieve the holy grail of burger
            textures: soft, crunchy, juicy, and rich.
          </p>
        </div>

        {/* Interactive Exploded Burger Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Layer Selector Stack (Interactive Visual Burger) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {INGREDIENT_LAYERS.map((layer, index) => {
              const isSelected = activeLayerIndex === index;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayerIndex(index)}
                  className={`cursor-pointer p-3 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-brand-dark-elevated border-brand-red sm:translate-x-2 shadow-brand-glow'
                      : 'bg-brand-dark border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div>
                      <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest block font-bold">
                        {layer.category}
                      </span>
                      <h4 className="font-display font-black text-base sm:text-lg text-brand-cream tracking-tight">
                        {layer.name}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      isSelected ? 'bg-brand-red text-white' : 'text-brand-cream/40 bg-white/5'
                    }`}
                  >
                    0{index + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Layer Deep Dive Information Panel */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-brand-dark-elevated border border-white/15 relative overflow-hidden shadow-2xl">
              {/* Highlight Tag */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest">
                  LAYER 0{activeLayerIndex + 1} • {activeLayer.category}
                </span>
                {activeLayer.temperature && (
                  <span className="font-mono text-xs text-brand-red font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {activeLayer.temperature}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-cream tracking-tight mb-4">
                {activeLayer.name}
              </h3>
              <p className="text-base text-brand-cream/80 font-body leading-relaxed mb-8">
                {activeLayer.description}
              </p>

              {/* Flavor Profile Callout */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cream/60 block">
                    FLAVOR DYNAMICS
                  </span>
                  <span className="text-sm font-body font-semibold text-brand-cream">
                    {activeLayer.flavorProfile}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
