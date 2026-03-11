'use client';
// ============================================================
// app/admin/page.tsx — Admin Dashboard (API-connected)
// ============================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, ClipboardList, TrendingUp, ArrowRight, DollarSign, Loader } from 'lucide-react';
import { formatPrice, STATUS_COLORS, APPOINTMENT_TYPE_LABELS } from '@/lib/utils';

export default function AdminDashboard() {
  const [outfits, setOutfits]           = useState<Record<string,unknown>[]>([]);
  const [orders, setOrders]             = useState<Record<string,unknown>[]>([]);
  const [appointments, setAppointments] = useState<Record<string,unknown>[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/outfits').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/appointments').then(r => r.json()),
    ]).then(([o, ord, apt]) => {
      setOutfits(Array.isArray(o) ? o : []);
      setOrders(Array.isArray(ord) ? ord : []);
      setAppointments(Array.isArray(apt) ? apt : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalRevenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total as number), 0);
  const pendingOrders  = orders.filter(o => o.status === 'pending').length;
  const inStockCount   = outfits.filter(o => o.inStock).length;

  const stats = [
    { label: 'Total Revenue',  value: formatPrice(totalRevenue),   icon: DollarSign,    color: 'bg-champagne/20 text-champagne',  change: 'all time' },
    { label: 'Total Orders',   value: orders.length,                icon: ClipboardList, color: 'bg-blue-50 text-blue-600',        change: `${pendingOrders} pending` },
    { label: 'Appointments',   value: appointments.length,          icon: Calendar,      color: 'bg-blush/30 text-rose-600',       change: `${appointments.filter(a=>a.status==='pending').length} pending` },
    { label: 'Outfits Listed', value: outfits.length,               icon: ShoppingBag,   color: 'bg-green-50 text-green-600',      change: `${inStockCount} in stock` },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-screen gap-3 text-slate">
      <Loader size={20} className="animate-spin" />
      <span className="font-mono text-xs tracking-widest">Loading dashboard…</span>
    </div>
  );

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Welcome back</p>
        <h1 className="font-display text-4xl font-light mt-1">Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${color}`}><Icon size={18} /></div>
              <span className="font-mono text-[10px] text-slate">{change}</span>
            </div>
            <p className="font-display text-3xl font-light">{value}</p>
            <p className="font-body text-xs text-slate mt-1 tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="font-mono text-[10px] uppercase tracking-wider text-champagne hover-underline flex items-center gap-1">View All <ArrowRight size={10} /></Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id as string} className="flex items-center justify-between py-2 border-b border-[#F0EBE3] last:border-0">
                <div>
                  <p className="font-body text-sm font-medium">{order.customerName as string}</p>
                  <p className="font-mono text-[10px] text-slate tracking-wider">{(order.id as string).slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm">{formatPrice(order.total as number)}</p>
                  <span className={`status-badge text-[10px] mt-0.5 ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>{order.status as string}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="font-body text-sm text-slate text-center py-4">No orders yet.</p>}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl">Appointments</h2>
            <Link href="/admin/appointments" className="font-mono text-[10px] uppercase tracking-wider text-champagne hover-underline flex items-center gap-1">View All <ArrowRight size={10} /></Link>
          </div>
          <div className="space-y-3">
            {appointments.slice(0, 5).map(apt => (
              <div key={apt.id as string} className="flex items-center justify-between py-2 border-b border-[#F0EBE3] last:border-0">
                <div>
                  <p className="font-body text-sm font-medium">{apt.customerName as string}</p>
                  <p className="font-mono text-[10px] text-slate tracking-wider">{apt.designerName as string} · {APPOINTMENT_TYPE_LABELS[apt.type as keyof typeof APPOINTMENT_TYPE_LABELS]}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-xs text-charcoal">{apt.date as string}</p>
                  <p className="font-mono text-[10px] text-slate">{apt.time as string}</p>
                  <span className={`status-badge text-[10px] mt-0.5 ${STATUS_COLORS[apt.status as keyof typeof STATUS_COLORS]}`}>{apt.status as string}</span>
                </div>
              </div>
            ))}
            {appointments.length === 0 && <p className="font-body text-sm text-slate text-center py-4">No appointments yet.</p>}
          </div>
        </div>

        {/* Quick actions */}
        <div className="admin-card lg:col-span-2">
          <h2 className="font-display text-xl mb-5">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/admin/outfits/new" className="btn-primary justify-center py-3 text-xs"><ShoppingBag size={14} /> Add New Outfit</Link>
            <Link href="/admin/appointments" className="btn-outline justify-center py-3 text-xs"><Calendar size={14} /> Manage Appointments</Link>
            <Link href="/admin/orders" className="btn-outline justify-center py-3 text-xs"><TrendingUp size={14} /> View Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
