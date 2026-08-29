import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { performEmailLogin } from '../../lib/firebase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  const isRedirected = fromLocation !== '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const token = await performEmailLogin(email, password);
      localStorage.setItem('pelita_auth_token', token);
      localStorage.setItem('pelita_user_name', email.split('@')[0] || 'Pengguna');
      navigate(fromLocation, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('demo.user@pelita.id');
    setPassword('PelitaSecure2026!');
    setLoading(true);
    try {
      const token = await performEmailLogin('demo.user@pelita.id', 'PelitaSecure2026!');
      localStorage.setItem('pelita_auth_token', token);
      localStorage.setItem('pelita_user_name', 'DemoUser');
      navigate(fromLocation, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border-2 border-[#4A69B3] rounded-3xl p-8 shadow-2xl shadow-[#1E2C4F]/10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#BA3801] text-white font-mono font-bold flex items-center justify-center text-lg mx-auto shadow-md">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E2C4F] tracking-tight">Masuk ke Akun Pelita</h1>
          <p className="text-xs text-[#2E3E6E] font-medium">
            Akses berkas kasus aduan dan riwayat audit kontrak Anda yang terenkripsi.
          </p>
        </div>

        {isRedirected && (
          <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl text-xs text-amber-950 flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Silakan masuk untuk mengakses modul investigasi terlindungi.</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4A69B3] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#1E2C4F] focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4A69B3] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#1E2C4F] focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="tactile-btn w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#BA3801]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#FFEC89]" />
                <span>Masuk ke Akun</span>
              </>
            )}
          </button>
        </form>

        <div className="relative border-t border-[#4A69B3]/25 pt-4">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="tactile-btn w-full bg-white hover:bg-[#FFEC89] border-2 border-[#4A69B3] text-[#1E2C4F] py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BA3801]" />
            <span>Masuk Cepat Mode Demo (1-Klik Juri)</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#2E3E6E] font-medium">
          Belum memiliki akun?{' '}
          <Link to="/register" className="text-[#BA3801] font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};
