import React, { useState } from 'react';
import { useLiteracyModules } from '../../hooks/useLiteracy';
import { LiteracyModule, QuizOption } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

const defaultFallbackModules: LiteracyModule[] = [
  {
    id: 'mod-1',
    title: 'Mengenali Batas Maksimum Bunga & Denda Menurut POJK',
    category: 'Batas Suku Bunga POJK',
    target_violation_category: 'interest_rate_cap',
    brief_content: 'Batas maksimum suku bunga harian resmi OJK adalah 0.3% per hari.',
    reading_time_minutes: 2,
    reading_content:
      'Otoritas Jasa Keuangan (OJK) melalui SEOJK No. 19/SEOJK.05/2023 secara ketat membatasi total manfaat ekonomi (suku bunga + biaya admin harian) untuk pinjaman konsumtif jangka pendek maksimal 0.3% per hari pada tahun 2024 dan bertahap turun menjadi 0.1% per hari pada 2026.\n\nPinjaman online ilegal kerap membebankan bunga 1% hingga 2% per hari ditambah biaya administrasi siluman yang dipotong di awal pencairan hingga 30%-40%. Setiap pengenaan bunga di atas batas resmi berstatus non-compliant dan dapat digugat serta dilaporkan ke Satgas PASTI.',
    quiz: {
      question_text:
        'Berapakah batas maksimum suku bunga harian resmi yang ditetapkan oleh OJK untuk pinjaman online konsumtif di tahun 2024 - 2026?',
      correct_answer_key: 'B',
      explanation:
        'Berdasarkan SEOJK No. 19/SEOJK.05/2023, batas maksimum manfaat ekonomi adalah 0.3% per hari (2024) dan turun bertahap menjadi 0.1% per hari (2026). Suku bunga di atas 0.3% per hari merupakan bentuk pelanggaran hukum.',
      options: [
        { key: 'A', text: '0.8% per hari tanpa batas' },
        { key: 'B', text: 'Maksimal 0.3% per hari (turun bertahap ke 0.1%/hari)' },
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
      'Berdasarkan POJK No. 10/POJK.05/2022 dan UU Perlindungan Data Pribadi (UU PDP No. 27/2022), aplikasi pinjaman online berizin OJK HANYA diizinkan mengakses 3 fitur perangkat smartphone yang dikenal dengan singkatan CAMDOG:\n1. Camera (Kamera): Verifikasi identitas e-KTP dan foto selfie.\n2. Microphone (Mikrofon): Verifikasi suara saat proses KYC.\n3. Location (Lokasi): Mendeteksi lokasi saat pengajuan untuk mitigasi risiko fraud.\n\nAplikasi yang meminta akses ke Kontak Telepon, Galeri Foto/Video, SMS, atau Media Penyimpanan adalah ILEGAL dan melanggar Pasal 65 UU PDP dengan ancaman pidana penjara hingga 5 tahun.',
    quiz: {
      question_text:
        'Manakah izin akses smartphone berikut yang secara hukum DILARANG KERAS untuk diminta oleh pinjol berizin OJK?',
      correct_answer_key: 'A',
      explanation:
        'Sesuai prinsip CAMDOG OJK dan UU PDP No. 27/2022, aplikasi dilarang mengakses daftar kontak dan galeri foto pribadi pengguna.',
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
    title: 'Etika Penagihan: Jam Operasional & Batasan Teror Debt Collector',
    category: 'Etika Penagihan POJK 22/2023',
    target_violation_category: 'harassment',
    brief_content: 'Penagihan dilarang dilakukan di luar pukul 08.00 hingga 20.00 waktu setempat.',
    reading_time_minutes: 2,
    reading_content:
      'Pasal 62 POJK No. 22 Tahun 2023 mengatur tata cara penagihan yang wajib dipatuhi oleh Pelaku Usaha Jasa Keuangan (PUJK) dan pihak ketiga (Debt Collector):\n1. Jam Operasional: Penagihan hanya boleh dilakukan pada hari Senin sampai dengan Sabtu, di luar hari libur nasional, dari pukul 08.00 hingga pukul 20.00 waktu setempat.\n2. Larangan Ancaman: Dilarang menggunakan ancaman kekerasan, kata-kata kasar, mencemarkan nama baik, atau mempermalukan debitur.\n3. Larangan Teror Pihak Ketiga: Dilarang menghubungi nomor telepon keluarga, atasan kantor, atau teman di luar nomor kontak darurat resmi yang didaftarkan debitur.',
    quiz: {
      question_text:
        'Jam berapakah batas waktu resmi penagihan debt collector menurut ketentuan Pasal 62 POJK No. 22/2023?',
      correct_answer_key: 'C',
      explanation:
        'Pasal 62 POJK No. 22/2023 secara eksplisit menetapkan penagihan hanya diperkenankan pukul 08:00 hingga 20:00 waktu setempat pada hari Senin - Sabtu.',
      options: [
        { key: 'A', text: 'Bebas 24 jam sampai hutang lunas' },
        { key: 'B', text: 'Pukul 06:00 hingga pukul 23:00 malam' },
        { key: 'C', text: 'Pukul 08:00 hingga pukul 20:00 waktu setempat' },
        { key: 'D', text: 'Hanya pada akhir pekan dan hari libur' },
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="border-b-2 border-[#4A69B3]/35 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-[#BA3801]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BA3801]">
              Contextual Micro-Literacy &amp; Interactive Quiz
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2C4F] tracking-tight">Modul Literasi Mikro &amp; Kuis Pemahaman</h1>
          <p className="text-[#2E3E6E] text-sm mt-1 max-w-2xl font-medium">
            Pelajari hak-hak finansial Anda dalam modul ringkas 2 menit dan uji pemahaman Anda untuk mengenali jebakan pinjol
            ilegal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1E2C4F] bg-white px-4 py-1.5 rounded-full border-2 border-[#4A69B3] font-bold shadow-xs">
          <span>Modul:</span>
          <span className="text-[#BA3801] font-extrabold">
            {activeModuleIdx + 1} / {modules.length}
          </span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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
              className={`tactile-btn text-xs font-mono px-4 py-2 rounded-2xl border-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-[#BA3801] border-[#BA3801] text-white font-bold shadow-md'
                  : 'bg-white border-[#4A69B3] text-[#1E2C4F] hover:bg-[#FFEC89] font-bold'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isActive ? 'bg-white text-[#BA3801] font-bold' : 'bg-[#FFEC89] text-[#1E2C4F] font-bold'
                }`}
              >
                {idx + 1}
              </span>
              <span>{m.category}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1E2C4F]/5 space-y-6">
          <div className="space-y-2 border-b border-[#4A69B3]/25 pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#BA3801] font-bold bg-white border border-[#BA3801] px-3 py-0.5 rounded-md inline-block">
              {currentModule.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2C4F] tracking-tight">{currentModule.title}</h2>
          </div>

          <div className="text-xs sm:text-sm text-[#1E2C4F] leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
            {currentModule.reading_content}
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-[#4A69B3]/40 flex items-center justify-between text-xs font-mono text-[#1E2C4F]">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Regulasi OJK &amp; UU PDP Terverifikasi
            </span>
            <span className="text-[#2E3E6E] font-medium">Waktu Baca: ~2 Menit</span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1E2C4F]/5 space-y-6">
          <div className="flex items-center justify-between border-b border-[#4A69B3]/25 pb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#BA3801]" />
              <h3 className="font-bold text-base text-[#1E2C4F]">Kuis Uji Pemahaman</h3>
            </div>
            <span className="text-[11px] font-mono text-[#2E3E6E] font-bold">1 Soal Evaluasi</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-[#1E2C4F] leading-snug">{quiz.question_text}</p>

            <div className="space-y-2.5">
              {quiz.options.map((opt: QuizOption) => {
                const isSelected = selectedOption === opt.key;
                let optionStyle = 'bg-white border-[#4A69B3] hover:border-[#BA3801] text-[#1E2C4F]';

                if (isAnswered) {
                  if (opt.key === quiz.correct_answer_key) {
                    optionStyle =
                      'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold border-2';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold border-2';
                  } else {
                    optionStyle = 'bg-white border-slate-300 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-[#FFEC89] border-[#BA3801] text-[#1E2C4F] border-2 font-bold';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={isAnswered}
                    className={`tactile-btn w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-start gap-3 ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#BA3801] text-white' : 'bg-white border-2 border-[#4A69B3] text-[#1E2C4F]'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="flex-1 font-semibold leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {!isAnswered ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="tactile-btn w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-2xl font-mono text-xs font-bold transition-all shadow-md shadow-[#BA3801]/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Kirim Jawaban</span>
                <Check className="w-4 h-4 text-[#FFEC89]" />
              </button>
            ) : (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-mono text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Jawaban Anda Benar!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-700" />
                        <span>Jawaban Kurang Tepat</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed font-medium">{quiz.explanation}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="tactile-btn flex-1 bg-white hover:bg-[#FFEC89] border-2 border-[#4A69B3] text-[#1E2C4F] py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Kuis</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextModule}
                    className="tactile-btn flex-1 bg-[#BA3801] hover:bg-[#9A2E01] text-white py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
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
