// ============================================================
// lib/store.ts — Central mock data store + Zustand state
// ============================================================

export type Category = 'evening' | 'casual' | 'bridal' | 'resort' | 'couture';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Outfit {
  id: string;
  name: string;
  designer: string;
  price: number;
  originalPrice?: number;
  category: Category;
  description: string;
  details: string[];
  images: string[];
  sizes: Size[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  outfitId: string;
  size: Size;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  designerId: string;
  designerName: string;
  date: string;
  time: string;
  type: 'consultation' | 'fitting' | 'alteration' | 'custom-design';
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Designer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  availability: string[];
}

// ──────────────────────────────────────────
// SEED DATA
// ──────────────────────────────────────────

export const DESIGNERS: Designer[] = [
  {
    id: 'd1',
    name: 'Isabelle Fontaine',
    specialty: 'Couture & Bridal',
    bio: 'Paris-trained master of intricate beadwork and silk construction with 15 years of haute couture experience.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
    availability: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: 'd2',
    name: 'Marcus Delacroix',
    specialty: 'Evening & Resort Wear',
    bio: 'Known for sculptural silhouettes and innovative fabric manipulation that blur the line between art and fashion.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    id: 'd3',
    name: 'Yuki Tanaka',
    specialty: 'Minimalist & Casual',
    bio: 'Tokyo-based designer merging Japanese textile traditions with contemporary minimalism.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    availability: ['Monday', 'Tuesday', 'Thursday'],
  },
];

export const OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: 'Obsidian Cascade Gown',
    designer: 'Isabelle Fontaine',
    price: 2850,
    originalPrice: 3200,
    category: 'evening',
    description: 'A floor-sweeping column gown in liquid obsidian silk charmeuse with a dramatic cascading back panel.',
    details: ['100% Silk Charmeuse', 'Hand-beaded bodice', 'Dry clean only', 'Made in France'],
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    featured: true,
    tags: ['gown', 'black-tie', 'silk', 'beaded'],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-01',
  },
  {
    id: 'o2',
    name: 'Champagne Reverie Dress',
    designer: 'Isabelle Fontaine',
    price: 1950,
    category: 'bridal',
    description: 'An ethereal bridal dress in champagne organza layered over duchess satin, with hand-appliqued florals.',
    details: ['Organza over duchess satin', 'Hand-appliqued silk florals', 'Chapel train', 'Custom sizing available'],
    images: [
      'https://images.unsplash.com/photo-1519657103702-35e3e1f3e7c2?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true,
    tags: ['bridal', 'white', 'organza', 'floral'],
    createdAt: '2024-01-20',
    updatedAt: '2024-02-10',
  },
  {
    id: 'o3',
    name: 'Sculptural Void Jumpsuit',
    designer: 'Marcus Delacroix',
    price: 1200,
    category: 'couture',
    description: 'An architectural wide-leg jumpsuit in matte black crepe with exaggerated shoulder construction.',
    details: ['Wool-silk blend crepe', 'Structured shoulder boning', 'Concealed zip closure', 'Dry clean only'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false,
    tags: ['jumpsuit', 'black', 'architectural', 'structured'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15',
  },
  {
    id: 'o4',
    name: 'Coral Mirage Set',
    designer: 'Marcus Delacroix',
    price: 890,
    category: 'resort',
    description: 'A resort-ready co-ord in hand-printed coral linen; wide-brim matching trousers and cut-out bandeau.',
    details: ['100% Linen', 'Hand-screen printed', 'Resort wear', 'Machine washable'],
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    tags: ['resort', 'linen', 'co-ord', 'summer'],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-20',
  },
  {
    id: 'o5',
    name: 'Wabi-Sabi Linen Coat',
    designer: 'Yuki Tanaka',
    price: 1680,
    category: 'casual',
    description: 'An oversized, deconstructed coat in raw-edged Japanese linen with intentional imperfections.',
    details: ['Stone-washed Japanese linen', 'Intentionally frayed edges', 'Oversized fit', 'Hand wash cold'],
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1100&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false,
    tags: ['coat', 'linen', 'oversized', 'minimalist'],
    createdAt: '2024-02-10',
    updatedAt: '2024-03-01',
  },
  {
    id: 'o6',
    name: 'Midnight Garden Slip',
    designer: 'Yuki Tanaka',
    price: 640,
    category: 'casual',
    description: 'A whisper-thin silk slip dress printed with hand-painted midnight botanicals on a navy ground.',
    details: ['100% Mulberry Silk', 'Hand-painted print', 'Adjustable straps', 'Dry clean only'],
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: false,
    featured: false,
    tags: ['slip', 'silk', 'printed', 'navy'],
    createdAt: '2024-02-12',
    updatedAt: '2024-03-05',
  },
  {
    id: 'o7',
    name: 'Ivory Labyrinth Blouse',
    designer: 'Isabelle Fontaine',
    price: 480,
    category: 'casual',
    description: 'A sculptural ivory blouse with labyrinthine pintuck detailing across a voluminous silhouette.',
    details: ['100% Cotton Voile', '300+ individual pintucks', 'Oversized fit', 'Hand wash only'],
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false,
    tags: ['blouse', 'ivory', 'cotton', 'pintuck'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'o8',
    name: 'Gilded Dusk Gown',
    designer: 'Marcus Delacroix',
    price: 3400,
    category: 'evening',
    description: 'A backless column gown with hand-applied gold leaf and sequin gradient from hem to hip.',
    details: ['Silk crepe base', 'Hand-applied 24k gold leaf', 'Sequin gradient', 'Dry clean only'],
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1100&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    featured: true,
    tags: ['gown', 'gold', 'backless', 'sequin'],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
];

export const ORDERS: Order[] = [
  {
    id: 'ord-001',
    customerId: 'c1',
    customerName: 'Amélie Laurent',
    customerEmail: 'amelie@example.com',
    items: [{ outfitId: 'o1', size: 'S', quantity: 1 }],
    total: 2850,
    status: 'shipped',
    shippingAddress: '12 Rue de Rivoli, Paris, France',
    createdAt: '2024-03-10',
  },
  {
    id: 'ord-002',
    customerId: 'c2',
    customerName: 'Sofia Reyes',
    customerEmail: 'sofia@example.com',
    items: [{ outfitId: 'o4', size: 'M', quantity: 1 }],
    total: 890,
    status: 'confirmed',
    shippingAddress: '5 Calle Mayor, Madrid, Spain',
    createdAt: '2024-03-12',
  },
  {
    id: 'ord-003',
    customerId: 'c3',
    customerName: 'Naomi Chen',
    customerEmail: 'naomi@example.com',
    items: [
      { outfitId: 'o5', size: 'L', quantity: 1 },
      { outfitId: 'o6', size: 'S', quantity: 1 },
    ],
    total: 2320,
    status: 'pending',
    shippingAddress: '88 Nathan Road, Hong Kong',
    createdAt: '2024-03-14',
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    customerName: 'Victoria Holt',
    customerEmail: 'victoria@example.com',
    customerPhone: '+44 20 7946 0958',
    designerId: 'd1',
    designerName: 'Isabelle Fontaine',
    date: '2024-03-20',
    time: '10:00 AM',
    type: 'custom-design',
    notes: 'Looking for a bespoke gown for a black-tie charity gala.',
    status: 'confirmed',
    createdAt: '2024-03-10',
  },
  {
    id: 'apt-002',
    customerName: 'Elena Voronova',
    customerEmail: 'elena@example.com',
    customerPhone: '+7 495 123 4567',
    designerId: 'd2',
    designerName: 'Marcus Delacroix',
    date: '2024-03-22',
    time: '2:00 PM',
    type: 'fitting',
    notes: 'Fitting for Gilded Dusk Gown, order #ord-004.',
    status: 'pending',
    createdAt: '2024-03-13',
  },
  {
    id: 'apt-003',
    customerName: 'Mia Yamamoto',
    customerEmail: 'mia@example.com',
    customerPhone: '+81 3 1234 5678',
    designerId: 'd3',
    designerName: 'Yuki Tanaka',
    date: '2024-03-25',
    time: '11:30 AM',
    type: 'consultation',
    notes: 'Interested in minimalist bridal options.',
    status: 'confirmed',
    createdAt: '2024-03-14',
  },
];
