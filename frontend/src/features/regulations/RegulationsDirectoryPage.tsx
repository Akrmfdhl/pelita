import React, { useState } from 'react';
import {
  Search,
  Scale,
  ShieldCheck,
  Copy,
  Check,
  Filter,
  ShieldAlert,
} from 'lucide-react';

interface LegalStatute {
  id: string;
  category: 'pojk' | 'pdp' | 'kuhp' | 'afpi' | 'ite';
  regulationTitle: string;
  articleNumber: string;
  originalText: string;
  plainExplanation: string;
  legalSanction: string;
  keywords: string[];
}

const STATUTES_DATABASE: LegalStatute[] = [
  {
    id: 'pojk-22-62',
    category: 'pojk',
    regulationTitle: 'POJK No. 22 Tahun 2023 tentang Pelindungan Konsumen Sektor Jasa Keuangan',
    articleNumber: 'Pasal 62 ayat (1) dan (2)',
    originalText:
      'Pelaku Usaha Jasa Keuangan (PUJK) wajib memastikan penagihan dilakukan dengan: a. tidak menggunakan cara ancaman, kekerasan dan/atau tindakan yang bersifat mempermalukan Konsumen; b. tidak menggunakan tekanan secara fisik maupun verbal; c. hanya dilakukan pada hari Senin sampai dengan Sabtu di luar hari libur nasional dari pukul 08.00 sampai dengan pukul 20.00 waktu setempat.',
    plainExplanation:
      'Penagih dilarang keras menagih pada hari Minggu/hari libur nasional, dilarang menagih di atas jam 20.00 malam, serta dilarang memaki, mengancam, atau mempermalukan debitur.',
    legalSanction:
      'Peringatan tertulis, denda administratif, pembatasan kegiatan usaha, hingga pencabutan izin usaha oleh Otoritas Jasa Keuangan (OJK).',
    keywords: ['jam penagihan', 'malam hari', 'ancaman verbal', 'hari libur', 'mempermalukan', 'kekerasan'],
  },
  {
    id: 'pdp-27-65',
    category: 'pdp',
    regulationTitle: 'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)',
    articleNumber: 'Pasal 65 ayat (1) dan (3)',
    originalText:
      '(1) Setiap Orang dilarang secara melawan hukum memperoleh atau mengumpulkan Data Pribadi yang bukan miliknya dengan maksud untuk menguntungkan diri sendiri atau orang lain.\n(3) Setiap Orang dilarang secara melawan hukum menggunakan Data Pribadi yang bukan miliknya.',
    plainExplanation:
      'Penyebaran foto KTP, kontak telepon, atau foto pribadi debitur ke grup WhatsApp, media sosial, atau pihak ketiga tanpa izin sah merupakan kejahatan pidana berat.',
    legalSanction:
      'Pidana penjara paling lama 5 (lima) tahun dan/atau pidana denda paling banyak Rp 5.000.000.000,00 (lima miliar rupiah).',
    keywords: ['sebar data', 'foto ktp', 'kontak telepon', 'galeri', 'privasi', 'pidana data'],
  },
  {
    id: 'seojk-19-2023',
    category: 'pojk',
    regulationTitle: 'Surat Edaran OJK (SEOJK) No. 19/SEOJK.05/2023',
    articleNumber: 'Batas Manfaat Ekonomi & Biaya Layanan',
    originalText:
      'Batas maksimum manfaat ekonomi (bunga dan seluruh biaya terkait) untuk pendanaan konsumtif ditetapkan sebesar 0,3% per hari kalender (2024) dan turun menjadi 0,2% per hari kalender (2025). Seluruh total biaya lain dan denda keterlambatan tidak boleh melebihi 100% dari nilai pokok pendanaan.',
    plainExplanation:
      'Bunga pinjol konsumtif resmi tidak boleh melebihi 0.3%/hari. Total akumulasi seluruh bunga dan denda tidak boleh melebihi 100% dari uang pokok yang dipinjam.',
    legalSanction:
      'Kewajiban pengembalian kelebihan bunga kepada nasabah serta sanksi administratif dan penghentian layanan oleh OJK.',
    keywords: ['bunga maksimal', 'plafon 100%', 'denda harian', 'biaya admin', 'kelebihan bayar'],
  },
  {
    id: 'pojk-10-2022',
    category: 'pojk',
    regulationTitle: 'POJK No. 10/POJK.05/2022 tentang Layanan Pendanaan Bersama Berbasis Teknologi Informasi',
    articleNumber: 'Ketentuan Akses Data Perangkat (CAMDOG)',
    originalText:
      'Penyelenggara fintech lending hanya diperkenankan mengakses fitur Camera, Microphone, dan Location (CAMDOG) pada gawai milik pengguna dengan persetujuan terlebih dahulu. Penyelenggara dilarang mengakses kontak buku telepon, penyimpanan berkas galeri, dan riwayat panggilan/SMS.',
    plainExplanation:
      'Aplikasi pinjol resmi HANYA boleh mengakses Kamera, Mikrofon, dan Lokasi. Aplikasi yang meminta izin kontak atau galeri dipastikan ILEGAL atau melanggar hukum.',
    keywords: ['camdog', 'kamera', 'mikrofon', 'lokasi', 'izin kontak', 'akses galeri'],
    legalSanction: 'Pemblokiran aplikasi dan pencabutan tanda terdaftar/berizin OJK.',
  },
  {
    id: 'kuhp-368-369',
    category: 'kuhp',
    regulationTitle: 'Kitab Undang-Undang Hukum Pidana (KUHP)',
    articleNumber: 'Pasal 368 ayat (1) dan Pasal 369 ayat (1)',
    originalText:
      'Barang siapa dengan maksud untuk menguntungkan diri sendiri atau orang lain secara melawan hukum, memaksa seorang dengan kekerasan atau ancaman kekerasan untuk memberikan barang sesuatu... diancam karena pemerasan dengan pidana penjara paling lama sembilan tahun.',
    plainExplanation:
      'Memaksa pembayaran dengan ancaman kekerasan, fitnah, atau menyebarkan rahasia/aib di ruang digital merupakan delik pidana pemerasan.',
    legalSanction: 'Pidana penjara maksimal 9 (sembilan) tahun (Pasal 368) atau 4 tahun (Pasal 369).',
    keywords: ['pemerasan', 'ancaman kekerasan', 'fitnah', 'teror pidana', 'kuhp'],
  },
  {
    id: 'afpi-code-ethics',
    category: 'afpi',
    regulationTitle: 'Kode Etik Perilaku Penagihan Bertanggung Jawab AFPI',
    articleNumber: 'Pedoman Penagihan Layanan Pendanaan Bersama',
    originalText:
      'Tenaga penagih wajib bersertifikasi resmi AFPI. Dilarang melakukan penagihan kepada pihak keluarga, rekan kerja, atau kontak darurat kecuali nomor yang bersangkutan didaftarkan secara eksplisit sebagai penjamin/kontak verifikasi.',
    plainExplanation:
      'Debt collector pinjol berizin dilarang menghubungi keluarga, teman kantor, atau kontak darurat untuk menagih atau mengintimidasi.',
    legalSanction: 'Blacklist sertifikasi penagih seumur hidup dan sanksi etik denda asosiasi.',
    keywords: ['kode etik', 'debt collector', 'kontak darurat', 'sertifikasi afpi', 'teror keluarga'],
  },
];

