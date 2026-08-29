import React from 'react';

export const MetricsWallSection: React.FC = () => {
  const metrics = [
    {
      value: '300%',
      label: 'Akselerasi Analisis',
      desc: 'Ekstraksi klausul kontrak otomatis menggantikan penelusuran manual dokumen halaman per halaman.',
      highlight: false,
    },
    {
      value: '500K+',
      label: 'Klausul Teruji',
      desc: 'Basis data peraturan komprehensif mencakup POJK, SEOJK 19/2023, dan UU Perlindungan Data Pribadi.',
      highlight: true,
    },
    {
      value: '95.8%',
      label: 'Akurasi RAG Legal',
      desc: 'Rujukan pasal positif presisi tanpa fabrikasi atau rekayasa hukum pada asisten advokasi.',
      highlight: false,
    },
    {
      value: '800+',
      label: 'Draf Aduan Formal',
      desc: 'Format terstruktur sesuai formulir resmi OJK Kontak 157, Posko AFPI, dan Bareskrim Polri.',
      highlight: true,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#BA3801] font-semibold bg-white px-3.5 py-1 rounded-full border border-slate-200/90 shadow-2xs">
          MENGAPA MEMILIH PELITA
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E2C4F] tracking-tight leading-snug">
          Platform independen yang membantu masyarakat menguji legalitas pinjol,{' '}
          <span className="text-[#BA3801]">
            menghentikan intimidasi penagihan
          </span>
          , dan menyusun berkas laporan berintegritas.
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-2 hover:border-slate-300 transition-colors"
          >
            <span
              className={`text-3xl sm:text-4xl font-semibold font-mono block ${
                metric.highlight ? 'text-[#BA3801]' : 'text-[#1E2C4F]'
              }`}
            >
              {metric.value}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#1E2C4F] block">
              {metric.label}
            </span>
            <p className="text-xs text-[#2E3E6E] leading-relaxed font-normal">
              {metric.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
