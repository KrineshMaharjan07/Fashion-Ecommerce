// ============================================================
// lib/models/Appointment.ts — Mongoose schema for Appointment
// ============================================================
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  designerId: string;
  designerName: string;
  date: string;
  time: string;
  type: 'consultation' | 'fitting' | 'alteration' | 'custom-design';
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    designerId:    { type: String, required: true },
    designerName:  { type: String, required: true },
    date:          { type: String, required: true },
    time:          { type: String, required: true },
    type:          { type: String, required: true, enum: ['consultation','fitting','alteration','custom-design'] },
    notes:         { type: String, default: '' },
    status:        { type: String, default: 'pending', enum: ['pending','confirmed','completed','cancelled'] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ?? mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
