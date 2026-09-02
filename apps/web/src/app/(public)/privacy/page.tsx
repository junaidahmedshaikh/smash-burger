'use client';

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-body text-brand-cream/80">
        <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-brand-cream uppercase tracking-tight">
          PRIVACY POLICY
        </h1>
        <p className="text-sm font-mono text-brand-yellow">Last Updated: September 2026</p>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-brand-cream uppercase">
            1. Information We Collect
          </h2>
          <p className="text-sm leading-relaxed">
            We collect information provided directly by you when placing food delivery orders, creating an
            account, or contacting our test kitchens. This includes your name, delivery address, phone number,
            email, and order preferences.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-brand-cream uppercase">
            2. Payment Security
          </h2>
          <p className="text-sm leading-relaxed">
            All card transactions and UPI payments are processed securely through PCI-DSS certified payment
            gateways (such as Razorpay). We never store raw credit card numbers or banking PINs on our servers.
          </p>
        </section>
      </div>
    </div>
  );
}
