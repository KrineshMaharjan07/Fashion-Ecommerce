// ============================================================
// app/page.tsx — Root redirect to customer homepage
// ============================================================
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/customer');
}
