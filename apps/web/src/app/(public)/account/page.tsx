'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ArrowRight, Clock, Star, Flame, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { IOrder } from '@smashd/types';
import { formatPrice, formatDate } from '@/lib/utils';
import ApiClient from '@/lib/api';

export default function AccountPage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, logout } = useAuthStore();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    async function loadOrders() {
      if (!accessToken) return;
      try {
        const data = await ApiClient.getMyOrders(accessToken);
        setOrders(data);
      } catch (e) {
        // Fallback
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [isAuthenticated, accessToken, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'manager';

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Section */}
        <div className="p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-2xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center text-brand-cream shadow-brand-glow">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-cream uppercase">
                  {user.name}
                </h1>
                {isAdmin && (
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono text-brand-cream/60">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-display font-bold text-xs uppercase hover:bg-brand-yellow/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>ADMIN DASHBOARD</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-cream/80 hover:text-brand-cream hover:bg-white/10 font-display font-bold text-xs uppercase transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-brand-red" />
              <h2 className="font-display font-black text-2xl text-brand-cream uppercase tracking-tight">
                PAST ORDERS ({orders.length})
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-xs font-mono text-brand-yellow hover:underline font-bold uppercase"
            >
              + Order New Craving
            </Link>
          </div>

          {isLoadingOrders ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-3xl bg-brand-dark-surface animate-pulse border border-white/5" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-brand-dark-surface border border-white/10 text-center space-y-4">
              <Package className="w-10 h-10 text-brand-cream/30 mx-auto" />
              <h3 className="font-display font-bold text-xl text-brand-cream">NO ORDERS YET</h3>
              <p className="text-xs text-brand-cream/60 max-w-xs mx-auto">
                Ready to experience the 450°F crispy smash crust?
              </p>
              <Link
                href="/menu"
                className="inline-block px-6 py-3 rounded-full bg-brand-red text-brand-cream font-display font-bold text-xs uppercase shadow-brand-glow"
              >
                BROWSE MENU
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-black text-lg text-brand-cream">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-brand-cream/60 font-mono">
                      {formatDate(order.createdAt)} • {order.items?.length} item(s)
                    </p>

                    <div className="text-xs text-brand-cream/80 font-body">
                      {order.items?.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <span className="font-mono font-black text-xl text-brand-yellow">
                      {formatPrice(order.total)}
                    </span>
                    <Link
                      href={`/order/${order.orderNumber || order._id || order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-cream font-display font-bold text-xs uppercase transition-colors"
                    >
                      <span>TRACK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
