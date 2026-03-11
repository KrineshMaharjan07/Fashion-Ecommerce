'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <p className="font-display text-3xl tracking-widest text-ivory">
              ATELIER<span style={{ color: '#D4AF7A' }}>·</span>NOIR
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border" style={{ borderColor: '#D4AF7A33', background: '#D4AF7A15' }}>
              <Lock size={20} style={{ color: '#D4AF7A' }} />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-light text-ivory mb-2">Admin Access</h1>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#8B8680' }}>
              Restricted Area
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#8B8680' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 font-body text-sm outline-none transition-all"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                onFocus={e => e.target.style.borderColor = '#D4AF7A'}
                onBlur={e => e.target.style.borderColor = '#2A2A2A'}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#8B8680' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 font-body text-sm outline-none transition-all"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#F5F0E8' }}
                  onFocus={e => e.target.style.borderColor = '#D4AF7A'}
                  onBlur={e => e.target.style.borderColor = '#2A2A2A'}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#8B8680' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="px-4 py-3 text-xs font-body animate-fade-in" style={{ background: '#2A0A0A', borderLeft: '3px solid #8B0000', color: '#F87171' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-3 font-mono text-xs tracking-[0.2em] uppercase transition-all mt-2"
              style={{
                background: loading ? '#2A2A2A' : '#D4AF7A',
                color: '#0A0A0A',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: (!username || !password) ? 0.5 : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3 h-3 border border-obsidian/40 border-t-obsidian rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
          <p className="text-center font-mono text-[10px] tracking-wider mt-8" style={{ color: '#3A3A3A' }}>
            Unauthorized access is prohibited.
          </p>
        </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0A' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=1200&fit=crop"
            alt="Atelier"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        </div>
        <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-10">
          <div>
            <p className="font-display text-3xl tracking-widest text-ivory font-light">
              ATELIER<span style={{ color: '#D4AF7A' }}>·</span>NOIR
            </p>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mt-1" style={{ color: '#D4AF7A' }}>
              Admin Console
            </p>
          </div>
          <div className="w-px h-16 bg-champagne/30 mt-1" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-px mb-6" style={{ background: '#D4AF7A' }} />
          <p className="font-display text-4xl font-light text-ivory leading-tight mb-4">
            "Fashion is the<br />
            <em style={{ color: '#D4AF7A' }}>armor</em> to survive<br />
            everyday life."
          </p>
          <p className="font-mono text-[10px] tracking-widest text-ivory/40 uppercase">
            — Bill Cunningham
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#111111' }}>
        <Suspense fallback={<div style={{ color: '#8B8680' }} className="font-mono text-xs tracking-widest">Loading...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}