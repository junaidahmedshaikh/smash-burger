'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check, Flame, Clock, Sparkles } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { ISelectedCustomization } from '@smashd/types';
import { formatPrice } from '@/lib/utils';

export default function CustomizerModal() {
  const { activeCustomizerProduct, closeCustomizer, openCartDrawer } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<{ [groupName: string]: string[] }>({});

  useEffect(() => {
    if (activeCustomizerProduct) {
      setQuantity(1);
      const defaults: { [groupName: string]: string[] } = {};

      activeCustomizerProduct.customizationOptions?.forEach((group) => {
        const defaultChoice = group.choices.find((c) => c.isDefault);
        if (defaultChoice) {
          defaults[group.groupName] = [defaultChoice.name];
        } else if (group.minSelect > 0 && group.choices[0]) {
          defaults[group.groupName] = [group.choices[0].name];
        } else {
          defaults[group.groupName] = [];
        }
      });

      setSelectedChoices(defaults);
    }
  }, [activeCustomizerProduct]);

  if (!activeCustomizerProduct) return null;

  const handleToggleChoice = (groupName: string, choiceName: string, maxSelect: number) => {
    setSelectedChoices((prev) => {
      const current = prev[groupName] || [];
      if (maxSelect === 1) {
        return { ...prev, [groupName]: [choiceName] };
      }

      if (current.includes(choiceName)) {
        return { ...prev, [groupName]: current.filter((c) => c !== choiceName) };
      } else {
        if (current.length >= maxSelect) {
          return prev;
        }
        return { ...prev, [groupName]: [...current, choiceName] };
      }
    });
  };

  let additionalPrice = 0;
  const flatSelectedList: ISelectedCustomization[] = [];

  activeCustomizerProduct.customizationOptions?.forEach((group) => {
    const selectedNames = selectedChoices[group.groupName] || [];
    selectedNames.forEach((name) => {
      const choice = group.choices.find((c) => c.name === name);
      if (choice) {
        additionalPrice += choice.priceDelta || 0;
        flatSelectedList.push({
          groupName: group.groupName,
          choiceName: choice.name,
          priceDelta: choice.priceDelta || 0,
        });
      }
    });
  });

  const unitPrice = activeCustomizerProduct.price + additionalPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(activeCustomizerProduct, flatSelectedList, quantity);
    closeCustomizer();
    openCartDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        onClick={closeCustomizer}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-brand-dark-surface border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        <div className="relative h-56 sm:h-72 w-full bg-brand-dark overflow-hidden flex-shrink-0">
          <Image
            src={activeCustomizerProduct.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
            alt={activeCustomizerProduct.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-surface via-transparent to-black/60" />

          <button
            onClick={closeCustomizer}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-brand-cream border border-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-red text-brand-cream">
                  {activeCustomizerProduct.isVegetarian ? 'VEG CRAFT' : 'SIGNATURE SMASH'}
                </span>
                <span className="text-[11px] font-mono text-brand-cream/80 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeCustomizerProduct.preparationTimeMinutes || 12} MINS
                </span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-cream tracking-tight">
                {activeCustomizerProduct.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-brand-cream/60 uppercase block">Base Price</span>
              <span className="font-display font-black text-2xl text-brand-yellow">
                {formatPrice(activeCustomizerProduct.price)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <p className="text-sm text-brand-cream/70 leading-relaxed font-body">
            {activeCustomizerProduct.description}
          </p>

          {activeCustomizerProduct.customizationOptions?.map((group) => {
            const selectedInGroup = selectedChoices[group.groupName] || [];
            return (
              <div key={group.groupName} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-brand-cream tracking-wide uppercase">
                    {group.groupName}
                  </h4>
                  <span className="text-xs font-mono text-brand-cream/50">
                    {group.maxSelect === 1 ? 'Choose 1' : `Choose up to ${group.maxSelect}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.choices.map((choice) => {
                    const isSelected = selectedInGroup.includes(choice.name);
                    return (
                      <button
                        key={choice.name}
                        type="button"
                        onClick={() => handleToggleChoice(group.groupName, choice.name, group.maxSelect)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-red/10 border-brand-red text-brand-cream'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-brand-cream/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-brand-red border-brand-red text-white'
                                : 'border-white/30 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-body font-bold">{choice.name}</span>
                        </div>
                        {choice.priceDelta > 0 && (
                          <span className="text-xs font-mono font-bold text-brand-yellow">
                            +{formatPrice(choice.priceDelta)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/10 bg-brand-dark-elevated flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-brand-dark rounded-2xl p-1.5 border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-sm sm:text-base tracking-wider uppercase shadow-brand-glow flex items-center justify-between transition-all active:scale-98"
          >
            <span>ADD TO BAG</span>
            <span className="font-mono font-bold text-brand-cream bg-black/20 px-3 py-1 rounded-xl">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
