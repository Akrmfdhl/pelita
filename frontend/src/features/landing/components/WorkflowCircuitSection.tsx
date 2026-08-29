import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

export const WorkflowCircuitSection: React.FC = () => {
  const [activeCircuitNode, setActiveCircuitNode] = useState<number>(1);

  const circuitSteps = [
    {
      id: 1,
      title: '1. Ingesti Bukti Digital',
      desc: 'Tangkapan layar chat WhatsApp penagih atau dokumen kontrak PDF dianalisis melalui sistem ekstraksi multi-modal.',
      tag: 'Ekstraksi Multi-Modal',
    },
    {
      id: 2,
      title: '2. Enkripsi AES-256 Sisi Server',
      desc: 'Seluruh nomor telepon dan pesan sensitif dienkripsi di level basis data sesuai mandat UU PDP No. 27/2022.',
      tag: 'Privasi Terjamin',
    },
    {
      id: 3,
      title: '3. Evaluasi Deterministik POJK',
      desc: 'Mesin aturan deterministik menguji kesesuaian suku bunga harian (cap 0.3%) dan izin akses CAMDOG.',
      tag: 'Kepastian Hukum',
    },
    {
      id: 4,
      title: '4. Kompilasi Draf Aduan Resmi',
      desc: 'Dihasilkan berkas kronologi hukum dan draf surat pengaduan formal untuk OJK 157, AFPI, dan Polri.',
      tag: 'Siap Disampaikan',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="bg-[#1E2C4F] text-white rounded-2xl p-6 sm:p-12 space-y-8 shadow-sm relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FFEC89] font-semibold bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            CARA KERJA SISTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Dari Transkrip Teror Menjadi <span className="text-[#FFEC89]">Berkas Laporan Resmi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Pelita merekonstruksi rantai bukti intimidasi secara terotomatisasi dengan kepastian hukum positif.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {circuitSteps.map((step) => {
            const isActive = activeCircuitNode === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveCircuitNode(step.id)}
                className={`text-left p-4.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-[#2A3A63] border-[#FFEC89] text-white shadow-md'
                    : 'bg-[#15203B] border-white/10 text-slate-300 hover:border-white/40'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFEC89] font-semibold block">
                    {step.tag}
                  </span>
                  <h4 className="font-semibold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{step.desc}</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-[#FFEC89] font-semibold' : 'text-slate-400'}>
                    {isActive ? 'Aktif Terpilih' : 'Klik untuk Detail'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFEC89]' : 'text-white/40'}`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-[#15203B] p-4.5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFEC89] animate-pulse" />
            <span>Status Jalur Alur: <strong className="text-[#FFEC89]">Live Signal Pulse Aktif</strong></span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-white"><Check className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Ingest</span>
            <span>&rarr;</span>
            <span className="flex items-center gap-1 font-semibold text-white"><Check className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Vault</span>
            <span>&rarr;</span>
            <span className="flex items-center gap-1 font-semibold text-white"><Check className="w-3.5 h-3.5 text-emerald-400" /> POJK Engine</span>
            <span>&rarr;</span>
            <span className="text-[#FFEC89] font-semibold">Draf OJK 157</span>
          </div>
        </div>
      </div>
    </section>
  );
};
