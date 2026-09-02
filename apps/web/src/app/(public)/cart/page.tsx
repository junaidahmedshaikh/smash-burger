'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, Flame } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const grandTotal = getTotal();

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

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center">
        <Flame className="w-10 h-10 text-brand-red animate-pulse mb-3" />
        <span className="font-mono text-sm text-brand-yellow">LOADING BAG...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-brand-cream/30">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-brand-cream mb-3">
          YOUR BAG IS EMPTY
        </h1>
        <p className="text-brand-cream/60 max-w-sm mb-8 text-sm sm:text-base">
          Looks like you haven&apos;t added any smashed goodness yet. Explore our fresh gourmet menu!
        </p>
        <Link
          href="/menu"
          className="px-8 py-4 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-sm tracking-wider uppercase shadow-brand-glow transition-all"
        >
          EXPLORE THE MENU
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight mb-6 sm:mb-8">
          YOUR <span className="text-brand-red">BAG</span> ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-brand-dark flex-shrink-0">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-cream leading-tight mb-1">
                      {item.product.name}
                    </h3>
                    <span className="font-mono text-sm font-bold text-brand-yellow block mb-2">
                      {formatPrice(item.unitPrice)} each
                    </span>

                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.selectedCustomizations.map((c, i) => (
                          <span
                            key={i}
                            className="text-xs font-mono bg-white/10 text-brand-cream/80 px-2.5 py-0.5 rounded-lg"
                          >
                            {c.choiceName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:border-white/10 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="flex items-center gap-3 bg-brand-dark rounded-xl p-1.5 border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-brand-cream transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono font-black text-xl text-brand-cream min-w-[80px] text-right">
                    {formatPrice(item.totalPrice)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-brand-cream/40 hover:text-brand-red transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout card */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-brand-dark-surface border border-white/15 shadow-2xl space-y-6">
            <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight pb-4 border-b border-white/10">
              ORDER SUMMARY
            </h3>

            {coupon ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>
                    CODE: <strong>{coupon.code}</strong> (-{formatPrice(discount)})
                  </span>
                </div>
                <button onClick={removeCoupon} className="underline font-bold hover:text-emerald-200">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="PROMO CODE (e.g. FIRSTBITE20)"
                    className="bg-brand-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red flex-1"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading || !promoCodeInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 text-xs font-display font-bold uppercase transition-colors"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-xs text-brand-red font-mono">{promoError}</p>}
              </form>
            )}

            <div className="space-y-3 font-mono text-sm text-brand-cream/70 border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-xl font-display font-black text-brand-cream pt-4 border-t border-white/10">
                <span>TOTAL</span>
                <span className="text-brand-yellow">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-base uppercase tracking-wider shadow-brand-glow transition-all active:scale-98"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
