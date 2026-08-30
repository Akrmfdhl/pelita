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
  ArrowLeft,
  Scale,
} from 'lucide-react';
import { performEmailLogin, performEmailRegister } from '../../lib/firebase';
import { PelitaLogo } from '../../components/brand/PelitaLogo';

interface AuthLayoutProps {
  initialMode: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ initialMode }) => {
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

  const switchMode = (newMode: 'login' | 'register') => {
    if (newMode === mode) return;
    setErrorMsg(null);
    setMode(newMode);
    window.history.replaceState(null, '', newMode === 'login' ? '/login' : '/register');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
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
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
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
    <div className="min-h-screen bg-[#FFEC89] text-[#1E2C4F] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative selection:bg-[#BA3801] selection:text-white">
      {/* Floating Back to Home Button */}
      <Link
        to="/"
        className="fixed top-5 left-5 z-40 bg-white/90 hover:bg-white text-[#1E2C4F] hover:text-[#BA3801] px-4 py-2 rounded-full text-xs font-semibold border border-slate-200/80 shadow-sm backdrop-blur-md transition-all duration-150 active:scale-95 flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* 2-Column Auth Card */}
      <div className="w-full max-w-4xl min-h-[580px] lg:h-[620px] bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 relative overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column: Login Form */}
        <div
          className={`w-full lg:w-1/2 h-full p-6 sm:p-8 flex flex-col justify-between z-10 transition-opacity duration-300 ${
            mode === 'login' ? 'opacity-100' : 'opacity-0 pointer-events-none hidden lg:flex'
          }`}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <PelitaLogo size="md" variant="horizontal" />
              <h1 className="text-2xl font-semibold text-[#1E2C4F] tracking-tight">Masuk Akun</h1>
              <p className="text-xs text-[#2E3E6E] font-normal leading-relaxed">
                Akses berkas kasus aduan dan riwayat audit kontrak Anda.
              </p>
            </div>

            {isRedirected && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-center gap-2 font-normal leading-snug">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Silakan masuk untuk mengakses modul investigasi.</span>
              </div>
            )}

            {errorMsg && mode === 'login' && (
              <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs text-rose-950 flex items-center gap-2 font-normal leading-snug animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1">
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

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1E2C4F]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-[#2E3E6E] font-normal">
            Belum memiliki akun?{' '}
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-[#BA3801] font-semibold hover:underline cursor-pointer"
            >
              Daftar Sekarang &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div
          className={`w-full lg:w-1/2 h-full p-6 sm:p-8 flex flex-col justify-between z-10 transition-opacity duration-300 ${
            mode === 'register' ? 'opacity-100' : 'opacity-0 pointer-events-none hidden lg:flex'
          }`}
        >
          <div className="space-y-3.5">
            <div className="space-y-2">
              <PelitaLogo size="md" variant="horizontal" />
              <h1 className="text-2xl font-semibold text-[#1E2C4F] tracking-tight">Buat Akun Baru</h1>
              <p className="text-xs text-[#2E3E6E] font-normal leading-relaxed">
                Mulai investigasi kontrak dan amankan bukti digital Anda.
              </p>
            </div>

            {errorMsg && mode === 'register' && (
              <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs text-rose-950 flex items-center gap-2 font-normal leading-snug animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
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

              <div className="space-y-1">
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

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2C4F]">
                    Kata Sandi
                  </label>
                  {password.length > 0 && (
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
                    placeholder="Minimal 8 karakter"
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

                {/* Dynamic Password Strength Progress Bar & Criteria */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} ${strengthWidth} rounded-full transition-all duration-300 ease-out`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors ${
                        reqLength ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${reqLength ? 'text-emerald-600' : 'text-slate-300'}`}
                      />
                      <span>Min. 8 Karakter</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors ${
                        reqUpper ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${reqUpper ? 'text-emerald-600' : 'text-slate-300'}`}
                      />
                      <span>Huruf Besar (A-Z)</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors ${
                        reqNumber ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3 h-3 ${reqNumber ? 'text-emerald-600' : 'text-slate-300'}`}
                      />
                      <span>Angka (0-9)</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors ${
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
              </div>

              <button
                type="submit"
                disabled={loading || !name || !email || !password}
                className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
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
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-center text-xs text-[#2E3E6E] font-normal">
            Sudah memiliki akun?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-[#BA3801] font-semibold hover:underline cursor-pointer"
            >
              Masuk di Sini &rarr;
            </button>
          </div>
        </div>

        {/* Sliding Visual Hero Panel (Desktop Overlay) */}
        <div
          className={`hidden lg:block absolute top-0 bottom-0 w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 overflow-hidden ${
            mode === 'login' ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="w-full h-full relative p-8 flex flex-col justify-between text-white select-none">
            {/* Background Image with Dark Contrast Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-105"
              style={{ backgroundImage: `url('/assets/images/auth-monument.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#1E2C4F]/75 to-[#0F172A]/85" />
            <div className="absolute inset-0 bg-[#BA3801]/10 mix-blend-overlay" />

            {/* Top Brand Info */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <PelitaLogo size="md" variant="horizontal" theme="dark" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-semibold">
                  <Scale className="w-3 h-3 text-[#FFEC89]" />
                  <span>Integritas Hukum</span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white leading-tight">
                {mode === 'login' ? 'Selamat Datang Kembali di Pelita' : 'Mulai Langkah Perlindungan Anda'}
              </h2>
            </div>

            {/* Bottom Quote & Guarantee Card */}
            <div className="relative z-10 space-y-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FFEC89]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Kepatuhan POJK No. 10/2022 &amp; UU PDP</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  "Menegakkan transparansi kontrak pinjaman online dan merekonstruksi bukti intimidasi penagihan secara terstruktur."
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
                <span>Enkripsi Sisi Klien Aktif</span>
                <span>Standar Otoritas Regulasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
