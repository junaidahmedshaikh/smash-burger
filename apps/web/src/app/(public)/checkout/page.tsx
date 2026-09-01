'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, User, CreditCard, ShieldCheck, ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice } from '@/lib/utils';
import ApiClient from '@/lib/api';

const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  street: z.string().min(5, 'Street address is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Pincode'),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['mock_card', 'razorpay', 'cash_on_delivery']).default('mock_card'),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { items, coupon, getSubtotal, getDiscount, getDeliveryFee, getTax, getTotal, clearCart } = useCartStore();
  const { user, accessToken } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const grandTotal = getTotal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.addresses?.[0]?.street || '',
      landmark: user?.addresses?.[0]?.landmark || '',
      city: user?.addresses?.[0]?.city || 'Mumbai',
      state: user?.addresses?.[0]?.state || 'Maharashtra',
      pincode: user?.addresses?.[0]?.pincode || '400050',
      paymentMethod: 'mock_card',
      customerNotes: '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  const onFormSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setErrorMsg('Your bag is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        items: items.map((item) => ({
          productId: item.product._id || item.product.id,
          quantity: item.quantity,
          selectedCustomizations: item.selectedCustomizations || [],
        })),
        deliveryAddress: {
          street: data.street,
          landmark: data.landmark,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        couponCode: coupon?.code,
        paymentMethod: data.paymentMethod,
        customerNotes: data.customerNotes,
      };

      const order = await ApiClient.createOrder(payload as any, accessToken || undefined);
      clearCart();
      router.push(`/order/${order.orderNumber || order._id || order.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center">
        <Flame className="w-10 h-10 text-brand-red animate-pulse mb-3" />
        <span className="font-mono text-sm text-brand-yellow">PREPARING SECURE CHECKOUT...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-display font-black text-3xl text-brand-cream mb-3">YOUR BAG IS EMPTY</h2>
        <p className="text-sm text-brand-cream/60 mb-6">Add some smash burgers to proceed with checkout.</p>
        <button
          onClick={() => router.push('/menu')}
          className="px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase"
        >
          VIEW MENU
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
            EXPRESS CHECKOUT
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-brand-cream uppercase tracking-tight">
            CONFIRM YOUR <span className="text-brand-red">ORDER</span>
          </h1>
        </div>

        {errorMsg && (
          <div className="p-4 mb-8 rounded-2xl bg-brand-red/10 border border-brand-red text-brand-red text-sm font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Customer Info */}
              <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight">
                    CONTACT INFORMATION
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                    />
                    {errors.name && <p className="text-xs text-brand-red font-mono mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      placeholder="e.g. rohan@gmail.com"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                    />
                    {errors.email && <p className="text-xs text-brand-red font-mono mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      {...register('phone')}
                      placeholder="e.g. 9812345678"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                    />
                    {errors.phone && <p className="text-xs text-brand-red font-mono mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight">
                    DELIVERY ADDRESS
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                      Flat / House / Street Address *
                    </label>
                    <input
                      {...register('street')}
                      placeholder="e.g. Flat 402, Sea Breeze Apts, Linking Road"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                    />
                    {errors.street && <p className="text-xs text-brand-red font-mono mt-1">{errors.street.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                        Landmark
                      </label>
                      <input
                        {...register('landmark')}
                        placeholder="Near Starbucks"
                        className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                        City *
                      </label>
                      <input
                        {...register('city')}
                        placeholder="Mumbai"
                        className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                      />
                      {errors.city && <p className="text-xs text-brand-red font-mono mt-1">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                        Pincode (6 digits) *
                      </label>
                      <input
                        {...register('pincode')}
                        placeholder="400050"
                        className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                      />
                      {errors.pincode && <p className="text-xs text-brand-red font-mono mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-2">
                      Kitchen Delivery Notes (Optional)
                    </label>
                    <input
                      {...register('customerNotes')}
                      placeholder="e.g. Leave with security, extra napkins please"
                      className="w-full bg-brand-dark border border-white/10 rounded-2xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight">
                    PAYMENT METHOD
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => setValue('paymentMethod', 'mock_card')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'mock_card'
                        ? 'bg-brand-red/10 border-brand-red text-brand-cream'
                        : 'bg-brand-dark border-white/10 text-brand-cream/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CreditCard className="w-5 h-5 text-brand-yellow" />
                      {selectedPaymentMethod === 'mock_card' && <CheckCircle2 className="w-4 h-4 text-brand-red" />}
                    </div>
                    <span className="font-display font-bold text-sm block">Instant Card / UPI</span>
                    <span className="text-[11px] text-brand-cream/50 font-mono">1-Click Fast Checkout</span>
                  </div>

                  <div
                    onClick={() => setValue('paymentMethod', 'razorpay')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'razorpay'
                        ? 'bg-brand-red/10 border-brand-red text-brand-cream'
                        : 'bg-brand-dark border-white/10 text-brand-cream/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <ShieldCheck className="w-5 h-5 text-brand-red" />
                      {selectedPaymentMethod === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-brand-red" />}
                    </div>
                    <span className="font-display font-bold text-sm block">Razorpay Gateway</span>
                    <span className="text-[11px] text-brand-cream/50 font-mono">UPI, NetBanking, Cards</span>
                  </div>

                  <div
                    onClick={() => setValue('paymentMethod', 'cash_on_delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'cash_on_delivery'
                        ? 'bg-brand-red/10 border-brand-red text-brand-cream'
                        : 'bg-brand-dark border-white/10 text-brand-cream/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Flame className="w-5 h-5 text-emerald-400" />
                      {selectedPaymentMethod === 'cash_on_delivery' && <CheckCircle2 className="w-4 h-4 text-brand-red" />}
                    </div>
                    <span className="font-display font-bold text-sm block">Cash on Delivery</span>
                    <span className="text-[11px] text-brand-cream/50 font-mono">Pay when you receive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Review Sidebar */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-brand-dark-surface border border-white/15 shadow-2xl space-y-6 sticky top-28">
              <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight pb-4 border-b border-white/10">
                ITEMS IN ORDER ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-dark flex-shrink-0">
                        <Image
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-display font-bold text-brand-cream block text-xs">
                          {item.quantity}x {item.product.name}
                        </span>
                        {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                          <span className="text-[10px] font-mono text-brand-cream/50 block">
                            {item.selectedCustomizations.map((c) => c.choiceName).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-cream">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 font-mono text-xs text-brand-cream/70 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({coupon?.code})</span>
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
                <div className="flex justify-between text-xl font-display font-black text-brand-cream pt-3 border-t border-white/10">
                  <span>GRAND TOTAL</span>
                  <span className="text-brand-yellow">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-brand-cream font-display font-black text-base uppercase tracking-wider shadow-brand-glow transition-all active:scale-98"
              >
                {isSubmitting ? (
                  <span>DISPATCHING TO GRILL...</span>
                ) : (
                  <>
                    <span>PLACE ORDER NOW</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-[11px] font-mono text-center text-brand-cream/40">
                🔒 256-Bit Encrypted & Verified Server Transactions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
