// ============================================================
// lib/utils.ts — Shared utility functions
// ============================================================

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
} as const;

export const CATEGORY_LABELS = {
  evening: 'Evening',
  casual: 'Casual',
  bridal: 'Bridal',
  resort: 'Resort',
  couture: 'Couture',
} as const;

export const APPOINTMENT_TYPE_LABELS = {
  consultation: 'Style Consultation',
  fitting: 'Fitting Session',
  alteration: 'Alteration',
  'custom-design': 'Custom Design',
} as const;

export const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '3:30 PM', '4:00 PM', '5:00 PM',
];
