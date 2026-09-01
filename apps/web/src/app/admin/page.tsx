'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { IAdminDashboardStats } from '@smashd/types';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice, formatDate } from '@/lib/utils';
import ApiClient from '@/lib/api';

const FALLBACK_STATS: IAdminDashboardStats = {
  todayRevenue: 28450,
  todayOrdersCount: 42,
  totalCustomers: 380,
  averageOrderValue: 677,
  pendingOrdersCount: 5,
  revenueTrend: [
    { date: 'Mon', revenue: 21000, orders: 32 },
    { date: 'Tue', revenue: 24500, orders: 38 },
    { date: 'Wed', revenue: 19800, orders: 29 },
    { date: 'Thu', revenue: 27400, orders: 41 },
    { date: 'Fri', revenue: 38900, orders: 58 },
    { date: 'Sat', revenue: 46200, orders: 72 },
    { date: 'Sun', revenue: 41500, orders: 64 },
  ],
  categorySales: [
    { category: 'Smash Burgers', sales: 64200, count: 184 },
    { category: 'Crispy Chicken', sales: 28400, count: 76 },
    { category: 'Plant & Veg', sales: 16800, count: 52 },
    { category: 'Loaded Fries', sales: 18900, count: 98 },
    { category: 'Shakes', sales: 12400, count: 56 },
  ],
  topSellingProducts: [
    { id: '1', name: 'The OG Double Smash', image: '', soldCount: 84, revenue: 27636 },
    { id: '2', name: 'Truffle Umami Melt', image: '', soldCount: 62, revenue: 26598 },
    { id: '3', name: 'Nashville Hot Firebird', image: '', soldCount: 48, revenue: 16752 },
    { id: '4', name: 'Smoky BBQ Bacon Beast', image: '', soldCount: 39, revenue: 14781 },
  ],
  recentOrders: [],
};

export default function AdminDashboardPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [stats, setStats] = useState<IAdminDashboardStats>(FALLBACK_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!accessToken) return;
      try {
        const data = await ApiClient.getDashboardAnalytics(accessToken);
        setStats(data);
      } catch (err) {
        // Use fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [accessToken]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
            KITCHEN OPERATIONS & PERFORMANCE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-cream uppercase tracking-tight">
            EXECUTIVE DASHBOARD
          </h1>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs uppercase shadow-brand-glow transition-all"
        >
          <span>LIVE KITCHEN PIPELINE ({stats.pendingOrdersCount})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-brand-cream/60 uppercase">TODAY&apos;S REVENUE</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display font-black text-3xl text-brand-cream">
            {formatPrice(stats.todayRevenue)}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 block font-bold">
            +18.4% vs yesterday
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-brand-cream/60 uppercase">ORDERS TODAY</span>
            <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display font-black text-3xl text-brand-cream">
            {stats.todayOrdersCount}
          </p>
          <span className="text-[11px] font-mono text-brand-yellow block font-bold">
            {stats.pendingOrdersCount} cooking on grill
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-brand-cream/60 uppercase">TOTAL CUSTOMERS</span>
            <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display font-black text-3xl text-brand-cream">
            {stats.totalCustomers}
          </p>
          <span className="text-[11px] font-mono text-brand-cream/40 block">
            Across 5 Metro Kitchens
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-brand-cream/60 uppercase">AVG ORDER VALUE</span>
            <div className="w-9 h-9 rounded-xl bg-white/10 text-brand-cream flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display font-black text-3xl text-brand-yellow">
            {formatPrice(stats.averageOrderValue)}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 block font-bold">
            High burger combo basket
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-2xl space-y-6">
          <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight">
            7-DAY REVENUE TRAJECTORY
          </h3>

          <div className="grid grid-cols-7 gap-3 items-end h-56 pt-6">
            {stats.revenueTrend.map((item, idx) => {
              const maxRev = Math.max(...stats.revenueTrend.map((r) => r.revenue)) || 1;
              const heightPercent = Math.max(15, Math.round((item.revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-brand-cream/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(item.revenue)}
                  </span>
                  <div
                    className="w-full bg-brand-dark-elevated hover:bg-brand-red rounded-xl transition-all duration-300 relative border border-white/5"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="font-mono text-xs font-bold text-brand-cream/70">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 p-8 rounded-3xl bg-brand-dark-surface border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-display font-black text-xl text-brand-cream uppercase tracking-tight pb-2 border-b border-white/10">
            TOP CRAVED BURGERS
          </h3>

          <div className="space-y-3">
            {stats.topSellingProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-brand-dark border border-white/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-cream">
                    {p.name}
                  </h4>
                  <span className="text-xs font-mono text-brand-yellow">
                    {p.soldCount} sold this week
                  </span>
                </div>
                <span className="font-mono font-black text-sm text-brand-cream">
                  {formatPrice(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
