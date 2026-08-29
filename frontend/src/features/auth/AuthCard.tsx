import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { performEmailLogin, performEmailRegister } from '../../lib/firebase';

interface AuthCardProps {
  initialMode: 'login' | 'register';
}

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/scanner';
  const isRedirected = (location.state as { from?: { pathname: string } })?.from?.pathname !== undefined;

  const reqLength = password.length >= 8;
  const reqUpper = /[A-Z]/.test(password);
  const reqNumber = /[0-9]/.test(password);
  const reqSymbol = /[^A-Za-z0-9]/.test(password);

  const passedCount = [reqLength, reqUpper, reqNumber, reqSymbol].filter(Boolean).length;

  let strengthLabel = 'Belum Diisi';
  let strengthColor = 'bg-slate-200';
  let strengthTextColor = 'text-slate-400';
  let strengthWidth = 'w-0';

  if (password.length > 0) {
    if (passedCount <= 1) {
      strengthLabel = 'Sangat Lemah';
      strengthColor = 'bg-rose-500';
      strengthTextColor = 'text-rose-600';
      strengthWidth = 'w-1/4';
    } else if (passedCount === 2) {
      strengthLabel = 'Cukup';
      strengthColor = 'bg-amber-500';
      strengthTextColor = 'text-amber-600';
      strengthWidth = 'w-2/4';
    } else if (passedCount === 3) {
      strengthLabel = 'Kuat';
      strengthColor = 'bg-blue-600';
      strengthTextColor = 'text-blue-600';
      strengthWidth = 'w-3/4';
    } else {
      strengthLabel = 'Sangat Kuat & Aman';
      strengthColor = 'bg-emerald-500';
      strengthTextColor = 'text-emerald-600';
      strengthWidth = 'w-full';
    }
  }

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    if (newMode === mode) return;
    setErrorMsg(null);
    setMode(newMode);
    window.history.replaceState(null, '', newMode === 'login' ? '/login' : '/register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) return;
      setLoading(true);
      try {
        const token = await performEmailLogin(email, password);
        localStorage.setItem('pelita_auth_token', token);
        localStorage.setItem('pelita_user_name', email.split('@')[0] || 'Pengguna');
        navigate(fromLocation, { replace: true });
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error?.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) return;
      if (passedCount < 2) {
        setErrorMsg('Kata sandi harus memenuhi minimal 2 kriteria keamanan.');
        return;
      }
      setLoading(true);
      try {
        const token = await performEmailRegister(email, password);
        localStorage.setItem('pelita_auth_token', token);
        localStorage.setItem('pelita_user_name', name.trim());
        navigate('/scanner', { replace: true });
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error?.message || 'Gagal mendaftar. Email mungkin sudah terdaftar.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    setEmail('demo.user@pelita.id');
    setPassword('PelitaSecure2026!');
    setLoading(true);
    try {
      const token = await performEmailLogin('demo.user@pelita.id', 'PelitaSecure2026!');
      localStorage.setItem('pelita_auth_token', token);
      localStorage.setItem('pelita_user_name', 'DemoUser');
      navigate(fromLocation, { replace: true });
    } catch {
      setErrorMsg('Gagal masuk mode demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group">
            <div className="w-11 h-11 rounded-2xl bg-[#BA3801] text-white font-mono font-bold flex items-center justify-center text-base mx-auto shadow-2xs group-hover:scale-105 transition-transform duration-150">
              P
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1E2C4F] tracking-tight">
            {mode === 'login' ? 'Masuk ke Pelita' : 'Buat Akun Pelita'}
          </h1>
          <p className="text-xs text-[#2E3E6E] font-normal leading-relaxed">
            {mode === 'login'
              ? 'Akses berkas kasus aduan dan riwayat audit kontrak Anda.'
              : 'Amankan bukti digital dan lakukan audit kepatuhan pinjaman.'}
          </p>
        </div>

        {/* Sliding Segment Tab */}
        <div className="p-1 bg-slate-100/90 rounded-full border border-slate-200/60 relative grid grid-cols-2 text-xs font-semibold select-none">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#1E2C4F] shadow-sm transition-transform duration-300 ease-out ${
              mode === 'login' ? 'translate-x-1' : 'translate-x-[calc(100%+4px)]'
            }`}
          />
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`relative z-10 py-2 rounded-full text-center transition-colors duration-200 ${
              mode === 'login' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Sesi
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`relative z-10 py-2 rounded-full text-center transition-colors duration-200 ${
              mode === 'register' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {isRedirected && (
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-center gap-2 font-normal leading-snug">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Silakan masuk untuk mengakses modul investigasi terlindungi.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs text-rose-950 flex items-center gap-2 font-normal leading-snug animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form with Sliding Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5 transition-all duration-300">
              <label className="block text-xs font-semibold text-[#1E2C4F]">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1E2C4F]">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1E2C4F]">
                Kata Sandi
              </label>
              {mode === 'register' && password.length > 0 && (
                <span className={`text-[10px] font-mono font-semibold ${strengthTextColor}`}>
                  {strengthLabel}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Minimal 8 karakter' : '••••••••'}
                className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors active:scale-90"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Meter in Register Mode */}
            {mode === 'register' && (
              <div className="space-y-2.5 pt-1.5 transition-all duration-300">
                {/* Visual Progress Track */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColor} ${strengthWidth} rounded-full transition-all duration-300 ease-out`}
                  />
                </div>

                {/* Requirements Checklist Pills */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      reqLength ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${reqLength ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>Min. 8 Karakter</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      reqUpper ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${reqUpper ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>Huruf Besar (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      reqNumber ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${reqNumber ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>Angka (0-9)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      reqSymbol ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${reqSymbol ? 'text-emerald-600' : 'text-slate-300'}`}
                    />
                    <span>Simbol (@$!%*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password || (mode === 'register' && !name)}
            className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4 text-[#FFEC89]" />
                <span>Masuk ke Akun</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#FFEC89]" />
                <span>Buat Akun Terlindungi</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Access */}
        <div className="relative border-t border-slate-200/60 pt-4">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-[#1E2C4F] py-2.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-2xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#BA3801]" />
            <span>Masuk Cepat Mode Demo</span>
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl text-[11px] text-emerald-950 flex items-center gap-2 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Privasi data Anda terlindungi dan terenkripsi penuh.</span>
        </div>
      </div>
    </div>
  );
};
