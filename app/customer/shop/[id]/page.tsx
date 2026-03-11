'use client';
// ============================================================
// app/customer/shop/[id]/page.tsx — Product detail (API)
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Calendar, Check, Loader } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/state';
import { formatPrice } from '@/lib/utils';
import { Size } from '@/lib/store';
import OutfitCard from '@/components/customer/OutfitCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();

  const [outfit, setOutfit] = useState<Record<string, unknown> | null>(null);
  const [related, setRelated] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`/api/outfits/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setOutfit(data);
        // Fetch related
        return fetch(`/api/outfits?category=${data.category}`).then(r => r.json());
      })
      .then((all: Record<string, unknown>[]) => {
        setRelated(all.filter(o => o.id !== params.id).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedSize || !outfit) return;
    addItem(outfit.id as string, selectedSize);
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); setCartOpen(true); }, 800);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gap-3 text-slate">
      <Loader size={20} className="animate-spin" />
      <span className="font-mono text-xs tracking-widest">Loading…</span>
    </div>
  );
  if (!outfit) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="font-display text-3xl text-slate">Piece not found</p>
      <Link href="/customer/shop" className="btn-outline">Back to Shop</Link>
    </div>
  );

  const images = (outfit.images as string[]) || [];
  const sizes = (outfit.sizes as Size[]) || [];
  const details = (outfit.details as string[]) || [];
  const tags = (outfit.tags as string[]) || [];

  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-center gap-2 mb-8 font-mono text-[10px] tracking-widest uppercase text-slate">
          <Link href="/customer/shop" className="flex items-center gap-1 hover:text-obsidian transition-colors">
            <ChevronLeft size={12} /> Shop
          </Link>
          <span>/</span>
          <span className="text-champagne">{outfit.category as string}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] img-zoom overflow-hidden bg-sand/10 mb-3">
              {images[selectedImage] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[selectedImage]} alt={outfit.name as string} className="w-full h-full object-cover" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-obsidian' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-4">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-2">{outfit.category as string}</p>
            <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">{outfit.name as string}</h1>
            <p className="font-body text-sm text-slate mb-6">by {outfit.designer as string}</p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl">{formatPrice(outfit.price as number)}</span>
              {outfit.originalPrice && (
                <span className="font-body text-sm text-slate line-through">{formatPrice(outfit.originalPrice as number)}</span>
              )}
            </div>

            <p className="font-body text-sm leading-relaxed text-charcoal mb-8 border-l-2 border-champagne pl-4">
              {outfit.description as string}
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] tracking-widest uppercase text-slate">Select Size</p>
                {!selectedSize && <p className="font-mono text-[10px] text-blush">Please select a size</p>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['XS','S','M','L','XL','XXL'] as Size[]).map(size => {
                  const available = sizes.includes(size);
                  return (
                    <button key={size} disabled={!available} onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border font-mono text-xs transition-all ${!available ? 'border-sand/30 text-sand/40 cursor-not-allowed line-through' : selectedSize === size ? 'border-obsidian bg-obsidian text-ivory' : 'border-sand text-charcoal hover:border-obsidian'}`}>
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={!selectedSize || !outfit.inStock}
                className={`btn-primary flex-1 justify-center ${(!selectedSize || !outfit.inStock) ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {addedToCart ? <><Check size={14} /> Added to Bag</> :
                 outfit.inStock ? <><ShoppingBag size={14} /> Add to Bag</> : 'Sold Out'}
              </button>
              <Link href="/customer/appointments" className="btn-outline sm:flex-none justify-center">
                <Calendar size={14} /> Custom Order
              </Link>
            </div>

            <div className="border-t border-sand/30 pt-6">
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-4">Details</p>
              <ul className="space-y-2">
                {details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-charcoal">
                    <span className="text-champagne mt-1">—</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="font-mono text-[10px] tracking-widest uppercase bg-sand/20 px-2 py-1 text-slate">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16 border-t border-sand/30">
          <h2 className="font-display text-3xl lg:text-4xl font-light mb-10">More from this category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((o, i) => <OutfitCard key={o.id as string} outfit={o as never} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
