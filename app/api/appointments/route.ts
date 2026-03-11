// ============================================================
// app/api/appointments/route.ts — GET all, POST create
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';
import { sendAppointmentRequestToBusiness } from '@/lib/email';
import { APPOINTMENT_TYPE_LABELS } from '@/lib/utils';

// GET /api/appointments
export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
    const normalized = appointments.map(a => ({ ...a, id: (a._id as unknown as string).toString() }));
    return NextResponse.json(normalized);
  } catch (err) {
    console.error('GET /api/appointments error:', err);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST /api/appointments — create + notify business
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const appointment = await Appointment.create({
      customerName:  body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      designerId:    body.designerId,
      designerName:  body.designerName,
      date:          body.date,
      time:          body.time,
      type:          body.type,
      notes:         body.notes || '',
      status:        'pending',
    });

    // Notify business (non-blocking)
    const typeLabel = APPOINTMENT_TYPE_LABELS[body.type as keyof typeof APPOINTMENT_TYPE_LABELS] || body.type;
    sendAppointmentRequestToBusiness({
      ...body,
      type: typeLabel,
      id: appointment._id.toString(),
    }).catch(e => console.error('Appointment email failed:', e));

    return NextResponse.json(
      { ...appointment.toJSON(), id: appointment._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/appointments error:', err);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
