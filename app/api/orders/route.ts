// ============================================================
// app/api/orders/route.ts — GET all orders, POST create
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderConfirmationToCustomer } from '@/lib/email';

// GET /api/orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const normalized = orders.map(o => ({ ...o, id: (o._id as unknown as string).toString() }));
    return NextResponse.json(normalized);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — create order + send confirmation email
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.create({
      customerName:    body.customerName,
      customerEmail:   body.customerEmail,
      customerPhone:   body.customerPhone,
      items:           body.items,
      total:           body.total,
      shippingAddress: body.shippingAddress,
      district:        body.district,
      paymentMethod:   body.paymentMethod,
      notes:           body.notes || '',
      status:          'pending',
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationToCustomer({
      customerName:  body.customerName,
      customerEmail: body.customerEmail,
      orderId:       order._id.toString(),
      items:         body.items.map((i: { outfitName: string; size: string; quantity: number; price: number }) => ({
        name: i.outfitName, size: i.size, qty: i.quantity, price: i.price,
      })),
      total:         body.total,
      address:       body.shippingAddress,
      paymentMethod: body.paymentMethod,
    }).catch(e => console.error('Order email failed:', e));

    return NextResponse.json({ ...order.toJSON(), id: order._id.toString() }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
