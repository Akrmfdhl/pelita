import React, { useState } from 'react';
import {
  BarChart3,
  MapPin,
  Clock,
  ShieldAlert,
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegionData {
  region: string;
  cases: number;
  percentage: number;
  topViolation: string;
}

const REGION_STATS: RegionData[] = [
  { region: 'Pulau Jawa & Jabodetabek', cases: 8650, percentage: 58.4, topViolation: 'Teror Sebar Data KTP & Kontak Kantor' },
  { region: 'Pulau Sumatera', cases: 3110, percentage: 21.0, topViolation: 'Bunga Ilegal & Penagihan Kasar Malam Hari' },
  { region: 'Pulau Kalimantan', cases: 1185, percentage: 8.0, topViolation: 'Intimidasi Kontak Darurat Keluarga' },
  { region: 'Pulau Sulawesi', cases: 1040, percentage: 7.0, topViolation: 'Aplikasi Pinjol Kloning Tanpa Izin' },
  { region: 'Bali & Nusa Tenggara', cases: 590, percentage: 4.0, topViolation: 'Pemerasan Denda Harian 2% / Hari' },
  { region: 'Maluku & Papua', cases: 245, percentage: 1.6, topViolation: 'Akses Galeri & Foto Pribadi' },
];

const HOURLY_TERROR_DATA = [
  { hour: '00:00', count: 12, isIllegal: true },
  { hour: '02:00', count: 8, isIllegal: true },
  { hour: '04:00', count: 5, isIllegal: true },
  { hour: '06:00', count: 14, isIllegal: true },
  { hour: '08:00', count: 35, isIllegal: false },
  { hour: '10:00', count: 55, isIllegal: false },
  { hour: '12:00', count: 48, isIllegal: false },
  { hour: '14:00', count: 62, isIllegal: false },
  { hour: '16:00', count: 70, isIllegal: false },
  { hour: '18:00', count: 88, isIllegal: false },
  { hour: '20:00', count: 142, isIllegal: true },
  { hour: '21:00', count: 195, isIllegal: true },
  { hour: '22:00', count: 230, isIllegal: true },
  { hour: '23:00', count: 160, isIllegal: true },
];

export const NationalStatsPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(REGION_STATS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Hero Title */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <BarChart3 className="w-4 h-4 text-[#BA3801]" />
          <span>Indeks Nasional Pemantauan Kejahatan Finansial Digital RI</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Peta Sebaran &amp; <span className="text-[#BA3801]">Statistik Teror Pinjol</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Dashboard intelijen advokasi publik Pelita menyajikan fakta agregat pola penagihan kasar, jam teror ilegal, dan tren pelanggaran privasi data di seluruh Indonesia.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-mono text-[#1E2C4F] shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Pembaruan Data Agregat: Q3 2026</span>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>TOTAL KASUS TERTANGANI</span>
            <Users className="w-4 h-4 text-[#BA3801]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1E2C4F] tracking-tight">14.820+</div>
          <p className="text-[11px] text-slate-500 font-mono">Dossier aduan masyarakat diverifikasi</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>DANA TERSELAMATKAN</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">Rp 18,4 M</div>
          <p className="text-[11px] text-slate-500 font-mono">Kelebihan bunga ilegal berhasil ditolak</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>TEROR MALAM HARI</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 tracking-tight">78.4%</div>
          <p className="text-[11px] text-slate-500 font-mono">Penagihan melanggar jam 20.00-08.00</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>SEBAR DATA KTP &amp; KONTAK</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 tracking-tight">86.2%</div>
          <p className="text-[11px] text-slate-500 font-mono">Pelanggaran UU PDP Pasal 65 terdeteksi</p>
        </div>
      </div>

      {/* Main Grid: Regional Distribution Map + Hourly Terror Spike Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left: Regional Island Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#BA3801]" />
              <h2 className="font-semibold text-lg text-[#1E2C4F]">Sebaran Wilayah Aduan di Indonesia</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">6 Gugus Kepulauan</span>
          </div>

          <div className="space-y-3">
            {REGION_STATS.map((reg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col space-y-2 ${
                  selectedRegion.region === reg.region
                    ? 'bg-slate-50 border-[#BA3801] shadow-2xs ring-1 ring-[#BA3801]/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1E2C4F]">{reg.region}</span>
                  <span className="font-mono font-bold text-xs text-[#BA3801]">
                    {reg.cases.toLocaleString('id-ID')} Kasus ({reg.percentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#BA3801] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${reg.percentage}%` }}
                  />
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Modus Utama: <span className="text-slate-800 font-medium">{reg.topViolation}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Hourly Terror Peak Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ring-1 ring-slate-900/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#BA3801]" />
                <h2 className="font-semibold text-lg text-[#1E2C4F]">Jam Rawan Teror Penagihan</h2>
              </div>
              <span className="text-xs font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                Spike Malam Hari
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Berdasarkan <strong>POJK No. 22/2023 Pasal 62</strong>, penagihan hanya diperkenankan pada pukul <strong>08.00 - 20.00</strong>. Data menunjukkan lonjakan teror psikologis terbesar terjadi pada pukul <strong>20.00 - 23.00 WIB</strong> saat korban beristirahat.
            </p>

            {/* Custom Vertical Bar Chart Representation */}
            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between gap-1.5 h-44 border-b border-slate-200 px-2">
                {HOURLY_TERROR_DATA.map((item, idx) => {
                  const heightPercent = (item.count / 230) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          item.isIllegal
                            ? 'bg-rose-500 group-hover:bg-rose-600'
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500 rotate-45 origin-left mt-2 block">
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-300" />
                  <span className="text-slate-600">Jam Resmi (08.00-20.00)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" />
                  <span className="text-rose-700 font-bold">Jam Teror Ilegal (20.00-08.00)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-left">
              <span className="font-semibold text-xs text-[#1E2C4F] block">
                Menjadi Korban Teror Malam Hari?
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Ekstrak screenshot bukti dan susun dossier pengaduan resmi.
              </span>
            </div>

            <Link
              to="/assistant"
              className="px-4 py-2 rounded-full bg-[#BA3801] hover:bg-[#9A2E01] text-white text-xs font-semibold whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5"
            >
              <span>Lapor ke Lita AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
