'use client';
// ============================================================
// components/customer/CartDrawer.tsx — Cart with API-fetched outfits
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Loader } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/state';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQty } = useCartStore();

  // Fetch outfit details from API for each item in cart
  const [outfitMap, setOutfitMap] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartOpen || items.length === 0) return;

    // Find which outfitIds we don't have yet
    const missing = items.map(i => i.outfitId).filter(id => !outfitMap[id]);
    if (missing.length === 0) return;

    setLoading(true);
    Promise.all(
      missing.map(id =>
        fetch(`/api/outfits/${id}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const newMap: Record<string, Record<string, unknown>> = {};
      results.forEach((data, i) => {
        if (data) newMap[missing[i]] = data;
      });
      setOutfitMap(prev => ({ ...prev, ...newMap }));
    }).finally(() => setLoading(false));
  }, [cartOpen, items, outfitMap]);

  const cartTotal = items.reduce((sum, item) => {
    const outfit = outfitMap[item.outfitId];
    return sum + ((outfit?.price as number) || 0) * item.quantity;
  }, 0);

  if (!cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-obsidian/30 backdrop-blur-sm animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-ivory shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand/40">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} />
            <span className="font-body text-xs tracking-widest uppercase">Your Selection</span>
            <span className="font-mono text-xs text-slate">({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1 hover:opacity-60 transition-opacity">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate">
              <ShoppingBag size={40} strokeWidth={1} />
              <p className="font-body text-sm tracking-wide">Your selection is empty</p>
              <button onClick={() => setCartOpen(false)} className="btn-outline text-xs py-2 px-4">
                Continue Browsing
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-32 gap-3 text-slate">
              <Loader size={18} className="animate-spin" />
              <span className="font-mono text-xs tracking-widest">Loading…</span>
            </div>
          ) : (
            items.map((item) => {
              const outfit = outfitMap[item.outfitId];
              const images = (outfit?.images as string[]) || [];
              return (
                <div key={`${item.outfitId}-${item.size}`} className="flex gap-4 py-4 border-b border-sand/20">
                  <div className="w-24 h-32 img-zoom flex-shrink-0 bg-sand/20">
                    {images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[0]} alt={outfit?.name as string} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg leading-tight">
                      {outfit ? (outfit.name as string) : <span className="text-slate text-sm">Loading…</span>}
                    </p>
                    {outfit && <p className="font-body text-xs text-slate mt-0.5">{outfit.designer as string}</p>}
                    <p className="font-mono text-xs text-slate mt-0.5 tracking-widest">SIZE {item.size}</p>
                    <p className="font-body text-sm mt-2">
                      {outfit ? formatPrice((outfit.price as number) * item.quantity) : '—'}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQty(item.outfitId, item.size, item.quantity - 1)}
                        className="w-7 h-7 border border-sand flex items-center justify-center hover:bg-sand/20 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.outfitId, item.size, item.quantity + 1)}
                        className="w-7 h-7 border border-sand flex items-center justify-center hover:bg-sand/20 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.outfitId, item.size)}
                        className="ml-auto text-xs text-slate hover:text-obsidian underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-sand/40 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-xs tracking-widest uppercase text-slate">Subtotal</span>
              <span className="font-display text-2xl">{formatPrice(cartTotal)}</span>
            </div>
            <p className="font-body text-xs text-slate">Shipping & taxes calculated at checkout.</p>
            <Link
              href="/customer/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
