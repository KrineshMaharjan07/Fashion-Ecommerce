// ============================================================
// app/api/outfits/[id]/route.ts — GET one, PATCH, DELETE
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Outfit from '@/lib/models/Outfit';

type Params = { params: { id: string } };

// GET /api/outfits/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const outfit = await Outfit.findById(params.id).lean();
    if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...outfit, id: (outfit._id as unknown as string).toString() });
  } catch (err) {
    console.error('GET /api/outfits/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch outfit' }, { status: 500 });
  }
}

// PATCH /api/outfits/:id — partial update
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const outfit = await Outfit.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...outfit, id: (outfit._id as unknown as string).toString() });
  } catch (err) {
    console.error('PATCH /api/outfits/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update outfit' }, { status: 500 });
  }
}

// DELETE /api/outfits/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const outfit = await Outfit.findByIdAndDelete(params.id);
    if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/outfits/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete outfit' }, { status: 500 });
  }
}
