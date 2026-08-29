import React, { useState } from 'react';
import { useLiteracyModules } from '../../hooks/useLiteracy';
import { LiteracyModule, QuizOption } from '../../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Target,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Award,
} from 'lucide-react';

const defaultFallbackModules: LiteracyModule[] = [
  {
    id: 'mod-1',
    title: 'Mengenali Batas Maksimum Bunga dan Denda Menurut POJK',
    category: 'Batas Suku Bunga POJK',
    target_violation_category: 'interest_rate_cap',
    brief_content: 'Batas maksimum suku bunga harian resmi OJK adalah 0.3% per hari.',
    reading_time_minutes: 2,
    reading_content:
      'Otoritas Jasa Keuangan (OJK) melalui SEOJK No. 19/SEOJK.05/2023 secara ketat membatasi total manfaat ekonomi (suku bunga dan biaya admin harian) untuk pinjaman konsumtif jangka pendek maksimal 0.3% per hari pada tahun 2024 dan bertahap turun menjadi 0.1% per hari pada 2026.\n\nPinjaman online ilegal kerap membebankan bunga 1% hingga 2% per hari ditambah biaya administrasi siluman yang dipotong di awal pencairan hingga 30%-40%. Setiap pengenaan bunga di atas batas resmi berstatus non-compliant dan dapat dilaporkan ke instansi berwenang.',
    quiz: {
      question_text:
        'Berapakah batas maksimum suku bunga harian resmi yang ditetapkan oleh OJK untuk pinjaman online konsumtif di tahun 2024 sampai 2026?',
      correct_answer_key: 'B',
      explanation:
        'Berdasarkan SEOJK No. 19/SEOJK.05/2023, batas maksimum manfaat ekonomi adalah 0.3% per hari (2024) dan turun bertahap menjadi 0.1% per hari (2026). Suku bunga di atas 0.3% per hari merupakan bentuk pelanggaran hukum.',
      options: [
        { key: 'A', text: '0.8% per hari tanpa batas' },
        { key: 'B', text: 'Maksimal 0.3% per hari (turun bertahap ke 0.1% per hari)' },
        { key: 'C', text: '1.5% per hari sesuai perjanjian' },
        { key: 'D', text: 'Bebas ditentukan sepihak oleh aplikasi' },
      ],
    },
  },
  {
    id: 'mod-2',
    title: 'Perlindungan Data Pribadi: Batasan Akses Izin CAMDOG',
    category: 'Perlindungan Data Pribadi (UU PDP)',
    target_violation_category: 'illegal_permissions',
    brief_content: 'Aplikasi berizin OJK hanya boleh mengakses Camera, Microphone, dan Location (CAMDOG).',
    reading_time_minutes: 2,
    reading_content:
      'Berdasarkan POJK No. 10/POJK.05/2022 dan UU Perlindungan Data Pribadi (UU PDP No. 27/2022), aplikasi pinjaman online berizin OJK HANYA diizinkan mengakses 3 fitur perangkat smartphone yang dikenal dengan singkatan CAMDOG:\n1. Camera (Kamera): Verifikasi identitas e-KTP dan foto selfie.\n2. Microphone (Mikrofon): Verifikasi suara saat proses KYC.\n3. Location (Lokasi): Mendeteksi lokasi saat pengajuan untuk mitigasi risiko fraud.\n\nAplikasi yang meminta akses ke Kontak Telepon, Galeri Foto/Video, SMS, atau Media Penyimpanan adalah ILEGAL dan melanggar Pasal 65 UU PDP dengan ancaman sanksi pidana.',
    quiz: {
      question_text:
        'Manakah izin akses smartphone berikut yang secara hukum DILARANG KERAS untuk diminta oleh pinjol berizin OJK?',
      correct_answer_key: 'A',
      explanation:
        'Sesuai prinsip CAMDOG OJK dan UU PDP No. 27/2022, aplikasi dilarang mengakses seluruh daftar kontak dan galeri foto pribadi pengguna.',
      options: [
        { key: 'A', text: 'Seluruh daftar kontak telepon dan galeri foto/video' },
        { key: 'B', text: 'Kamera untuk verifikasi e-KTP saat pendaftaran' },
        { key: 'C', text: 'Mikrofon untuk konfirmasi panggilan suara' },
        { key: 'D', text: 'Lokasi GPS saat aplikasi digunakan' },
      ],
    },
  },
  {
    id: 'mod-3',
    title: 'Etika Penagihan: Jam Operasional dan Batasan Teror Debt Collector',
    category: 'Etika Penagihan POJK 22/2023',
    target_violation_category: 'harassment',
    brief_content: 'Penagihan dilarang dilakukan di luar pukul 08.00 hingga 20.00 waktu setempat.',
    reading_time_minutes: 2,
    reading_content:
      'Pasal 62 POJK No. 22 Tahun 2023 mengatur tata cara penagihan yang wajib dipatuhi oleh Pelaku Usaha Jasa Keuangan (PUJK) dan pihak ketiga (Debt Collector):\n1. Jam Operasional: Penagihan hanya boleh dilakukan pada hari Senin sampai dengan Sabtu, di luar hari libur nasional, dari pukul 08.00 hingga pukul 20.00 waktu setempat.\n2. Larangan Ancaman: Dilarang menggunakan ancaman kekerasan, kata-kata kasar, mencemarkan nama baik, atau mempermalukan debitur.\n3. Larangan Teror Pihak Ketiga: Dilarang menghubungi nomor telepon keluarga, atasan kantor, atau rekan kerja di luar nomor kontak darurat resmi yang didaftarkan debitur.',
    quiz: {
      question_text:
        'Jam berapakah batas waktu resmi penagihan debt collector menurut ketentuan Pasal 62 POJK No. 22/2023?',
      correct_answer_key: 'C',
      explanation:
        'Pasal 62 POJK No. 22/2023 secara eksplisit menetapkan penagihan hanya diperkenankan pukul 08:00 hingga 20:00 waktu setempat pada hari Senin sampai Sabtu.',
      options: [
        { key: 'A', text: 'Bebas 24 jam sampai pinjaman lunas' },
        { key: 'B', text: 'Pukul 06:00 hingga pukul 23:00 malam' },
        { key: 'C', text: 'Pukul 08:00 hingga pukul 20:00 waktu setempat' },
        { key: 'D', text: 'Hanya pada akhir pekan dan hari libur nasional' },
      ],
    },
  },
];

