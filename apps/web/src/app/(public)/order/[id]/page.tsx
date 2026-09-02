'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  ChefHat,
  PackageCheck,
  Bike,
  Sparkles,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@smashd/types';
import { formatPrice, formatDate } from '@/lib/utils';
import ApiClient from '@/lib/api';

const STAGES: Array<{
  status: OrderStatus;
  label: string;
  subtext: string;
  icon: any;
}> = [
  {
    status: 'received',
    label: 'Order Confirmed',
    subtext: 'Ticket printed & kitchen alerted',
    icon: CheckCircle2,
  },
  {
    status: 'preparing',
    label: 'Mise en Place',
    subtext: 'Fresh patties & brioche prepped',
    icon: ChefHat,
  },
  {
    status: 'cooking',
    label: 'Iron Grilling 450°F',
    subtext: 'Smashing crispy lace edges',
    icon: Flame,
  },
  {
    status: 'ready',
    label: 'Packed in Heat-Shield',
    subtext: 'Vapor-vented box sealed',
    icon: PackageCheck,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    subtext: 'Rider en route to your doorstep',
    icon: Bike,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    subtext: 'Enjoy the bold smash flavor!',
    icon: Sparkles,
  },
];

const STAGE_ORDER: OrderStatus[] = [
  'received',
  'preparing',
  'cooking',
  'ready',
  'out_for_delivery',
  'delivered',
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (isManual = false) => {
    if (!orderId) return;
    if (isManual) setIsRefreshing(true);
    try {
      const data = await ApiClient.getOrderById(orderId);
      setOrder(data);
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center">
        <Flame className="w-10 h-10 text-brand-red animate-pulse mb-3" />
        <span className="font-mono text-sm text-brand-yellow">RETRIEVING ORDER STATUS...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-dark flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-display font-black text-3xl text-brand-cream mb-3">ORDER NOT FOUND</h2>
        <p className="text-sm text-brand-cream/60 mb-6">Could not locate order ID: {orderId}</p>
        <Link
          href="/menu"
          className="px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase"
        >
          BACK TO MENU
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGE_ORDER.indexOf(order.orderStatus);

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest">
                LIVE ORDER TRACKER
              </span>
              <button
                onClick={() => fetchOrder(true)}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-cream/60 hover:text-brand-cream transition-colors text-xs flex items-center gap-1 font-mono"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-brand-cream uppercase tracking-tight">
              {order.orderNumber}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-brand-cream/50 uppercase block">ESTIMATED ARRIVAL</span>
            <span className="font-display font-black text-2xl text-emerald-400">
              ~25-35 MINS
            </span>
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-2xl mb-12">
          <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight mb-8">
            KITCHEN PROGRESS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STAGES.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.status}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-brand-red/15 border-brand-red text-brand-cream shadow-brand-glow'
                      : isPast
                      ? 'bg-white/5 border-emerald-500/30 text-brand-cream/80'
                      : 'bg-brand-dark border-white/5 text-brand-cream/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCurrent
                          ? 'bg-brand-red text-white'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/5 text-brand-cream/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold">0{idx + 1}</span>
                  </div>

                  <h4 className="font-display font-black text-lg text-brand-cream tracking-tight mb-1">
                    {stage.label}
                  </h4>
                  <p className="text-xs font-body text-brand-cream/60">{stage.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-6">
            <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight pb-4 border-b border-white/10">
              RECEIPT BREAKDOWN
            </h3>

            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                  <div>
                    <span className="font-display font-bold text-brand-cream block">
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <span className="text-xs font-mono text-brand-cream/50">
                        {item.selectedCustomizations.map((c: any) => c.choiceName).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-brand-cream">
                    {formatPrice(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 font-mono text-xs text-brand-cream/70 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({order.couponCode})</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-display font-black text-brand-cream pt-3 border-t border-white/10">
                <span>TOTAL PAID</span>
                <span className="text-brand-yellow">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-6">
            <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight pb-4 border-b border-white/10">
              DELIVERING TO
            </h3>

            <div className="space-y-4 text-sm font-body text-brand-cream/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-cream">{order.customerDetails.name}</strong>
                  <span>{order.deliveryAddress.street}</span>
                  {order.deliveryAddress.landmark && <span className="block text-xs text-brand-cream/60">Landmark: {order.deliveryAddress.landmark}</span>}
                  <span className="block font-mono text-xs text-brand-cream/60">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                <span className="font-mono text-xs">{order.customerDetails.phone}</span>
              </div>

              {order.customerNotes && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-brand-cream/70 font-mono">
                  Kitchen Notes: &ldquo;{order.customerNotes}&rdquo;
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/menu"
                className="w-full inline-flex items-center justify-center py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-xs uppercase tracking-wider transition-colors"
              >
                ORDER MORE CRAVINGS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
