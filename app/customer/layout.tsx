// ============================================================
// app/customer/layout.tsx — Customer section layout
// ============================================================
import CustomerNavbar from '@/components/customer/Navbar';
import CartDrawer from '@/components/customer/CartDrawer';
import Footer from '@/components/customer/Footer';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerNavbar />
      <CartDrawer />
      <main className="pt-16 lg:pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