export const QuizCard: React.FC = () => {
  const { data: apiModules } = useLiteracyModules();
  const modules =
    apiModules && apiModules.length > 0 && apiModules[0].quiz?.question_text
      ? apiModules
      : defaultFallbackModules;

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentModule = modules[activeModuleIdx] || defaultFallbackModules[0];
  const quiz = currentModule.quiz || defaultFallbackModules[0].quiz;

  const handleSelectOption = (key: string) => {
    if (isAnswered) return;
    setSelectedOption(key);
  };

  const handleSubmit = () => {
    if (!selectedOption || !quiz) return;
    const isRight = selectedOption === quiz.correct_answer_key;
    setIsCorrect(isRight);
    setIsAnswered(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleNextModule = () => {
    handleReset();
    setActiveModuleIdx((prev) => (prev + 1) % modules.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#BA3801] animate-pulse" />
          <span>Platform Edukasi &amp; Integritas Finansial</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Modul Literasi Mikro &amp; <span className="text-[#BA3801]">Kuis Pemahaman</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Pelajari hak-hak finansial Anda dalam modul ringkas 2 menit dan uji pemahaman untuk mengenali serta menghadapi jebakan pinjaman online non-prosedural.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs text-xs font-mono text-[#1E2C4F] shrink-0">
            <Award className="w-4 h-4 text-[#BA3801]" />
            <span>Modul {activeModuleIdx + 1} dari {modules.length}</span>
          </div>
        </div>
      </div>

      {/* Module Selector Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {modules.map((m, idx) => {
          const isActive = activeModuleIdx === idx;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                handleReset();
                setActiveModuleIdx(idx);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-2.5 ${
                isActive
                  ? 'bg-[#1E2C4F] text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold ${
                  isActive ? 'bg-[#BA3801] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {idx + 1}
              </span>
              <span>{m.category}</span>
            </button>
          );
        })}
      </div>

      {/* Split Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reading Content */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3 pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-[#BA3801] bg-[#BA3801]/10 px-3 py-1 rounded-full">
                {currentModule.category}
              </span>
              <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>~{currentModule.reading_time_minutes} Menit</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1E2C4F] tracking-tight leading-snug">
              {currentModule.title}
            </h2>
          </div>

          <div className="text-[15px] text-[#2E3E6E] leading-[1.65] space-y-4 whitespace-pre-wrap font-normal">
            {currentModule.reading_content}
          </div>

          {/* Statutory Reference Callout */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs font-mono text-slate-700">
            <span className="flex items-center gap-2 font-medium text-[#1E2C4F]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standar Regulasi POJK &amp; UU PDP Terverifikasi</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">Pembaruan 2026</span>
          </div>
        </div>

        {/* Right Column: Interactive Quiz Card */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#BA3801]" />
              <h3 className="font-semibold text-base text-[#1E2C4F]">Evaluasi Pemahaman</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">1 Soal Kunci</span>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-medium text-[#1E2C4F] leading-relaxed">
              {quiz.question_text}
            </p>

            <div className="space-y-2.5">
              {quiz.options.map((opt: QuizOption) => {
                const isSelected = selectedOption === opt.key;
                let optionClass = 'bg-white hover:bg-slate-50/80 border-slate-200/80 text-slate-800';

                if (isAnswered) {
                  if (opt.key === quiz.correct_answer_key) {
                    optionClass = 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium';
                  } else if (isSelected) {
                    optionClass = 'bg-rose-50/80 border-rose-400 text-rose-950 font-medium';
                  } else {
                    optionClass = 'bg-slate-50/50 border-slate-200/40 text-slate-400';
                  }
                } else if (isSelected) {
                  optionClass = 'bg-[#BA3801]/5 border-[#BA3801] text-[#1E2C4F] shadow-2xs';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 active:scale-[0.98] text-xs flex items-start gap-3 ${optionClass}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#BA3801] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="flex-1 leading-relaxed pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {!isAnswered ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full font-semibold text-sm transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <span>Konfirmasi Jawaban</span>
                <Check className="w-4 h-4 text-[#FFEC89]" />
              </button>
            ) : (
              <div className="space-y-4 pt-1">
                <div
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Jawaban Anda Benar</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-700" />
                        <span>Jawaban Belum Tepat</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{quiz.explanation}</p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-[#1E2C4F] py-2.5 rounded-full font-semibold text-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Kuis</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextModule}
                    className="flex-1 bg-[#BA3801] hover:bg-[#9A2E01] text-white py-2.5 rounded-full font-semibold text-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Modul Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFEC89]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
