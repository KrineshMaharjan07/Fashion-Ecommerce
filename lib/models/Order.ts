// ============================================================
// lib/models/Order.ts — Mongoose schema for Order
// ============================================================
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  outfitId: string;
  outfitName: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  district: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    outfitId:   { type: String, required: true },
    outfitName: { type: String, required: true },
    size:       { type: String, required: true },
    quantity:   { type: Number, required: true, min: 1 },
    price:      { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName:    { type: String, required: true },
    customerEmail:   { type: String, required: true },
    customerPhone:   { type: String, required: true },
    items:           [OrderItemSchema],
    total:           { type: Number, required: true, min: 0 },
    status:          { type: String, default: 'pending', enum: ['pending','confirmed','shipped','delivered','cancelled'] },
    shippingAddress: { type: String, required: true },
    district:        { type: String, required: true },
    paymentMethod:   { type: String, required: true },
    notes:           { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
