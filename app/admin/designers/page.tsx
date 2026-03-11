'use client';
// ============================================================
// app/admin/designers/page.tsx — Designers overview
// ============================================================
import { useOutfitsStore } from '@/lib/state';
import { DESIGNERS } from '@/lib/store';
import { Users, ShoppingBag, Calendar } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDesignersPage() {
  const { outfits, orders, appointments } = useOutfitsStore();

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Roster</p>
        <h1 className="font-display text-4xl font-light mt-1">Designers</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {DESIGNERS.map(designer => {
          const designerOutfits = outfits.filter(o => o.designer === designer.name);
          const designerOrders = orders.filter(o =>
            o.items.some(item => designerOutfits.find(outfit => outfit.id === item.outfitId))
          );
          const designerRevenue = designerOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((s, o) => {
              const itemRevenue = o.items.reduce((sum, item) => {
                const outfit = designerOutfits.find(outfit => outfit.id === item.outfitId);
                return sum + (outfit?.price || 0) * item.quantity;
              }, 0);
              return s + itemRevenue;
            }, 0);
          const designerAppointments = appointments.filter(a => a.designerId === designer.id);

          return (
            <div key={designer.id} className="admin-card">
              {/* Designer header */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#EDE8DF]">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={designer.avatar} alt={designer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-champagne">{designer.specialty}</p>
                  <p className="font-display text-xl">{designer.name}</p>
                  <p className="font-body text-xs text-slate mt-0.5">
                    Available: {designer.availability.join(', ')}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-[#F7F4EF]">
                  <ShoppingBag size={14} className="mx-auto text-champagne mb-1" />
                  <p className="font-display text-2xl">{designerOutfits.length}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Pieces</p>
                </div>
                <div className="text-center p-3 bg-[#F7F4EF]">
                  <Calendar size={14} className="mx-auto text-champagne mb-1" />
                  <p className="font-display text-2xl">{designerAppointments.length}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Apts</p>
                </div>
                <div className="text-center p-3 bg-[#F7F4EF]">
                  <Users size={14} className="mx-auto text-champagne mb-1" />
                  <p className="font-display text-2xl">{designerOrders.length}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Orders</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-body text-xs text-slate">Total Revenue</p>
                <p className="font-display text-xl">{formatPrice(designerRevenue)}</p>
              </div>

              {/* Bio */}
              <p className="font-body text-xs text-slate leading-relaxed mt-4 pt-4 border-t border-[#EDE8DF]">
                {designer.bio}
              </p>

              {/* Collection preview */}
              {designerOutfits.length > 0 && (
                <div className="flex gap-1.5 mt-4">
                  {designerOutfits.slice(0, 4).map(outfit => (
                    <div key={outfit.id} className="w-12 h-14 overflow-hidden bg-sand/20 flex-shrink-0">
                      {outfit.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={outfit.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                  {designerOutfits.length > 4 && (
                    <div className="w-12 h-14 bg-sand/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-[10px] text-slate">+{designerOutfits.length - 4}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
