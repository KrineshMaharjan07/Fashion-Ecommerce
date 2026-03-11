// ============================================================
// lib/models/Outfit.ts — Mongoose schema for Outfit
// ============================================================
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOutfit extends Document {
  //_id: string;
  name: string;
  designer: string;
  price: number;
  originalPrice?: number;
  category: 'evening' | 'casual' | 'bridal' | 'resort' | 'couture';
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    name:          { type: String, required: true, trim: true },
    designer:      { type: String, required: true, trim: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category:      { type: String, required: true, enum: ['evening','casual','bridal','resort','couture'] },
    description:   { type: String, required: true },
    details:       [{ type: String }],
    images:        [{ type: String }],
    sizes:         [{ type: String, enum: ['XS','S','M','L','XL','XXL'] }],
    inStock:       { type: Boolean, default: true },
    featured:      { type: Boolean, default: false },
    tags:          [{ type: String }],
  },
  {
    timestamps: true,    // auto-manages createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search
OutfitSchema.index({ name: 'text', designer: 'text', tags: 'text' });

const Outfit: Model<IOutfit> =
  mongoose.models.Outfit ?? mongoose.model<IOutfit>('Outfit', OutfitSchema);

export default Outfit;
