// ============================================================
// app/api/outfits/route.ts — GET all outfits, POST create
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Outfit from '@/lib/models/Outfit';

// GET /api/outfits — fetch all outfits (with optional filters)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filter: Record<string, unknown> = {};

    const category = searchParams.get('category');
    if (category && category !== 'all') filter.category = category;

    const inStock = searchParams.get('inStock');
    if (inStock === 'true') filter.inStock = true;

    const featured = searchParams.get('featured');
    if (featured === 'true') filter.featured = true;

    const search = searchParams.get('search');
    if (search) filter.$text = { $search: search };

    const sort = searchParams.get('sort') || 'newest';
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt: 1 },
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
    };

    const outfits = await Outfit.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .lean();

    // Normalize _id to id for frontend compatibility
    const normalized = outfits.map(o => ({ ...o, id: o._id.toString() }));
    return NextResponse.json(normalized);
  } catch (err) {
    console.error('GET /api/outfits error:', err);
    return NextResponse.json({ error: 'Failed to fetch outfits' }, { status: 500 });
  }
}

// POST /api/outfits — create a new outfit
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const outfit = await Outfit.create(body);
    return NextResponse.json({ ...outfit.toJSON(), id: outfit._id.toString() }, { status: 201 });
  } catch (err) {
    console.error('POST /api/outfits error:', err);
    return NextResponse.json({ error: 'Failed to create outfit' }, { status: 500 });
  }
}
