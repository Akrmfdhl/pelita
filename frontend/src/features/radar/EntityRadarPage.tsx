import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FintechEntity {
  id: string;
  name: string;
  legalEntity: string;
  licenseNumber: string;
  licenseDate: string;
  website: string;
  androidApp: string;
  iosApp?: string;
  status: 'licensed' | 'illegal' | 'clone_warning';
  camdogCompliance: boolean;
  excessivePermissions: string[];
  description: string;
}

const ENTITY_DATABASE: FintechEntity[] = [
  {
    id: '1',
    name: 'AdaKami',
    legalEntity: 'PT Pembiayaan Digital Indonesia',
    licenseNumber: 'KEP-128/D.05/2019',
    licenseDate: '13 Desember 2019',
    website: 'https://adakami.id',
    androidApp: 'AdaKami - Pinjaman Uang Online',
    iosApp: 'AdaKami',
    status: 'licensed',
    camdogCompliance: true,
    excessivePermissions: [],
    description: 'Penyelenggara fintech lending berizin OJK dengan skema pendanaan konsumtif dan produktif.',
  },
  {
    id: '2',
    name: 'Kredivo',
    legalEntity: 'PT FinAccel Digital Indonesia',
    licenseNumber: 'KEP-10/D.05/2020',
    licenseDate: '24 Januari 2020',
    website: 'https://kredivo.id',
    androidApp: 'Kredivo: Cicilan & Pinjaman',
    iosApp: 'Kredivo',
    status: 'licensed',
    camdogCompliance: true,
    excessivePermissions: [],
    description: 'Layanan kredit instan dan cicilan digital berizin dan diawasi oleh OJK.',
  },
  {
    id: '3',
    name: 'Easycash',
    legalEntity: 'PT Fintag Inovasi Indonesia',
    licenseNumber: 'KEP-49/D.05/2020',
    licenseDate: '16 Oktober 2020',
    website: 'https://easycash.id',
    androidApp: 'Easycash - Pinjaman Online',
    iosApp: 'Easycash',
    status: 'licensed',
    camdogCompliance: true,
    excessivePermissions: [],
    description: 'Platform P2P lending berizin resmi OJK yang menghubungkan pemberi dana dan peminjam.',
  },
  {
    id: '4',
    name: 'Dana Rupiah',
    legalEntity: 'PT Layanan Keuangan Berbagi',
    licenseNumber: 'KEP-18/D.05/2020',
    licenseDate: '19 Mei 2020',
    website: 'https://danarupiah.id',
    androidApp: 'DanaRupiah - Pinjaman Online Cepat',
    status: 'licensed',
    camdogCompliance: true,
    excessivePermissions: [],
    description: 'Fintech lending berizin OJK untuk kebutuhan produktif pertanian dan modal usaha mikro.',
  },
  {
    id: '5',
    name: 'Indodana',
    legalEntity: 'PT Artha Dana Teknologi',
    licenseNumber: 'KEP-48/D.05/2020',
    licenseDate: '19 Mei 2020',
    website: 'https://indodana.id',
    androidApp: 'Indodana PayLater & Pinjaman',
    iosApp: 'Indodana',
    status: 'licensed',
    camdogCompliance: true,
    excessivePermissions: [],
    description: 'Layanan pembiayaan paylater dan pinjaman dana tunai berizin resmi OJK.',
  },
  {
    id: '6',
    name: 'Rupiah Cepat Kilat Online',
    legalEntity: 'Entitas Tanpa Badan Hukum Resmi',
    licenseNumber: 'TIDAK TERDAFTAR (ILEGAL)',
    licenseDate: 'Diblokir Satgas PASTI 2026',
    website: 'http://rupiahcepatkilat-apk.xyz (Situs Palsu)',
    androidApp: 'Rupiah Cepat APK (Distribusi Non-Playstore)',
    status: 'illegal',
    camdogCompliance: false,
    excessivePermissions: ['Kontak Telepon', 'Galeri Foto & Video', 'Riwayat Panggilan & SMS', 'Penyimpanan Internal'],
    description: 'Entitas pinjaman online ilegal yang meminta akses seluruh kontak dan galeri untuk pemerasan.',
  },
  {
    id: '7',
    name: 'Dana Dompet Kilat Petir',
    legalEntity: 'Entitas Fiktif Tanpa Izin OJK',
    licenseNumber: 'TIDAK TERDAFTAR (ILEGAL)',
    licenseDate: 'Diblokir Satgas PASTI 2025',
    website: 'http://petirdana-download.com',
    androidApp: 'Petir Dompet Pro APK',
    status: 'illegal',
    camdogCompliance: false,
    excessivePermissions: ['Daftar Kontak WhatsApp', 'Lokasi GPS Akurat', 'Kamera Latar Belakang'],
    description: 'Penyelenggara ilegal yang mengenakan potongan biaya admin di awal 40% dan tenor 7 hari.',
  },
  {
    id: '8',
    name: 'AdaKami Kloning WhatsApp',
    legalEntity: 'Oknum Penipu Mengatasnamakan AdaKami',
    licenseNumber: 'KLONING PENIPUAN (PALSU)',
    licenseDate: 'Waspada Penipuan Modus CS Palsu',
    website: 'Nomor WhatsApp Pribadi +62895... (Bukan Website Resmi)',
    androidApp: 'File APK dikirim melalui chat WA',
    status: 'clone_warning',
    camdogCompliance: false,
    excessivePermissions: ['File APK Trojan Penyedot SMS OTP'],
    description: 'Modus penipuan meniru nama platform berizin untuk mencuri uang deposit pencairan pinjaman.',
  },
  {
    id: '9',
    name: 'Pinjam Gampang Pro VIP',
    legalEntity: 'Sindikat Pinjol Luar Negeri Tanpa Izin',
    licenseNumber: 'TIDAK TERDAFTAR (ILEGAL)',
    licenseDate: 'Diblokir Satgas PASTI 2026',
    website: 'http://gampangpinjam-vip.top',
    androidApp: 'Gampang Pinjam APK',
    status: 'illegal',
    camdogCompliance: false,
    excessivePermissions: ['Kontak Buku Telepon', 'Foto Pribadi', 'Data Mikrofon'],
    description: 'Entitas ilegal yang menyebarkan data pribadi dan meneror kontak darurat di luar ketentuan.',
  },
];

