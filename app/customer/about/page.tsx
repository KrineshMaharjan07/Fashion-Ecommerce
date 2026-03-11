// ============================================================
// app/customer/about/page.tsx — About / brand page
// ============================================================
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center grain-overlay overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1600&h=800&fit=crop" alt="Atelier" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-obsidian/60" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-champagne mb-4">Our Story</p>
          <h1 className="font-display text-6xl lg:text-7xl font-light text-ivory max-w-2xl">
            Born from a love of<br /><em>true craftsmanship</em>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-4xl font-light mb-6">The Atelier Noir Ethos</h2>
            <p className="font-body text-sm leading-loose text-charcoal mb-4">
              Atelier Noir was conceived as a sanctuary for fashion lovers who believe that what you wear is the most intimate art form. We exist to connect the world's most extraordinary independent designers with the people who will cherish their work.
            </p>
            <p className="font-body text-sm leading-loose text-charcoal mb-4">
              Unlike conventional fashion retail, we operate on the principle that every piece deserves to be known — its origin, its maker, its intention. When you purchase from Atelier Noir, we ensure that story travels with the garment.
            </p>
            <p className="font-body text-sm leading-loose text-charcoal mb-8">
              Our bespoke appointment service extends beyond commerce into collaboration. We believe the greatest luxury is not a price tag, but the experience of working directly with a designer who listens.
            </p>
            <Link href="/customer/shop" className="btn-primary">
              Shop the Collection <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="img-zoom aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=500&fit=crop" alt="Atelier" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '3', label: 'Resident Designers' },
                { number: '40+', label: 'Curated Pieces' },
                { number: '5★', label: 'Client Experience' },
                { number: '100%', label: 'Independent' },
              ].map(({ number, label }) => (
                <div key={label} className="bg-charcoal p-5 text-center">
                  <p className="font-display text-4xl text-champagne">{number}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-ivory/50 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand/10 py-20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-3">What We Stand For</p>
            <h2 className="font-display text-4xl font-light">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', text: 'Every designer on our platform is independent, hand-selected for their unique voice and commitment to quality.' },
              { title: 'Craft', text: 'We celebrate the slow fashion movement — pieces made with care, expertise, and materials that honor the Earth.' },
              { title: 'Connection', text: 'Our appointment service bridges the gap between client and creator, making fashion a conversation rather than a transaction.' },
            ].map(({ title, text }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-px bg-champagne mx-auto mb-5" />
                <h3 className="font-display text-2xl mb-3">{title}</h3>
                <p className="font-body text-sm text-slate leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
