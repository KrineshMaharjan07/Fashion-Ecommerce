// ============================================================
// lib/state.ts — Zustand global state management
// ============================================================
'use client';

import { create } from 'zustand';
import {
  Outfit, CartItem, Order, Appointment, OUTFITS, ORDERS, APPOINTMENTS, Size
} from './store';

// ── Cart Store ──────────────────────────────────────────────
interface CartStore {
  items: CartItem[];
  addItem: (outfitId: string, size: Size) => void;
  removeItem: (outfitId: string, size: Size) => void;
  updateQty: (outfitId: string, size: Size, qty: number) => void;
  clearCart: () => void;
  total: (outfits: Outfit[]) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (outfitId, size) =>
    set((s) => {
      const existing = s.items.find(i => i.outfitId === outfitId && i.size === size);
      if (existing) return { items: s.items.map(i => i.outfitId === outfitId && i.size === size ? { ...i, quantity: i.quantity + 1 } : i) };
      return { items: [...s.items, { outfitId, size, quantity: 1 }] };
    }),
  removeItem: (outfitId, size) =>
    set((s) => ({ items: s.items.filter(i => !(i.outfitId === outfitId && i.size === size)) })),
  updateQty: (outfitId, size, qty) =>
    set((s) => ({
      items: qty <= 0
        ? s.items.filter(i => !(i.outfitId === outfitId && i.size === size))
        : s.items.map(i => i.outfitId === outfitId && i.size === size ? { ...i, quantity: qty } : i),
    })),
  clearCart: () => set({ items: [] }),
  total: (outfits) => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const outfit = outfits.find(o => o.id === item.outfitId);
      return sum + (outfit?.price ?? 0) * item.quantity;
    }, 0);
  },
}));

// ── Admin / Outfits Store ───────────────────────────────────
interface OutfitsStore {
  outfits: Outfit[];
  orders: Order[];
  appointments: Appointment[];
  // Outfit CRUD
  addOutfit: (outfit: Outfit) => void;
  updateOutfit: (id: string, data: Partial<Outfit>) => void;
  deleteOutfit: (id: string) => void;
  // Order management
  updateOrderStatus: (id: string, status: Order['status']) => void;
  // Appointment management
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useOutfitsStore = create<OutfitsStore>((set) => ({
  outfits: OUTFITS,
  orders: ORDERS,
  appointments: APPOINTMENTS,

  addOutfit: (outfit) =>
    set((s) => ({ outfits: [outfit, ...s.outfits] })),

  updateOutfit: (id, data) =>
    set((s) => ({
      outfits: s.outfits.map(o => o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString().split('T')[0] } : o),
    })),

  deleteOutfit: (id) =>
    set((s) => ({ outfits: s.outfits.filter(o => o.id !== id) })),

  updateOrderStatus: (id, status) =>
    set((s) => ({
      orders: s.orders.map(o => o.id === id ? { ...o, status } : o),
    })),

  updateAppointmentStatus: (id, status) =>
    set((s) => ({
      appointments: s.appointments.map(a => a.id === id ? { ...a, status } : a),
    })),

  addAppointment: (appointment) =>
    set((s) => ({ appointments: [appointment, ...s.appointments] })),
}));

// ── UI Store ────────────────────────────────────────────────
interface UIStore {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  setCartOpen: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setCartOpen: (v) => set({ cartOpen: v }),
}));
