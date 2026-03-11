'use client';
// ============================================================
// app/customer/page.tsx — Customer Homepage (API-connected)
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import OutfitCard from '@/components/customer/OutfitCard';
import { DESIGNERS } from '@/lib/store';

export default function CustomerHomePage() {
  const [featured, setFeatured] = useState<Record<string,unknown>[]>([]);

  useEffect(() => {
    fetch('/api/outfits?featured=true')
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end grain-overlay overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=1000&fit=crop" alt="Fashion hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 pb-16 lg:pb-24 w-full">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-champagne mb-6 animate-fade-up">Spring / Summer 2024 Collection</p>
            <h1 className="font-display text-6xl lg:text-8xl font-light text-ivory leading-none mb-6 animate-fade-up delay-100">
              Dressed<br /><em className="text-champagne">in</em><br />Intention
            </h1>
            <p className="font-body text-base text-ivory/70 leading-relaxed mb-10 max-w-sm animate-fade-up delay-200">
              Curated ready-to-wear and bespoke atelier services from the world's most captivating independent designers.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link href="/customer/shop" className="btn-champagne">Explore Collection <ArrowRight size={14} /></Link>
              <Link href="/customer/appointments" className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-obsidian">Book Appointment <Calendar size={14} /></Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-obsidian/60 backdrop-blur-sm py-3 border-t border-ivory/10">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array(6).fill('3 DESIGNERS · 40+ PIECES · BESPOKE SERVICES · FREE DELIVERY · ').map((t, i) => (
              <span key={i} className="font-mono text-[10px] tracking-widest text-ivory/50 mr-0">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL INTRO ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">Our Philosophy</p>
            <h2 className="font-display text-5xl lg:text-6xl font-light leading-tight mb-6">Fashion as a<br /><em>Living Art Form</em></h2>
            <p className="font-body text-sm text-slate leading-relaxed mb-4">
              Atelier Noir was founded on the belief that clothing is the most personal form of artistic expression. We partner with independent designers whose work defies trend cycles and speaks instead to lasting beauty.
            </p>
            <p className="font-body text-sm text-slate leading-relaxed mb-8">
              Every piece is made with intention — from sourcing ethical materials to hand-finishing techniques passed down through generations.
            </p>
            <Link href="/customer/about" className="btn-outline">Discover Our Story <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="img-zoom aspect-[3/4] mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop" alt="Atelier" className="w-full h-full object-cover" />
            </div>
            <div className="img-zoom aspect-[3/4] -mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop" alt="Atelier" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PIECES ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-2">Curated Selection</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light">Featured Pieces</h2>
          </div>
          <Link href="/customer/shop" className="hidden sm:flex items-center gap-2 font-body text-xs tracking-widest uppercase hover-underline">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((outfit, i) => (
              <OutfitCard key={outfit.id as string} outfit={outfit as never} index={i} />
            ))}
          </div>
        )}
        <div className="text-center mt-12 sm:hidden">
          <Link href="/customer/shop" className="btn-outline">View All Pieces</Link>
        </div>
      </section>

      {/* ── DESIGNERS STRIP ───────────────────────────────── */}
      <section className="bg-charcoal py-20 lg:py-28">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">The Makers</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-ivory">Meet Our Designers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DESIGNERS.map((designer, i) => (
              <div key={designer.id} className="text-center animate-fade-up" style={{ animationDelay: `${i*150}ms`, animationFillMode:'both', opacity:0 }}>
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 border-2 border-champagne/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={designer.avatar} alt={designer.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-1">{designer.specialty}</p>
                <h3 className="font-display text-2xl text-ivory mb-3">{designer.name}</h3>
                <p className="font-body text-xs text-ivory/50 leading-relaxed max-w-xs mx-auto">{designer.bio}</p>
                <Link href="/customer/designers" className="inline-block mt-4 font-mono text-[10px] tracking-widest uppercase text-champagne hover-underline">
                  View Collection →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT CTA ───────────────────────────────── */}
      <section className="relative py-24 overflow-hidden grain-overlay">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1519657103702-35e3e1f3e7c2?w=1600&h=700&fit=crop" alt="Appointment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-obsidian/70" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-champagne mb-4">Bespoke Services</p>
          <h2 className="font-display text-5xl lg:text-6xl font-light text-ivory mb-6">Create Something<br /><em>Entirely Yours</em></h2>
          <p className="font-body text-sm text-ivory/60 leading-relaxed mb-10">
            Book a private appointment with one of our resident designers. From a single fitting to a fully custom commission — we bring your vision to life.
          </p>
          <Link href="/customer/appointments" className="btn-champagne">Book Your Appointment <Calendar size={14} /></Link>
        </div>
      </section>
    </div>
  );
}
