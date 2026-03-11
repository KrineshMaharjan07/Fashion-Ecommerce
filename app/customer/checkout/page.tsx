'use client';
// ============================================================
// app/customer/checkout/page.tsx — Nepal-friendly checkout
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Banknote, Smartphone, Building2 } from 'lucide-react';
import { useCartStore } from '@/lib/state';
import { formatPrice } from '@/lib/utils';

const PAYMENT_METHODS = [
  { id: 'cod',   icon: Banknote,   label: 'Cash on Delivery', description: 'Pay when your order arrives at your door.',                badge: 'Most Popular' },
  { id: 'esewa', icon: Smartphone, label: 'eSewa',            description: 'Pay via eSewa digital wallet after order confirmation.', badge: null },
  { id: 'bank',  icon: Building2,  label: 'Bank Transfer',    description: "We'll send bank details after your order is confirmed.", badge: null },
];

const NEPAL_DISTRICTS = [
  'Kathmandu','Lalitpur','Bhaktapur','Pokhara','Biratnagar',
  'Birgunj','Dharan','Butwal','Hetauda','Chitwan',
  'Dhangadhi','Nepalgunj','Janakpur','Other',
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [outfitMap, setOutfitMap] = useState<Record<string, Record<string, unknown>>>({});

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', district: '',
    paymentMethod: 'cod', notes: '',
  });

  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  useEffect(() => {
    if (items.length === 0) return;
    Promise.all(
      items.map(item =>
        fetch(`/api/outfits/${item.outfitId}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const map: Record<string, Record<string, unknown>> = {};
      results.forEach((data, i) => { if (data) map[items[i].outfitId] = data; });
      setOutfitMap(map);
    });
  }, [items]);

  const cartTotal = items.reduce((sum, item) => {
    const o = outfitMap[item.outfitId];
    return sum + ((o?.price as number) || 0) * item.quantity;
  }, 0);

  const isValid = !!(form.name && form.email && form.phone && form.address && form.district);

  const handleOrder = async () => {
    if (!isValid) return;
    setLoading(true);
    const orderItems = items.map(item => {
      const o = outfitMap[item.outfitId];
      return { outfitId: item.outfitId, outfitName: (o?.name as string) || 'Unknown', size: item.size, quantity: item.quantity, price: (o?.price as number) || 0 };
    });
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name, customerEmail: form.email, customerPhone: form.phone,
          items: orderItems, total: cartTotal,
          shippingAddress: `${form.address}, ${form.city}`,
          district: form.district,
          paymentMethod: PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label || form.paymentMethod,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      setOrderId(data.id ? data.id.slice(-10).toUpperCase() : 'CONFIRMED');
    } catch {
      setOrderId('CONFIRMED');
    }
    clearCart();
    setLoading(false);
    setSubmitted(true);
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-6">
        <p className="font-display text-3xl text-slate">Your bag is empty</p>
        <Link href="/customer/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (submitted) {
    const method = PAYMENT_METHODS.find(m => m.id === form.paymentMethod);
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-champagne/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-champagne" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">Order Received</p>
          <h2 className="font-display text-4xl font-light mb-2">Thank you, {form.name.split(' ')[0]}</h2>
          <p className="font-mono text-xs text-slate mb-6 tracking-widest">{orderId}</p>
          <div className="bg-sand/20 p-5 text-left mb-6 space-y-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Confirmation sent to</p>
              <p className="font-body text-sm mt-0.5">{form.email}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Payment Method</p>
              <p className="font-body text-sm mt-0.5">{method?.label}</p>
            </div>
            {form.paymentMethod === 'cod' && (
              <div className="bg-champagne/10 border border-champagne/30 p-3">
                <p className="font-body text-xs text-charcoal">Our team will contact you at <strong>{form.phone}</strong> to confirm delivery. Please keep cash ready upon delivery.</p>
              </div>
            )}
            {form.paymentMethod === 'esewa' && (
              <div className="bg-green-50 border border-green-200 p-3">
                <p className="font-body text-xs text-charcoal">eSewa details will be sent to <strong>{form.email}</strong>. Please complete payment within 24 hours.</p>
              </div>
            )}
            {form.paymentMethod === 'bank' && (
              <div className="bg-blue-50 border border-blue-200 p-3">
                <p className="font-body text-xs text-charcoal">Bank transfer details will be sent to <strong>{form.email}</strong>. Please complete within 48 hours.</p>
              </div>
            )}
          </div>
          <Link href="/customer/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/customer/shop" className="text-slate hover:text-obsidian transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Almost there</p>
          <h1 className="font-display text-4xl font-light">Checkout</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">

          <div className="admin-card">
            <h2 className="font-display text-xl mb-5">Contact Details</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="field-label">Phone Number * <span className="normal-case font-body text-slate text-xs">(for delivery coordination)</span></label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" placeholder="+977 98XXXXXXXX" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="font-display text-xl mb-5">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="field-label">Street Address / Tole *</label>
                <input value={form.address} onChange={e => update('address', e.target.value)} className="input-field" placeholder="e.g. Thamel Marg, House No. 12" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">City / Municipality</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)} className="input-field" placeholder="e.g. Kathmandu Metropolitan" />
                </div>
                <div>
                  <label className="field-label">District *</label>
                  <select value={form.district} onChange={e => update('district', e.target.value)} className="input-field">
                    <option value="">Select district</option>
                    {NEPAL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Delivery Notes <span className="normal-case font-body text-slate text-xs">(optional)</span></label>
                <textarea value={form.notes} onChange={e => update('notes', e.target.value)} className="input-field resize-none" rows={2} placeholder="Landmark, building name, or delivery instructions..." />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="font-display text-xl mb-2">Payment Method</h2>
            <p className="font-body text-xs text-slate mb-5">No card required. Choose how you would like to pay.</p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => {
                const Icon = method.icon;
                const isSelected = form.paymentMethod === method.id;
                return (
                  <button key={method.id} onClick={() => update('paymentMethod', method.id)}
                    className={`w-full text-left p-4 border-2 transition-all flex items-start gap-4 ${isSelected ? 'border-obsidian bg-obsidian/5' : 'border-sand hover:border-charcoal'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-obsidian text-ivory' : 'bg-sand/20 text-charcoal'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-medium">{method.label}</p>
                        {method.badge && <span className="font-mono text-[9px] tracking-wider uppercase bg-champagne/20 text-champagne px-1.5 py-0.5">{method.badge}</span>}
                      </div>
                      <p className="font-body text-xs text-slate mt-0.5">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${isSelected ? 'border-obsidian' : 'border-sand'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-obsidian" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="admin-card sticky top-24">
            <h2 className="font-display text-xl mb-5">Your Selection</h2>
            <div className="space-y-3 mb-5">
              {items.map(item => {
                const o = outfitMap[item.outfitId];
                return (
                  <div key={`${item.outfitId}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-12 h-14 overflow-hidden bg-sand/20 flex-shrink-0">
                      {(o?.images as string[])?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(o.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm truncate">{o ? (o.name as string) : '…'}</p>
                      <p className="font-mono text-[10px] text-slate">Size {item.size} × {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm flex-shrink-0">
                      {o ? formatPrice((o.price as number) * item.quantity) : '—'}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-sand/40 pt-4 space-y-2 mb-5">
              <div className="flex justify-between font-body text-sm text-slate">
                <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-slate">
                <span>Delivery</span><span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-display text-2xl pt-2 border-t border-sand/40">
                <span>Total</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <p className="font-mono text-[10px] text-slate tracking-wide">
                Pay via {PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label}
              </p>
            </div>
            <button onClick={handleOrder} disabled={!isValid || loading}
              className="btn-champagne w-full justify-center disabled:opacity-40">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-obsidian/30 border-t-obsidian rounded-full animate-spin inline-block" />
                  Placing Order…
                </span>
              ) : (
                <><Check size={14} /> Place Order</>
              )}
            </button>
            <p className="font-mono text-[10px] text-slate mt-3 text-center tracking-wide">
              No payment required right now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
