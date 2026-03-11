'use client';
import OutfitForm from '@/components/admin/OutfitForm';
export default function EditOutfitPage({ params }: { params: { id: string } }) {
  return <OutfitForm id={params.id} />;
}
