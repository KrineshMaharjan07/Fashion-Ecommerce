'use client';
// ============================================================
// components/admin/OutfitForm.tsx — Create / Edit (API)
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, X, Save, Loader } from 'lucide-react';
import { Size, Category } from '@/lib/store';
import { CATEGORY_LABELS } from '@/lib/utils';

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Props { id?: string; } // if id present → edit mode

export default function OutfitForm({ id }: Props) {
  const router = useRouter();
  const isEdit = !!id;
  const [loading, setLoading]   = useState(isEdit);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', designer: '', price: '', originalPrice: '',
    category: 'casual' as Category, description: '',
    inStock: true, featured: false,
  });
  const [sizes,   setSizes]   = useState<Size[]>([]);
  const [details, setDetails] = useState<string[]>(['']);
  const [tags,    setTags]    = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images,  setImages]  = useState<string[]>(['']);

  // Load existing outfit in edit mode
  useEffect(() => {
    if (!id) return;
    fetch(`/api/outfits/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name || '', designer: data.designer || '',
          price: String(data.price || ''), originalPrice: String(data.originalPrice || ''),
          category: data.category || 'casual', description: data.description || '',
          inStock: data.inStock ?? true, featured: data.featured ?? false,
        });
        setSizes(data.sizes || []);
        setDetails(data.details?.length ? data.details : ['']);
        setTags(data.tags || []);
        setImages(data.images?.length ? data.images : ['']);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));
  const toggleSize = (size: Size) => setSizes(s => s.includes(size) ? s.filter(x => x !== size) : [...s, size]);
  const addDetail = () => setDetails(d => [...d, '']);
  const updateDetail = (i: number, val: string) => setDetails(d => d.map((x, j) => j === i ? val : x));
  const removeDetail = (i: number) => setDetails(d => d.filter((_, j) => j !== i));
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(t => [...t, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };
  const addImage = () => setImages(imgs => [...imgs, '']);
  const updateImage = (i: number, val: string) => setImages(imgs => imgs.map((x, j) => j === i ? val : x));
  const removeImage = (i: number) => setImages(imgs => imgs.filter((_, j) => j !== i));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name        = 'Name is required';
    if (!form.designer.trim())    e.designer    = 'Designer is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (sizes.length === 0)       e.sizes       = 'At least one size required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const body = {
      name: form.name, designer: form.designer,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category, description: form.description,
      details: details.filter(d => d.trim()),
      images: images.filter(img => img.trim()),
      sizes, inStock: form.inStock, featured: form.featured, tags,
    };
    try {
      if (isEdit) {
        await fetch(`/api/outfits/${id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/outfits', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      router.push('/admin/outfits');
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-slate">
      <Loader size={18} className="animate-spin" />
      <span className="font-mono text-xs tracking-widest">Loading outfit…</span>
    </div>
  );

  return (
    <div className="p-6 xl:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/outfits" className="p-1.5 text-slate hover:text-obsidian transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">{isEdit ? 'Edit Outfit' : 'New Outfit'}</p>
          <h1 className="font-display text-4xl font-light">{isEdit ? form.name || 'Edit Outfit' : 'Add New Outfit'}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="admin-card">
          <h2 className="font-display text-xl mb-5">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Outfit Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className="input-field" placeholder="e.g. Obsidian Cascade Gown" />
              {errors.name && <p className="font-mono text-[10px] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="field-label">Designer *</label>
              <input value={form.designer} onChange={e => update('designer', e.target.value)} className="input-field" placeholder="Designer name" />
              {errors.designer && <p className="font-mono text-[10px] text-red-500 mt-1">{errors.designer}</p>}
            </div>
            <div>
              <label className="field-label">Price (NPR) *</label>
              <input type="number" value={form.price} onChange={e => update('price', e.target.value)} className="input-field" placeholder="15000" />
              {errors.price && <p className="font-mono text-[10px] text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="field-label">Original Price (if on sale)</label>
              <input type="number" value={form.originalPrice} onChange={e => update('originalPrice', e.target.value)} className="input-field" placeholder="Leave blank if not on sale" />
            </div>
            <div>
              <label className="field-label">Category *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="input-field">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="field-label">Description *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} className="input-field resize-none" placeholder="A compelling description of this piece…" />
            {errors.description && <p className="font-mono text-[10px] text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="flex gap-6 mt-5">
            {[['inStock','In Stock'],['featured','Featured']].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => update(field, !(form as Record<string,unknown>)[field] as boolean)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${(form as Record<string,unknown>)[field] ? field === 'featured' ? 'bg-champagne' : 'bg-obsidian' : 'bg-sand'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(form as Record<string,unknown>)[field] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="font-body text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="admin-card">
          <h2 className="font-display text-xl mb-4">Available Sizes *</h2>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map(size => (
              <button key={size} onClick={() => toggleSize(size)}
                className={`w-12 h-12 border font-mono text-xs transition-all ${sizes.includes(size) ? 'bg-obsidian text-ivory border-obsidian' : 'border-sand text-charcoal hover:border-obsidian'}`}>
                {size}
              </button>
            ))}
          </div>
          {errors.sizes && <p className="font-mono text-[10px] text-red-500 mt-2">{errors.sizes}</p>}
        </div>

        {/* Images */}
        <div className="admin-card">
          <h2 className="font-display text-xl mb-4">Images</h2>
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input value={img} onChange={e => updateImage(i, e.target.value)} className="input-field" placeholder="https://images.unsplash.com/…" />
                {img.trim() && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="w-10 h-12 object-cover flex-shrink-0 border border-sand" />
                )}
                {images.length > 1 && (
                  <button onClick={() => removeImage(i)} className="p-2 text-slate hover:text-red-500 transition-colors"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addImage} className="mt-3 btn-outline py-1.5 px-3 text-xs"><Plus size={12} /> Add Image URL</button>
        </div>

        {/* Details */}
        <div className="admin-card">
          <h2 className="font-display text-xl mb-4">Product Details</h2>
          <div className="space-y-2">
            {details.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input value={d} onChange={e => updateDetail(i, e.target.value)} className="input-field" placeholder="e.g. 100% Silk Charmeuse" />
                {details.length > 1 && (
                  <button onClick={() => removeDetail(i)} className="p-2 text-slate hover:text-red-500 transition-colors"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addDetail} className="mt-3 btn-outline py-1.5 px-3 text-xs"><Plus size={12} /> Add Detail</button>
        </div>

        {/* Tags */}
        <div className="admin-card">
          <h2 className="font-display text-xl mb-4">Tags</h2>
          <div className="flex gap-2 mb-3 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-sand/20 px-2 py-1 font-mono text-[10px] tracking-wider">
                {tag}<button onClick={() => setTags(t => t.filter(x => x !== tag))}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="input-field flex-1" placeholder="Add a tag (press Enter)" />
            <button onClick={addTag} className="btn-outline py-1.5 px-3 text-xs"><Plus size={12} /> Add</button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/outfits" className="btn-outline">Cancel</Link>
          <button onClick={handleSubmit} disabled={saving} className="btn-champagne disabled:opacity-50">
            {saving ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> {isEdit ? 'Save Changes' : 'Create Outfit'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
