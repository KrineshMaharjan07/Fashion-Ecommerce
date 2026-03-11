'use client';
// ============================================================
// app/customer/appointments/page.tsx — Appointment booking
// ============================================================
import { useState } from 'react';
import { Calendar, Clock, User, Check, ChevronRight } from 'lucide-react';
import { useOutfitsStore } from '@/lib/state';
import { DESIGNERS } from '@/lib/store';
import { APPOINTMENT_TYPE_LABELS, TIME_SLOTS, generateId } from '@/lib/utils';
import { Appointment } from '@/lib/store';

type Step = 1 | 2 | 3 | 4;

export default function AppointmentsPage() {
  const { addAppointment } = useOutfitsStore();
  const [step, setStep] = useState<Step>(1);
  const [confirmed, setConfirmed] = useState(false);

  const [form, setForm] = useState({
    designerId: '',
    type: '' as keyof typeof APPOINTMENT_TYPE_LABELS | '',
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });

  const selectedDesigner = DESIGNERS.find(d => d.id === form.designerId);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    const appointment: Appointment = {
      id: generateId('apt'),
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      designerId: form.designerId,
      designerName: selectedDesigner?.name || '',
      date: form.date,
      time: form.time,
      type: form.type as Appointment['type'],
      notes: form.notes,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    addAppointment(appointment);

    // Send email notification to business (fire-and-forget, don't block UI)
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).catch(() => { /* silent fail — email is best-effort */ });

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-champagne/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-champagne" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">Appointment Requested</p>
          <h2 className="font-display text-4xl font-light mb-4">You're on the list</h2>
          <p className="font-body text-sm text-slate leading-relaxed mb-2">
            Thank you, <strong>{form.customerName}</strong>. Your appointment request with <strong>{selectedDesigner?.name}</strong> has been received.
          </p>
          <p className="font-body text-sm text-slate leading-relaxed mb-8">
            We'll confirm your {form.date} at {form.time} appointment via email to {form.customerEmail} within 24 hours.
          </p>
          <button onClick={() => { setConfirmed(false); setStep(1); setForm({ designerId:'',type:'',date:'',time:'',customerName:'',customerEmail:'',customerPhone:'',notes:'' }); }} className="btn-outline">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-6 lg:px-10 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-2">Bespoke Services</p>
        <h1 className="font-display text-5xl lg:text-6xl font-light mb-4">Book an Appointment</h1>
        <p className="font-body text-sm text-slate max-w-xl">
          Schedule a private session with one of our resident designers. Whether you need a fitting, alterations, or a full custom commission, we're here to make it extraordinary.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-12">
        {([1,2,3,4] as Step[]).map((s, i) => {
          const labels = ['Designer', 'Service & Time', 'Your Details', 'Confirm'];
          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 flex items-center justify-center border font-mono text-xs transition-all ${
                  step > s ? 'bg-obsidian border-obsidian text-ivory' :
                  step === s ? 'border-obsidian text-obsidian' :
                  'border-sand text-slate'
                }`}>
                  {step > s ? <Check size={12} /> : s}
                </div>
                <span className={`hidden sm:block font-mono text-[10px] tracking-wide uppercase ${step >= s ? 'text-obsidian' : 'text-slate'}`}>
                  {labels[i]}
                </span>
              </div>
              {i < 3 && <div className={`w-8 sm:w-12 h-px mx-2 ${step > s ? 'bg-obsidian' : 'bg-sand'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* ── Form steps ───────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* Step 1: Designer */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl mb-6">Choose Your Designer</h2>
              <div className="space-y-4">
                {DESIGNERS.map(designer => (
                  <button
                    key={designer.id}
                    onClick={() => update('designerId', designer.id)}
                    className={`w-full text-left p-5 border-2 transition-all flex gap-4 items-center ${
                      form.designerId === designer.id
                        ? 'border-obsidian bg-obsidian/5'
                        : 'border-sand hover:border-charcoal'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={designer.avatar} alt={designer.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] tracking-widest uppercase text-champagne">{designer.specialty}</p>
                      <p className="font-display text-xl mt-0.5">{designer.name}</p>
                      <p className="font-body text-xs text-slate mt-1 line-clamp-2">{designer.bio}</p>
                      <p className="font-mono text-[10px] text-slate mt-1">
                        Available: {designer.availability.join(', ')}
                      </p>
                    </div>
                    {form.designerId === designer.id && (
                      <Check size={18} className="text-obsidian flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!form.designerId}
                onClick={() => setStep(2)}
                className="btn-primary mt-6 disabled:opacity-40"
              >
                Next: Service & Time <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Step 2: Service + Date/Time */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl mb-6">Service & Availability</h2>

              <div className="mb-6">
                <label className="field-label">Type of Appointment</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(APPOINTMENT_TYPE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => update('type', key)}
                      className={`p-4 border-2 text-left transition-all ${
                        form.type === key ? 'border-obsidian bg-obsidian/5' : 'border-sand hover:border-charcoal'
                      }`}
                    >
                      <p className="font-display text-lg">{label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="field-label">Preferred Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label">Preferred Time</label>
                  <select value={form.time} onChange={(e) => update('time', e.target.value)} className="input-field">
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Notes (Optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Tell us about your vision, occasion, or any specific requirements..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                <button
                  disabled={!form.type || !form.date || !form.time}
                  onClick={() => setStep(3)}
                  className="btn-primary disabled:opacity-40"
                >
                  Next: Your Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Customer details */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl mb-6">Your Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => update('customerName', e.target.value)}
                    placeholder="Your full name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label">Email Address *</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => update('customerEmail', e.target.value)}
                    placeholder="your@email.com"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label">Phone Number</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => update('customerPhone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline">Back</button>
                <button
                  disabled={!form.customerName || !form.customerEmail}
                  onClick={() => setStep(4)}
                  className="btn-primary disabled:opacity-40"
                >
                  Review Booking <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl mb-6">Confirm Your Appointment</h2>

              <div className="border border-sand p-6 space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedDesigner?.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-champagne">{selectedDesigner?.specialty}</p>
                    <p className="font-display text-lg">{selectedDesigner?.name}</p>
                  </div>
                </div>
                <div className="border-t border-sand/40 pt-4 grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Service</p>
                    <p className="font-body text-sm mt-0.5">{APPOINTMENT_TYPE_LABELS[form.type as keyof typeof APPOINTMENT_TYPE_LABELS]}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Date & Time</p>
                    <p className="font-body text-sm mt-0.5">{form.date} at {form.time}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Name</p>
                    <p className="font-body text-sm mt-0.5">{form.customerName}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Email</p>
                    <p className="font-body text-sm mt-0.5">{form.customerEmail}</p>
                  </div>
                </div>
                {form.notes && (
                  <div className="border-t border-sand/40 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate">Notes</p>
                    <p className="font-body text-sm mt-0.5 text-charcoal">{form.notes}</p>
                  </div>
                )}
              </div>

              <p className="font-body text-xs text-slate mb-6">
                By confirming, you agree to our cancellation policy. Appointments may be rescheduled up to 48 hours in advance.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="btn-outline">Back</button>
                <button onClick={handleSubmit} className="btn-champagne">
                  <Check size={14} /> Confirm Appointment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar info ─────────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-charcoal p-6">
            <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-4">Why Book With Us</p>
            {[
              { icon: User, title: 'Private Sessions', text: 'One-on-one time with your chosen designer.' },
              { icon: Clock, title: 'Flexible Timing', text: 'Morning, afternoon, and weekend slots available.' },
              { icon: Calendar, title: 'Easy Rescheduling', text: 'Reschedule up to 48h before with no fees.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 mb-4 last:mb-0">
                <Icon size={16} className="text-champagne flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm text-ivory font-medium">{title}</p>
                  <p className="font-body text-xs text-ivory/50 mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedDesigner && (
            <div className="border border-sand p-5">
              <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-3">Selected Designer</p>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedDesigner.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-lg">{selectedDesigner.name}</p>
                  <p className="font-body text-xs text-slate">{selectedDesigner.specialty}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
