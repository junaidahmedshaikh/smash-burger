'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

export default function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTax,
    getTotal,
    freeDeliveryThreshold,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const grandTotal = getTotal();

  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setPromoLoading(true);
    setPromoError(null);

    try {
      const res = await ApiClient.validateCoupon(promoCodeInput.trim(), subtotal);
      if (res.isValid) {
        applyCoupon(res.coupon, res.discountAmount);
        setPromoCodeInput('');
      } else {
        setPromoError(res.message || 'Invalid promo code');
      }
    } catch (err: any) {
      setPromoError(err.message || 'Could not validate coupon');
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-dark-surface border-l border-white/10 flex flex-col shadow-2xl text-brand-cream">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-red" />
              <h2 className="font-display font-black text-xl tracking-tight uppercase">
                YOUR BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-brand-cream/70 hover:text-brand-cream transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length > 0 && (
            <div className="bg-brand-dark-elevated px-6 py-3 border-b border-white/5">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span>
                  {amountNeededForFreeDelivery === 0 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FREE DELIVERY UNLOCKED!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-brand-yellow">{formatPrice(amountNeededForFreeDelivery)}</strong> for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-brand-cream/50">{progressToFreeDelivery}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-yellow to-brand-red transition-all duration-300"
                  style={{ width: `${progressToFreeDelivery}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-brand-cream/30">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-display font-bold text-2xl text-brand-cream mb-2">YOUR BAG IS EMPTY</h3>
                <p className="text-brand-cream/60 text-sm max-w-xs mb-8">
                  Smash patties await. Explore our gourmet smashed burgers and loaded sides.
                </p>
                <Link
                  href="/menu"
                  onClick={closeCartDrawer}
                  className="px-6 py-3 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-sm shadow-brand-glow transition-all"
                >
                  EXPLORE THE MENU
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 relative group"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-dark flex-shrink-0">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-base text-brand-cream leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-cream/40 hover:text-brand-red transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.selectedCustomizations.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-brand-cream/80"
                            >
                              {c.choiceName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-brand-dark rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-sm text-brand-yellow">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-brand-dark-elevated space-y-4">
              {coupon ? (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>
                      CODE: <strong>{coupon.code}</strong> (-{formatPrice(discount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-400 hover:text-emerald-200 underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="PROMO CODE (e.g. FIRSTBITE20)"
                      className="bg-brand-dark border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red flex-1"
                    />
                    <button
                      type="submit"
                      disabled={promoLoading || !promoCodeInput.trim()}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 text-xs font-display font-bold uppercase transition-colors"
                    >
                      {promoLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-brand-red font-mono">{promoError}</p>}
                </form>
              )}

              <div className="space-y-1.5 text-xs font-mono text-brand-cream/70 border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes (5% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-display font-black text-brand-cream pt-2 border-t border-white/10">
                  <span>TOTAL</span>
                  <span className="text-brand-yellow">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-base tracking-wider uppercase shadow-brand-glow transition-all active:scale-98"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
