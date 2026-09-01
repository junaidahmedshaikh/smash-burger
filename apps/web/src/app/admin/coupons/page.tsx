'use client';

import { useState } from 'react';
import { Tag, Plus, CheckCircle2, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const DEMO_COUPONS = [
  {
    code: 'FIRSTBITE20',
    type: 'percentage',
    value: 20,
    minOrder: 399,
    maxDiscount: 150,
    usedCount: 14,
    limit: 1000,
    status: 'Active',
  },
  {
    code: 'SMASHD100',
    type: 'fixed',
    value: 100,
    minOrder: 499,
    maxDiscount: null,
    usedCount: 22,
    limit: 500,
    status: 'Active',
  },
  {
    code: 'CHEESEFEST50',
    type: 'fixed',
    value: 50,
    minOrder: 299,
    maxDiscount: null,
    usedCount: 5,
    limit: 300,
    status: 'Active',
  },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-1">
            DISCOUNTS & REWARDS
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-cream uppercase tracking-tight">
            PROMO CODES
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_COUPONS.map((c) => (
          <div
            key={c.code}
            className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-display font-black text-2xl text-brand-yellow tracking-wider">
                {c.code}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">
                {c.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-brand-cream/70">
              <div className="flex justify-between">
                <span>Discount Value:</span>
                <strong className="text-brand-cream">
                  {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Minimum Order:</span>
                <span>{formatPrice(c.minOrder)}</span>
              </div>
              {c.maxDiscount && (
                <div className="flex justify-between">
                  <span>Max Discount Cap:</span>
                  <span>{formatPrice(c.maxDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Redemptions:</span>
                <span>
                  {c.usedCount} / {c.limit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
