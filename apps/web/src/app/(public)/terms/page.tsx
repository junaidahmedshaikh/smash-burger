'use client';

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body text-brand-cream/80">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-cream uppercase tracking-tight">
          TERMS OF SERVICE
        </h1>
        <p className="text-sm font-mono text-brand-yellow">Last Updated: September 2026</p>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-brand-cream uppercase">
            1. Kitchen Orders & Fresh Preparation
          </h2>
          <p className="text-sm leading-relaxed">
            All gourmet burgers, sides, and shakes are prepared fresh to order. We strive to fulfill all
            orders within the estimated preparation and delivery window (typically 25-35 minutes).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-brand-cream uppercase">
            2. Cancellation & Refunds
          </h2>
          <p className="text-sm leading-relaxed">
            Because our smash patties and brioche buns are cooked fresh immediately upon receiving an order,
            orders can only be modified or cancelled before the kitchen marks the status as &ldquo;Cooking&rdquo;.
          </p>
        </section>
      </div>
    </div>
  );
}