export const RegulationsDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pojk' | 'pdp' | 'kuhp' | 'afpi' | 'ite'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredStatutes = STATUTES_DATABASE.filter((item) => {
    const matchQuery =
      item.regulationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory === 'all') return matchQuery;
    return matchQuery && item.category === selectedCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <Scale className="w-4 h-4 text-[#BA3801]" />
          <span>Korpus Hukum &amp; Regulasi Perlindungan Konsumen Finansial RI</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Pusat Regulasi &amp; <span className="text-[#BA3801]">Korpus Hukum Terbuka</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Eksplorasi direktori pasal-pasal perlindungan konsumen, batasan bunga OJK, larangan penagihan kasar, dan sanksi pidana UU PDP dalam bahasa awam yang mudah dipahami.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-mono text-[#1E2C4F] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>POJK, UU PDP, KUHP, &amp; Kode Etik AFPI</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kata kunci: 'sebar foto', 'jam penagihan', 'bunga maksimal', 'kontak darurat', 'camdog'..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1E2C4F] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({STATUTES_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('pojk')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'pojk'
                  ? 'bg-[#BA3801] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              POJK &amp; SEOJK
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('pdp')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'pdp'
                  ? 'bg-[#BA3801] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              UU PDP (Privasi Data)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('kuhp')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'kuhp'
                  ? 'bg-[#BA3801] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              KUHP (Pidana Pemerasan)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('afpi')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'afpi'
                  ? 'bg-[#BA3801] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Etika AFPI
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Menampilkan {filteredStatutes.length} klausul hukum yang relevan</span>
          </div>
        </div>
      </div>

      {/* Statutes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {filteredStatutes.map((statute) => (
          <div
            key={statute.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between hover:border-[#BA3801]/30 transition-all ring-1 ring-slate-900/5"
          >
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-[#1E2C4F] font-mono text-[11px] font-bold border border-slate-200">
                  {statute.articleNumber}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      statute.id,
                      `${statute.regulationTitle}\n${statute.articleNumber}\n\nBunyi Pasal:\n${statute.originalText}\n\nPenjelasan:\n${statute.plainExplanation}`
                    )
                  }
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-1 text-[11px] font-mono"
                  title="Salin Rujukan Pasal"
                >
                  {copiedId === statute.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Rujukan</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-base text-[#1E2C4F] leading-snug tracking-tight">
                  {statute.regulationTitle}
                </h3>
              </div>

              {/* Bunyi Asli Pasal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  BUNYI AYAT / KLAUSUL ASLI:
                </span>
                <p className="font-mono text-xs text-[#1E2C4F] whitespace-pre-line leading-relaxed italic">
                  &ldquo;{statute.originalText}&rdquo;
                </p>
              </div>

              {/* Plain Language Interpretation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#BA3801] block">
                  PENJELASAN BAHASA AWAM:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{statute.plainExplanation}</p>
              </div>

              {/* Sanksi Hukum */}
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 text-xs">
                <span className="font-bold text-rose-950 block font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  <span>ANCAMAN SANKSI HUKUM:</span>
                </span>
                <p className="text-slate-800 leading-relaxed font-mono text-[11px]">{statute.legalSanction}</p>
              </div>
            </div>

            {/* Keyword tags */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              {statute.keywords.map((kw, kIdx) => (
                <span
                  key={kIdx}
                  className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
