'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  MapPin,
  Flame,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
  Bike,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@smashd/types';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice, formatDate } from '@/lib/utils';
import ApiClient from '@/lib/api';

const STATUS_FILTERS: Array<{ label: string; value: string }> = [
  { label: 'All Orders', value: 'all' },
  { label: 'Received', value: 'received' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Cooking', value: 'cooking' },
  { label: 'Ready', value: 'ready' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

const NEXT_STAGE: Record<OrderStatus, OrderStatus | null> = {
  received: 'preparing',
  preparing: 'cooking',
  cooking: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
  delivered: null,
  cancelled: null,
};

export default function AdminOrdersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!accessToken) return;
    try {
      const data = await ApiClient.getAllOrders(
        accessToken,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setOrders(data);
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [accessToken, statusFilter]);

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = NEXT_STAGE[currentStatus];
    if (!nextStatus || !accessToken) return;

    setIsUpdating(orderId);
    try {
      await ApiClient.updateOrderStatus(orderId, nextStatus, accessToken);
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Could not advance status');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
            DISPATCH & KITCHEN LINE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-cream uppercase tracking-tight">
            LIVE ORDERS MANAGEMENT
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-mono text-xs font-bold uppercase transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Line</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase whitespace-nowrap transition-all ${
              statusFilter === f.value
                ? 'bg-brand-red text-white shadow-brand-glow'
                : 'bg-brand-dark-surface border border-white/10 text-brand-cream/60 hover:text-brand-cream'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-3xl bg-brand-dark-surface animate-pulse border border-white/5" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 rounded-3xl bg-brand-dark-surface border border-white/10 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-display font-bold text-2xl text-brand-cream">ALL CLEAR!</h3>
          <p className="text-xs text-brand-cream/60 max-w-sm mx-auto">
            No pending tickets in this category. Smashed fresh and dispatched on time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const nextStatus = NEXT_STAGE[order.orderStatus];
            const isProcessing = isUpdating === (order._id || order.id);

            return (
              <div
                key={order._id || order.id}
                className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-white/20 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display font-black text-xl text-brand-cream">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-brand-cream/50">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs text-brand-cream/80 font-body space-y-1">
                    <div>
                      <strong className="text-brand-cream">{order.customerDetails.name}</strong> •{' '}
                      <span className="font-mono text-brand-cream/60">{order.customerDetails.phone}</span>
                    </div>
                    <div className="text-brand-cream/60">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city} (PIN: {order.deliveryAddress.pincode})
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.items?.map((item: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-brand-cream"
                      >
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>

                  {order.customerNotes && (
                    <p className="text-xs font-mono text-brand-yellow/80 bg-brand-yellow/5 px-3 py-1.5 rounded-xl border border-brand-yellow/20 inline-block">
                      Note: &ldquo;{order.customerNotes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  <span className="font-mono font-black text-2xl text-brand-yellow">
                    {formatPrice(order.total)}
                  </span>

                  {nextStatus && (
                    <button
                      onClick={() => handleAdvanceStatus(order._id || order.id, order.orderStatus)}
                      disabled={isProcessing}
                      className="px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-brand-cream font-display font-bold text-xs uppercase tracking-wider shadow-brand-glow transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>
                        {isProcessing ? 'Updating...' : `Advance → ${nextStatus.replace(/_/g, ' ')}`}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
