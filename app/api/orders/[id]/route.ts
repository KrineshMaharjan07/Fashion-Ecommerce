// ============================================================
// app/api/orders/[id]/route.ts — PATCH order status
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true }
    ).lean();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...order, id: (order._id as unknown as string).toString() });
  } catch (err) {
    console.error('PATCH /api/orders/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
