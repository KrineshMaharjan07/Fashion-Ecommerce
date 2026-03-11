'use client';
// ============================================================
// components/customer/OutfitCard.tsx — Product card
// ============================================================
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Outfit } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface Props {
  outfit: Outfit;
  index?: number;
}

export default function OutfitCard({ outfit, index = 0 }: Props) {
  const delay = Math.min(index * 100, 500);

  return (
    <div
      className={`group animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both', opacity: 0 }}
    >
      <Link href={`/customer/shop/${outfit.id}`}>
        {/* Image */}
        <div className="relative img-zoom aspect-[3/4] bg-sand/20 overflow-hidden mb-4">
          {outfit.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={outfit.images[0]}
              alt={outfit.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate font-mono text-xs">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {outfit.featured && (
              <span className="bg-champagne text-obsidian text-[10px] font-mono tracking-widest uppercase px-2 py-0.5">
                Featured
              </span>
            )}
            {!outfit.inStock && (
              <span className="bg-obsidian text-ivory text-[10px] font-mono tracking-widest uppercase px-2 py-0.5">
                Sold Out
              </span>
            )}
            {outfit.originalPrice && (
              <span className="bg-blush text-obsidian text-[10px] font-mono tracking-widest uppercase px-2 py-0.5">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist btn */}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-ivory/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory"
            onClick={(e) => { e.preventDefault(); }}
            aria-label="Add to wishlist"
          >
            <Heart size={14} />
          </button>

          {/* Quick category */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-obsidian/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="font-mono text-[10px] tracking-widest uppercase text-ivory/80">
              {outfit.category} · {outfit.sizes.join(' ')}
            </p>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-1">{outfit.designer}</p>
        <Link href={`/customer/shop/${outfit.id}`}>
          <h3 className="font-display text-xl leading-tight hover:text-slate transition-colors">{outfit.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-body text-sm text-obsidian">{formatPrice(outfit.price)}</span>
          {outfit.originalPrice && (
            <span className="font-body text-xs text-slate line-through">{formatPrice(outfit.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
