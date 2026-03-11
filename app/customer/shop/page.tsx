'use client';
// ============================================================
// app/customer/shop/page.tsx — Shop listing (API-connected)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, X, Loader } from 'lucide-react';
import OutfitCard from '@/components/customer/OutfitCard';
import { Category, Size } from '@/lib/store';
import { CATEGORY_LABELS } from '@/lib/utils';

const CATEGORIES: Category[] = ['evening', 'casual', 'bridal', 'resort', 'couture'];
const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
];

export default function ShopPage() {
  const [outfits, setOutfits] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort };
      if (selectedCats.length === 1) params.category = selectedCats[0];
      if (inStockOnly) params.inStock = 'true';
      const qs = new URLSearchParams(params).toString();
      const data = await fetch(`/api/outfits?${qs}`).then(r => r.json());
      setOutfits(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCats, inStockOnly, sort]);

  useEffect(() => { fetchOutfits(); }, [fetchOutfits]);

  const toggleFilter = <T,>(arr: T[], val: T, setter: (v: T[]) => void) =>
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  // Client-side size filter (sizes not stored as separate field in DB query)
  const filtered = outfits.filter(o =>
    selectedSizes.length === 0 ||
    (Array.isArray(o.sizes) && (o.sizes as string[]).some(s => selectedSizes.includes(s as Size)))
  );

  const activeFilters = [...selectedCats, ...selectedSizes, ...(inStockOnly ? ['In Stock'] : [])];

  return (
    <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-2">Our Collection</p>
        <h1 className="font-display text-5xl lg:text-6xl font-light">The Shop</h1>
      </div>

      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">Category</p>
              <ul className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button onClick={() => toggleFilter(selectedCats, cat, setSelectedCats)}
                      className={`flex items-center gap-2 font-body text-sm w-full text-left transition-colors ${selectedCats.includes(cat) ? 'text-obsidian font-medium' : 'text-slate hover:text-obsidian'}`}>
                      <span className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${selectedCats.includes(cat) ? 'border-obsidian bg-obsidian' : 'border-sand'}`}>
                        {selectedCats.includes(cat) && <span className="w-1.5 h-1.5 bg-ivory block" />}
                      </span>
                      {CATEGORY_LABELS[cat]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map(size => (
                  <button key={size} onClick={() => toggleFilter(selectedSizes, size, setSelectedSizes)}
                    className={`w-10 h-10 border font-mono text-xs transition-all ${selectedSizes.includes(size) ? 'border-obsidian bg-obsidian text-ivory' : 'border-sand text-slate hover:border-obsidian'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">Availability</p>
              <button onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-2 font-body text-sm transition-colors ${inStockOnly ? 'text-obsidian font-medium' : 'text-slate hover:text-obsidian'}`}>
                <span className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${inStockOnly ? 'border-obsidian bg-obsidian' : 'border-sand'}`}>
                  {inStockOnly && <span className="w-1.5 h-1.5 bg-ivory block" />}
                </span>
                In Stock Only
              </button>
            </div>
            {activeFilters.length > 0 && (
              <button onClick={() => { setSelectedCats([]); setSelectedSizes([]); setInStockOnly(false); }}
                className="font-mono text-[10px] tracking-widest uppercase text-slate hover:text-obsidian underline">
                Clear All
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/30">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs text-slate">{filtered.length} pieces</span>
              {activeFilters.map(f => (
                <span key={f} className="inline-flex items-center gap-1 bg-sand/20 px-2 py-0.5 font-mono text-[10px] tracking-wider">
                  {f}
                  <button onClick={() => {
                    if (CATEGORIES.includes(f as Category)) setSelectedCats(p => p.filter(c => c !== f));
                    else if (SIZES.includes(f as Size)) setSelectedSizes(p => p.filter(s => s !== f));
                    else setInStockOnly(false);
                  }}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button className="lg:hidden flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase border border-sand px-3 py-1.5"
                onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={12} /> Filter
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-1.5 w-40 text-xs">
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate">
              <Loader size={20} className="animate-spin" />
              <span className="font-mono text-xs tracking-widest">Loading collection…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-3xl text-slate mb-3">No pieces found</p>
              <p className="font-body text-sm text-slate">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filtered.map((outfit, i) => (
                <OutfitCard key={outfit.id as string} outfit={outfit as never} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-ivory p-6 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-2xl">Filters</h3>
            <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
          </div>
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => toggleFilter(selectedCats, cat, setSelectedCats)}
                    className={`px-4 py-2 border font-body text-sm ${selectedCats.includes(cat) ? 'bg-obsidian text-ivory border-obsidian' : 'border-sand text-charcoal'}`}>
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button key={size} onClick={() => toggleFilter(selectedSizes, size, setSelectedSizes)}
                    className={`w-12 h-12 border font-mono text-sm ${selectedSizes.includes(size) ? 'bg-obsidian text-ivory border-obsidian' : 'border-sand text-charcoal'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex gap-3">
            <button onClick={() => { setSelectedCats([]); setSelectedSizes([]); setInStockOnly(false); }} className="btn-outline flex-1 justify-center">Clear All</button>
            <button onClick={() => setFiltersOpen(false)} className="btn-primary flex-1 justify-center">Show {filtered.length} Pieces</button>
          </div>
        </div>
      )}
    </div>
  );
}
