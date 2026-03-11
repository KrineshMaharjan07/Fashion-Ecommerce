'use client';
// ============================================================
// app/admin/outfits/page.tsx — Outfit CRUD list (API)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, Loader } from 'lucide-react';
import { formatPrice, CATEGORY_LABELS } from '@/lib/utils';
import { Category } from '@/lib/store';

export default function AdminOutfitsPage() {
  const [outfits, setOutfits] = useState<Record<string,unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string,string> = {};
      if (filterCat !== 'all') params.category = filterCat;
      const qs = new URLSearchParams(params).toString();
      const data = await fetch(`/api/outfits?${qs}`).then(r => r.json());
      setOutfits(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterCat]);

  useEffect(() => { fetchOutfits(); }, [fetchOutfits]);

  const filtered = outfits.filter(o =>
    !search ||
    (o.name as string).toLowerCase().includes(search.toLowerCase()) ||
    (o.designer as string).toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id: string, field: string, current: boolean) => {
    await fetch(`/api/outfits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    });
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, [field]: !current } : o));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/outfits/${id}`, { method: 'DELETE' });
    setOutfits(prev => prev.filter(o => o.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 xl:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Inventory</p>
          <h1 className="font-display text-4xl font-light mt-1">Outfits</h1>
        </div>
        <Link href="/admin/outfits/new" className="btn-primary"><Plus size={14} /> Add Outfit</Link>
      </div>

      <div className="admin-card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or designer…" className="input-field pl-9" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value as Category | 'all')} className="input-field w-full sm:w-44">
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate">
          <Loader size={18} className="animate-spin" />
          <span className="font-mono text-xs tracking-widest">Loading outfits…</span>
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <div className="flex gap-4 px-4 py-3 border-b border-[#EDE8DF] text-xs">
            <span className="font-mono text-slate">{filtered.length} outfits</span>
            <span className="font-mono text-green-600">{outfits.filter(o=>o.inStock).length} in stock</span>
            <span className="font-mono text-red-500">{outfits.filter(o=>!o.inStock).length} sold out</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EDE8DF]">
                  {['Outfit','Designer','Category','Price','Status','Actions'].map(h => (
                    <th key={h} className={`text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-slate ${['Designer','Category','Status'].includes(h) ? 'hidden md:table-cell' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(outfit => (
                  <tr key={outfit.id as string} className="border-b border-[#EDE8DF] last:border-0 hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-sand/20 flex-shrink-0 overflow-hidden">
                          {(outfit.images as string[])[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(outfit.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium">{outfit.name as string}</p>
                          <p className="font-mono text-[10px] text-slate">{(outfit.id as string).slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-charcoal hidden md:table-cell">{outfit.designer as string}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-[10px] tracking-wider uppercase bg-sand/20 px-2 py-0.5">
                        {CATEGORY_LABELS[outfit.category as Category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-body text-sm">{formatPrice(outfit.price as number)}</p>
                        {outfit.originalPrice && <p className="font-body text-xs text-slate line-through">{formatPrice(outfit.originalPrice as number)}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className={`status-badge ${outfit.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {outfit.inStock ? 'In Stock' : 'Sold Out'}
                        </span>
                        {outfit.featured && <span className="status-badge bg-champagne/20 text-champagne">Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(outfit.id as string, 'inStock', outfit.inStock as boolean)}
                          className="p-1.5 text-slate hover:text-obsidian transition-colors" title={outfit.inStock ? 'Mark sold out' : 'Mark in stock'}>
                          {outfit.inStock ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <Link href={`/admin/outfits/${outfit.id}`} className="p-1.5 text-slate hover:text-obsidian transition-colors">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => setDeleteConfirm(outfit.id as string)} className="p-1.5 text-slate hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate">
                <p className="font-display text-2xl mb-2">No outfits found</p>
                <p className="font-body text-sm">Try adjusting your filters or <Link href="/admin/outfits/new" className="underline">add a new outfit</Link>.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/40 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full p-6 shadow-2xl animate-fade-up">
            <h3 className="font-display text-2xl mb-3">Delete Outfit?</h3>
            <p className="font-body text-sm text-slate mb-6">This cannot be undone. The outfit will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1 justify-center py-2">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500 text-white font-body text-xs tracking-widest uppercase hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
