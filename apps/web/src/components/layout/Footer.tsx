"use client";

import Link from "next/link";
import {
  Flame,
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark-surface border-t border-white/10 pt-20 pb-12 overflow-hidden relative">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="flex items-center gap-3 mb-6 group inline-flex"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-brand-cream shadow-brand-glow">
                  <Flame className="w-7 h-7 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-3xl tracking-tighter text-brand-cream">
                    SMASH
                  </span>
                  <span className="text-xs tracking-[0.25em] text-brand-yellow font-bold uppercase">
                    BURGER
                  </span>
                </div>
              </Link>
              <p className="text-brand-cream/70 text-base max-w-sm leading-relaxed mb-8 font-body">
                Redefining the burger experience with crispy lace-edged Angus
                smash patties, artisan sauces, and milk brioche buns. Smashed to
                order, never frozen.
              </p>
            </div>

            <div className="flex items-center gap-3 text-brand-cream/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-sm tracking-wider text-brand-cream uppercase mb-6">
              EXPLORE
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/menu"
                  className="text-brand-cream/70 hover:text-brand-red transition-colors"
                >
                  Our Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-brand-cream/70 hover:text-brand-red transition-colors"
                >
                  The Craft & Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-brand-cream/70 hover:text-brand-red transition-colors"
                >
                  Kitchen Locations
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-brand-cream/70 hover:text-brand-red transition-colors"
                >
                  Order Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Kitchen Cities */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-sm tracking-wider text-brand-cream uppercase mb-6">
              LOCATIONS
            </h4>
            <ul className="space-y-3 font-body text-sm text-brand-cream/70">
              <li className="flex items-center gap-1.5">
                <span>Mumbai (Bandra)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Bengaluru (Indiranagar)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Delhi NCR (Gurugram)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Hyderabad (Jubilee Hills)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Pune (Koregaon Park)</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Club */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-sm tracking-wider text-brand-cream uppercase mb-4">
              JOIN THE SMASH CLUB
            </h4>
            <p className="text-xs text-brand-cream/60 mb-4">
              Get secret drops, exclusive tasting event invites, and 20% off
              your first online order.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:border-brand-red flex-1"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-xl bg-brand-red text-brand-cream font-display font-bold text-xs hover:bg-brand-red-hover transition-colors"
                aria-label="Subscribe"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Big Editorial Marquee in Footer */}
        <div className="py-8 border-y border-white/10 my-8 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white/5 mx-4 sm:mx-6 select-none"
              >
                UNAPOLOGETIC FLAVOR • 100% FRESH • SMASHED TO ORDER •
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-cream/50 pt-4">
          <p>© 2026 Smash Burger Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-brand-cream transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-brand-cream transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