export const EntityRadarPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'licensed' | 'illegal' | 'clone_warning'>('all');
  const [selectedEntity, setSelectedEntity] = useState<FintechEntity | null>(null);

  const filteredEntities = ENTITY_DATABASE.filter((e) => {
    const matchQuery =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.legalEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchQuery;
    return matchQuery && e.status === statusFilter;
  });

  const countLicensed = ENTITY_DATABASE.filter((e) => e.status === 'licensed').length;
  const countIllegal = ENTITY_DATABASE.filter((e) => e.status === 'illegal').length;
  const countClone = ENTITY_DATABASE.filter((e) => e.status === 'clone_warning').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Hero Stat Banner */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Radar Legalitas &amp; Direktori Satgas PASTI OJK</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Radar Entitas &amp; <span className="text-[#BA3801]">Cek Legalitas Pinjol</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Periksa keabsahan izin 98+ penyelenggara fintech berizin resmi OJK dan waspadai ribuan entitas ilegal serta modus kloning yang diblokir oleh Satgas PASTI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs font-mono text-xs text-left">
              <span className="text-slate-500 block text-[10px]">DATABASE RESMI:</span>
              <span className="text-emerald-700 font-bold text-sm">98 Entitas Berizin OJK</span>
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs font-mono text-xs text-left">
              <span className="text-slate-500 block text-[10px]">TOTAL DIBLOKIR:</span>
              <span className="text-rose-700 font-bold text-sm">8.200+ Entitas Ilegal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama aplikasi, nama PT perusahaan, atau nomor izin KEP OJK..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#1E2C4F] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({ENTITY_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('licensed')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'licensed'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Berizin OJK ({countLicensed})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('illegal')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'illegal'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/80 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Ilegal / Diblokir ({countIllegal})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('clone_warning')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'clone_warning'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Waspada Kloning ({countClone})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Menampilkan {filteredEntities.length} entitas hasil filter</span>
          </div>
          <span>Aturan Izin Akses Perangkat: Hanya CAMDOG (Camera, Microphone, Location)</span>
        </div>
      </div>

      {/* Entity Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntities.map((entity) => (
          <div
            key={entity.id}
            className={`rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 shadow-xs flex flex-col justify-between space-y-4 bg-white ${
              entity.status === 'licensed'
                ? 'border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/5'
                : entity.status === 'illegal'
                ? 'border-rose-200 bg-rose-50/20 hover:border-rose-400 hover:shadow-rose-500/5'
                : 'border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:shadow-amber-500/5'
            }`}
          >
            <div className="space-y-3 text-left">
              {/* Badge Status */}
              <div className="flex items-center justify-between gap-2">
                {entity.status === 'licensed' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>BERIZIN RESMI OJK</span>
                  </span>
                ) : entity.status === 'illegal' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-mono font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ILEGAL &amp; DIBLOKIR</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>MODUS KLONING PALSU</span>
                  </span>
                )}

                <span className="text-[10px] font-mono text-slate-400">ID #{entity.id}</span>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-[#1E2C4F] tracking-tight">{entity.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{entity.legalEntity}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor SK:</span>
                  <span className="font-semibold text-[#1E2C4F] text-right truncate max-w-[170px]">
                    {entity.licenseNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Izin Akses HP:</span>
                  <span
                    className={`font-semibold ${
                      entity.camdogCompliance ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {entity.camdogCompliance ? 'CAMDOG Legal' : 'Ilegal / Predator'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">{entity.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedEntity(entity)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E2C4F] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rincian</span>
              </button>

              {entity.status === 'licensed' ? (
                <a
                  href={entity.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 font-mono truncate"
                >
                  <span>Situs Resmi</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <Link
                  to="/assistant"
                  className="text-xs font-semibold text-[#BA3801] hover:underline flex items-center gap-1 font-mono"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Susun Laporan</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Entitas */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#BA3801]" />
                <h3 className="font-semibold text-lg text-[#1E2C4F]">Rincian Profil Entitas</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">NAMA PLATFORM:</span>
                <span className="font-bold text-base text-[#1E2C4F]">{selectedEntity.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">BADAN HUKUM RESMI:</span>
                <span className="font-semibold text-slate-800">{selectedEntity.legalEntity}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">STATUS IZIN REGULATOR:</span>
                <span
                  className={`font-bold font-mono text-sm ${
                    selectedEntity.status === 'licensed'
                      ? 'text-emerald-700'
                      : selectedEntity.status === 'illegal'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  {selectedEntity.licenseNumber} ({selectedEntity.licenseDate})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px] block">APLIKASI &amp; DISTRIBUSI RESMI:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <span className="font-medium text-slate-800">{selectedEntity.androidApp}</span>
                </div>
              </div>
              {selectedEntity.excessivePermissions.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <span className="font-bold text-rose-900 block font-mono">
                    PERMINTAAN IZIN BERBAHAYA / NON-COMPLIANT:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEntity.excessivePermissions.map((perm, pIdx) => (
                      <span
                        key={pIdx}
                        className="bg-white text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
              {selectedEntity.status !== 'licensed' && (
                <Link
                  to="/assistant"
                  className="px-5 py-2 rounded-full bg-[#BA3801] hover:bg-[#9A2E01] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Laporkan Entitas Ini</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
