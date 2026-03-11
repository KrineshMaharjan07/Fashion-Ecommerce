// ============================================================
// app/api/seed/route.ts — Seed MongoDB with sample data
// Visit: POST /api/seed  (run once, then remove or protect it)
// ============================================================
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Outfit from '@/lib/models/Outfit';
import Order from '@/lib/models/Order';
import Appointment from '@/lib/models/Appointment';
import { OUTFITS, ORDERS, APPOINTMENTS } from '@/lib/store';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Outfit.deleteMany({}),
      Order.deleteMany({}),
      Appointment.deleteMany({}),
    ]);

    // Insert outfits (strip the id field — Mongo generates its own _id)
    const outfitDocs = OUTFITS.map(({ id: _id, ...rest }) => rest);
    const insertedOutfits = await Outfit.insertMany(outfitDocs);

    // Map old string ids → new Mongo ids for orders
    const idMap: Record<string, string> = {};
    OUTFITS.forEach((o, i) => { idMap[o.id] = insertedOutfits[i]._id.toString(); });

    // Insert orders with remapped outfit ids
    const orderDocs = ORDERS.map(({ id: _id, customerId: _cid, ...rest }) => ({
      ...rest,
      customerPhone: '+977 9800000000',
      district: 'Kathmandu',
      paymentMethod: 'Cash on Delivery',
      items: rest.items.map(item => ({
        outfitId:   idMap[item.outfitId] || item.outfitId,
        outfitName: OUTFITS.find(o => o.id === item.outfitId)?.name || 'Unknown',
        size:       item.size,
        quantity:   item.quantity,
        price:      OUTFITS.find(o => o.id === item.outfitId)?.price || 0,
      })),
    }));
    await Order.insertMany(orderDocs);

    // Insert appointments
    const appointmentDocs = APPOINTMENTS.map(({ id: _id, ...rest }) => rest);
    await Appointment.insertMany(appointmentDocs);

    return NextResponse.json({
      success: true,
      inserted: {
        outfits:      insertedOutfits.length,
        orders:       orderDocs.length,
        appointments: appointmentDocs.length,
      },
      message: 'Database seeded successfully! You can now remove this endpoint.',
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
