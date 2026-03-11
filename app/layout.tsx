// ============================================================
// app/layout.tsx — Root layout
// ============================================================
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atelier Noir — Fashion Designers',
  description: 'Ready-to-wear and bespoke fashion from independent designers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
