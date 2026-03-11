'use client';
// ============================================================
// app/admin/appointments/page.tsx — Appointments (API)
// ============================================================
import { useState, useEffect } from 'react';
import { STATUS_COLORS, APPOINTMENT_TYPE_LABELS } from '@/lib/utils';
import { Calendar, Clock, User, MessageSquare, Loader } from 'lucide-react';

const STATUSES = ['pending','confirmed','completed','cancelled'] as const;
type AptStatus = typeof STATUSES[number];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Record<string,unknown>[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<AptStatus | 'all'>('all');
  const [view, setView]         = useState<'list'|'calendar'>('list');
  const [updating, setUpdating] = useState<string | null>(null);
  const [emailMsg, setEmailMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const handleStatusUpdate = async (apt: Record<string,unknown>, newStatus: string) => {
    setUpdating(apt.id as string);
    try {
      await fetch(`/api/appointments/${apt.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: newStatus } : a));
      if (newStatus === 'confirmed' || newStatus === 'cancelled') {
        setEmailMsg(p => ({ ...p, [apt.id as string]: `Email sent to ${apt.customerEmail}` }));
        setTimeout(() => setEmailMsg(p => { const n={...p}; delete n[apt.id as string]; return n; }), 4000);
      }
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  return (
    <div className="p-6 xl:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Atelier Services</p>
          <h1 className="font-display text-4xl font-light mt-1">Appointments</h1>
        </div>
        <div className="flex border border-sand overflow-hidden">
          {(['list','calendar'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 font-mono text-[10px] tracking-wider uppercase transition-colors ${view===v ? 'bg-obsidian text-ivory' : 'text-slate hover:text-obsidian'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {(['all', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${filter===s ? 'bg-obsidian text-ivory border-obsidian' : 'border-sand text-slate hover:border-charcoal'}`}>
            {s==='all' ? `All (${appointments.length})` : `${s} (${appointments.filter(a=>a.status===s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate">
          <Loader size={18} className="animate-spin" />
          <span className="font-mono text-xs tracking-widest">Loading appointments…</span>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-4">
          {filtered.map(apt => (
            <div key={apt.id as string} className="admin-card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-champagne" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body text-sm font-medium">{apt.customerName as string}</p>
                      <span className={`status-badge ${STATUS_COLORS[apt.status as keyof typeof STATUS_COLORS]}`}>{apt.status as string}</span>
                    </div>
                    <p className="font-body text-xs text-slate">{apt.customerEmail as string}</p>
                    {apt.customerPhone && <p className="font-body text-xs text-slate">{apt.customerPhone as string}</p>}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-charcoal"><Calendar size={11} className="text-champagne" />{apt.date as string}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-charcoal"><Clock size={11} className="text-champagne" />{apt.time as string}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-charcoal"><User size={11} className="text-champagne" />{apt.designerName as string}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider bg-sand/20 text-charcoal px-2 py-0.5">
                        {APPOINTMENT_TYPE_LABELS[apt.type as keyof typeof APPOINTMENT_TYPE_LABELS]}
                      </span>
                    </div>
                    {apt.notes && (
                      <div className="flex items-start gap-1.5 mt-3 max-w-sm">
                        <MessageSquare size={11} className="text-slate mt-0.5 flex-shrink-0" />
                        <p className="font-body text-xs text-slate italic">{apt.notes as string}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:items-end flex-shrink-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-[10px] text-slate tracking-wider">Update Status</p>
                    {emailMsg[apt.id as string] && (
                      <span className="font-mono text-[10px] text-green-600 animate-fade-in">✓ {emailMsg[apt.id as string]}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map(s => (
                      <button key={s} disabled={updating === apt.id}
                        onClick={() => handleStatusUpdate(apt, s)}
                        className={`font-mono text-[10px] tracking-wider uppercase px-2 py-1 border transition-all disabled:opacity-50 ${apt.status===s ? 'bg-obsidian text-ivory border-obsidian' : 'border-sand text-slate hover:border-charcoal'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="admin-card text-center py-12">
              <Calendar size={32} className="mx-auto text-slate mb-3" strokeWidth={1} />
              <p className="font-display text-2xl text-slate mb-2">No appointments</p>
              <p className="font-body text-sm text-slate">Appointments booked by customers will appear here.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(new Set(filtered.map(a => a.date as string))).sort().map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-obsidian text-ivory px-3 py-1">
                  <p className="font-mono text-xs tracking-widest">{date}</p>
                </div>
                <div className="flex-1 h-px bg-sand/40" />
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.filter(a => a.date === date).map(apt => (
                  <div key={apt.id as string} className="admin-card border-l-4 border-l-champagne">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-body text-sm font-medium">{apt.customerName as string}</p>
                      <span className={`status-badge ${STATUS_COLORS[apt.status as keyof typeof STATUS_COLORS]}`}>{apt.status as string}</span>
                    </div>
                    <p className="font-mono text-[10px] text-slate tracking-wider mb-1">{apt.time as string} · {apt.designerName as string}</p>
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-sand/20 text-charcoal px-2 py-0.5">
                      {APPOINTMENT_TYPE_LABELS[apt.type as keyof typeof APPOINTMENT_TYPE_LABELS]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
