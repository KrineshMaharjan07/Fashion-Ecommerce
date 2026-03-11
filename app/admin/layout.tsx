'use client';
// ============================================================
// app/admin/layout.tsx — Admin panel layout with sidebar nav
// ============================================================
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Calendar, ClipboardList,
  Users, Settings, LogOut, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/outfits', icon: ShoppingBag, label: 'Outfits' },
  { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/admin/designers', icon: Users, label: 'Designers' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4EF]">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-56 xl:w-64 flex-shrink-0 bg-charcoal min-h-screen sticky top-0 h-screen flex flex-col">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-xl tracking-widest text-ivory">
            ATELIER<span className="text-champagne">·</span>ADMIN
          </Link>
          <p className="font-mono text-[10px] text-ivory/30 tracking-widest uppercase mt-1">Management Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link mb-0.5 rounded-sm ${isActive ? 'active !text-ivory !bg-white/10 !border-l-champagne' : '!text-ivory/50 hover:!text-ivory hover:!bg-white/5'}`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto text-champagne" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="py-4 px-2 border-t border-white/10">
          <Link href="/customer" className="nav-link !text-ivory/30 hover:!text-ivory/60 hover:!bg-transparent text-xs mb-1" target="_blank">
            <Settings size={13} />
            <span>View Store</span>
          </Link>
          <button onClick={handleLogout} className="nav-link w-full !text-ivory/30 hover:!text-red-400 hover:!bg-transparent">
            <LogOut size={13} />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
