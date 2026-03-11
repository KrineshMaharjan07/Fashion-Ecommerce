// ============================================================
// app/api/appointments/[id]/route.ts — PATCH status + email
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';
import {
  sendAppointmentConfirmedToCustomer,
  sendAppointmentDeclinedToCustomer,
} from '@/lib/email';
import { APPOINTMENT_TYPE_LABELS } from '@/lib/utils';

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { status } = await req.json();

    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Send email on confirm or cancel
    const typeLabel = APPOINTMENT_TYPE_LABELS[appointment.type as keyof typeof APPOINTMENT_TYPE_LABELS] || appointment.type;
    const emailData = {
      customerName:  appointment.customerName,
      customerEmail: appointment.customerEmail,
      designerName:  appointment.designerName,
      type:          typeLabel,
      date:          appointment.date,
      time:          appointment.time,
    };

    if (status === 'confirmed') {
      sendAppointmentConfirmedToCustomer(emailData)
        .catch(e => console.error('Confirm email failed:', e));
    } else if (status === 'cancelled') {
      sendAppointmentDeclinedToCustomer(emailData)
        .catch(e => console.error('Cancel email failed:', e));
    }

    return NextResponse.json({ ...appointment, id: (appointment._id as unknown as string).toString() });
  } catch (err) {
    console.error('PATCH /api/appointments/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
