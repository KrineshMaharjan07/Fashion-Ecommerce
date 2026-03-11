'use client';
// ============================================================
// components/customer/Navbar.tsx — Customer-facing navigation
// ============================================================
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/state';
import { useOutfitsStore } from '@/lib/state';

export default function CustomerNavbar() {
  const { items } = useCartStore();
  const { toggleCart, mobileMenuOpen, toggleMobileMenu } = useUIStore();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { href: '/customer/shop', label: 'Shop' },
    { href: '/customer/designers', label: 'Designers' },
    { href: '/customer/appointments', label: 'Book Appointment' },
    { href: '/customer/about', label: 'About' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-sand/30">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/customer" className="font-display text-2xl lg:text-3xl tracking-widest text-obsidian font-light">
              ATELIER<span className="text-champagne">·</span>NOIR
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover-underline font-body text-xs tracking-widest uppercase text-charcoal hover:text-obsidian transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-charcoal hover:text-obsidian transition-colors" aria-label="Search">
                <Search size={18} />
              </button>
              <button
                onClick={toggleCart}
                className="relative p-2 text-charcoal hover:text-obsidian transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-obsidian text-ivory text-[10px] font-mono flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden p-2 text-charcoal hover:text-obsidian"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-ivory pt-16 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className={`font-display text-3xl font-light tracking-wide text-charcoal hover:text-obsidian animate-fade-up delay-${(i + 1) * 100}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
