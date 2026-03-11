// ============================================================
// lib/api.ts — Typed fetch helpers for all API endpoints
// Used by both customer and admin pages
// ============================================================

// ── Types (re-exported for convenience) ──────────────────────
export type { IOutfit as Outfit } from './models/Outfit';
export type { IOrder as Order } from './models/Order';
export type { IAppointment as Appointment } from './models/Appointment';

// ── Generic fetch helper ──────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ══════════════════════════════════════════════════════════════
// OUTFITS
// ══════════════════════════════════════════════════════════════
export const outfitsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<Record<string, unknown>[]>(`/api/outfits${qs}`);
  },
  getOne: (id: string) =>
    apiFetch<Record<string, unknown>>(`/api/outfits/${id}`),

  create: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>('/api/outfits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/api/outfits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/outfits/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════
export const ordersApi = {
  getAll: () => apiFetch<Record<string, unknown>[]>('/api/orders'),

  create: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiFetch<Record<string, unknown>>(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ══════════════════════════════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════════════════════════════
export const appointmentsApi = {
  getAll: () => apiFetch<Record<string, unknown>[]>('/api/appointments'),

  create: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiFetch<Record<string, unknown>>(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
