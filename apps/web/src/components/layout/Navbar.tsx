"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  Flame,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { openCartDrawer, isMobileNavOpen, openMobileNav, closeMobileNav } =
    useUIStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "MENU", href: "/menu" },
    { name: "OUR CRAFT", href: "/about" },
    { name: "LOCATIONS", href: "/contact" },
  ];

  const isAdmin = user?.role === "admin" || user?.role === "manager";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-brand-dark/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-brand-cream shadow-brand-glow group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-current text-brand-cream animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter text-brand-cream leading-none group-hover:text-brand-red transition-colors">
                SMASH
              </span>
              <span className="text-[10px] tracking-[0.25em] text-brand-yellow font-bold uppercase">
                BURGER
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-display text-sm tracking-wider font-bold transition-all relative py-1 ${
                    isActive
                      ? "text-brand-red"
                      : "text-brand-cream/80 hover:text-brand-cream"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-mono font-bold hover:bg-brand-yellow/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                ADMIN PORTAL
              </Link>
            )}

            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-brand-cream/90 hover:text-brand-cream border border-white/10 transition-colors"
              aria-label="Account Profile"
            >
              <UserIcon className="w-5 h-5" />
            </Link>

            <button
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-sm shadow-brand-glow transition-all active:scale-95"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">BAG</span>
              {itemCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-cream text-brand-dark font-mono text-xs font-black">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={openMobileNav}
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-cream"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-2xl flex flex-col p-6 md:hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <Link
              href="/"
              onClick={closeMobileNav}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-brand-cream">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="font-display font-black text-xl text-brand-cream">
                SMASH BURGER
              </span>
            </Link>
            <button
              onClick={closeMobileNav}
              className="p-2 rounded-full bg-white/10 text-brand-cream"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileNav}
                className="font-display font-black text-4xl text-brand-cream hover:text-brand-red transition-colors tracking-tight"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMobileNav}
                className="font-display font-bold text-2xl text-brand-yellow hover:text-brand-yellow-light transition-colors"
              >
                ADMIN DASHBOARD
              </Link>
            )}
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              onClick={closeMobileNav}
              className="font-display font-bold text-2xl text-brand-cream/80 hover:text-brand-cream transition-colors"
            >
              {isAuthenticated ? "MY PROFILE & ORDERS" : "SIGN IN / REGISTER"}
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 text-center text-xs text-brand-cream/50 font-mono">
            SMASHED FRESH • CRAFTED WITH FIRE
          </div>
        </div>
      )}
    </>
  );
}
