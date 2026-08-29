import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { performEmailRegister } from '../../lib/firebase';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const token = await performEmailRegister(email, password);
      localStorage.setItem('pelita_auth_token', token);
      localStorage.setItem('pelita_user_name', name.trim());
      navigate('/scanner');
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
          <h1 className="text-2xl font-extrabold text-[#1E2C4F] tracking-tight">Daftar Akun Baru</h1>
          <p className="text-xs text-[#2E3E6E] font-medium">
            Mulai investigasi kontrak dan amankan bukti digital Anda dengan enkripsi AES-256.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#4A69B3] absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#1E2C4F] focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                required
              />
            </div>
          </div>

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
                placeholder="Minimal 6 karakter"
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#1E2C4F] focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email || !password}
            className="tactile-btn w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#BA3801]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#FFEC89]" />
                <span>Buat Akun Terlindungi</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs text-emerald-950 flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Data pribadi Anda terlindungi enkripsi AES-256 dan bebas pelacak iklan.</span>
        </div>

        <div className="text-center text-xs text-[#2E3E6E] font-medium">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-[#BA3801] font-bold hover:underline">
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
};
