// ============================================================
// components/customer/Footer.tsx — Site footer
// ============================================================
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/80 mt-20">
      {/* Marquee band */}
      <div className="border-y border-ivory/10 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(8).fill('ATELIER NOIR · READY-TO-WEAR · BESPOKE · APPOINTMENTS · ').map((t, i) => (
            <span key={i} className="font-mono text-xs tracking-widest text-champagne/80 mr-0">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-display text-2xl tracking-widest text-ivory mb-4">
            ATELIER<span className="text-champagne">·</span>NOIR
          </p>
          <p className="font-body text-xs leading-relaxed text-ivory/50">
            Where independent fashion designers connect with those who appreciate the art of dress.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-4">Shop</p>
          <ul className="space-y-2">
            {['Evening', 'Bridal', 'Resort', 'Casual', 'Couture'].map(cat => (
              <li key={cat}>
                <Link href={`/customer/shop?category=${cat.toLowerCase()}`} className="font-body text-xs hover:text-ivory transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-4">Services</p>
          <ul className="space-y-2">
            {['Book Appointment', 'Custom Design', 'Fittings', 'Alterations', 'Gift Cards'].map(item => (
              <li key={item}>
                <Link href="/customer/appointments" className="font-body text-xs hover:text-ivory transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-champagne mb-4">Contact</p>
          <address className="not-italic space-y-2">
            <p className="font-body text-xs text-ivory/50">12 Rue de la Paix</p>
            <p className="font-body text-xs text-ivory/50">Paris, France 75001</p>
            <a href="mailto:hello@ateliernoir.com" className="font-body text-xs hover:text-ivory transition-colors block mt-3">
              hello@ateliernoir.com
            </a>
            <a href="tel:+33123456789" className="font-body text-xs hover:text-ivory transition-colors block">
              +33 1 23 45 67 89
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-ivory/10 px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="font-mono text-[10px] tracking-wider text-ivory/30">
          © 2024 Atelier Noir. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Accessibility'].map(item => (
            <Link key={item} href="#" className="font-mono text-[10px] tracking-wider text-ivory/30 hover:text-ivory/60 transition-colors">
              {item}
            </Link>
          ))}
          <Link href="/admin" className="font-mono text-[10px] tracking-wider text-ivory/20 hover:text-ivory/40 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
