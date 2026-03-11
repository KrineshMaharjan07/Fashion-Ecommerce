'use client';
// ============================================================
// app/customer/designers/page.tsx — Designer showcase page
// ============================================================
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { DESIGNERS } from '@/lib/store';
import { useOutfitsStore } from '@/lib/state';
import OutfitCard from '@/components/customer/OutfitCard';

export default function DesignersPage() {
  const { outfits } = useOutfitsStore();

  return (
    <div>
      {/* Hero */}
      <section className="bg-charcoal py-20 grain-overlay">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-champagne mb-4">The Makers</p>
          <h1 className="font-display text-6xl lg:text-7xl font-light text-ivory">Our Designers</h1>
        </div>
      </section>

      {/* Designer sections */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        {DESIGNERS.map((designer, i) => {
          const designerOutfits = outfits.filter(o => o.designer === designer.name);
          const isEven = i % 2 === 0;

          return (
            <section key={designer.id} className="mb-24 pb-24 border-b border-sand/30 last:border-0 last:pb-0">
              {/* Designer profile */}
              <div className={`grid lg:grid-cols-2 gap-12 items-center mb-14 ${!isEven ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">{designer.specialty}</p>
                  <h2 className="font-display text-5xl lg:text-6xl font-light mb-4">{designer.name}</h2>
                  <p className="font-body text-sm leading-relaxed text-charcoal mb-6 max-w-md">{designer.bio}</p>
                  <div className="mb-6">
                    <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-2">Availability</p>
                    <div className="flex gap-2 flex-wrap">
                      {designer.availability.map(day => (
                        <span key={day} className="font-mono text-[10px] tracking-wider uppercase bg-sand/20 text-charcoal px-2 py-1">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/customer/appointments" className="btn-primary">
                      <Calendar size={14} /> Book with {designer.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>

                <div className="aspect-[4/3] img-zoom overflow-hidden bg-sand/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={designer.avatar} alt={designer.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Designer's outfits */}
              {designerOutfits.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate">
                      {designerOutfits.length} Pieces in Collection
                    </p>
                    <Link href={`/customer/shop`} className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase hover-underline">
                      View All <ArrowRight size={10} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {designerOutfits.slice(0, 4).map((outfit, j) => (
                      <OutfitCard key={outfit.id} outfit={outfit} index={j} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
