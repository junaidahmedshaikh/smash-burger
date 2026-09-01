'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  Tag,
  MessageSquare,
  Users,
  Settings,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const navItems = [
    { name: 'Analytics & KPIs', href: '/admin', icon: LayoutDashboard },
    { name: 'Live Kitchen Orders', href: '/admin/orders', icon: Package },
    { name: 'Product Catalog', href: '/admin/products', icon: UtensilsCrossed },
    { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row text-brand-cream">
      <aside className="w-full md:w-64 bg-brand-dark-surface border-r border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-brand-cream">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-brand-cream leading-tight block">
                  SMASH BURGER
                </span>
                <span className="text-[9px] font-mono text-brand-yellow tracking-widest font-bold block">
                  COMMAND CENTER
                </span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-brand-glow'
                      : 'text-brand-cream/70 hover:bg-white/5 hover:text-brand-cream'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono text-brand-cream/60 hover:text-brand-cream hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront Front-End</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono text-brand-red hover:bg-brand-red/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
