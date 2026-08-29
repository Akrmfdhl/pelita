import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { LiteracyModule } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Scale,
  Award,
  Layers,
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  article: string;
}

export const QuizCard: React.FC = () => {
  const [modules, setModules] = useState<LiteracyModule[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions: QuizQuestion[] = [
    {
      question:
        'Manakah dari izin akses smartphone berikut yang secara hukum DILARANG untuk diminta oleh aplikasi pinjaman online berizin OJK?',
      options: [
        'Izin akses seluruh daftar kontak telepon dan galeri foto',
        'Izin akses kamera (untuk verifikasi e-KTP & wajah)',
        'Izin akses mikrofon (untuk verifikasi panggilan suara)',
        'Izin akses lokasi perangkat saat aplikasi digunakan',
      ],
      correctIndex: 0,
      explanation:
        'Sesuai ketentuan POJK No. 10/2022 dan Surat Edaran AFPI, penyelenggara hanya diperbolehkan mengakses fitur CAMDOG (Camera, Microphone, Location). Akses ke daftar kontak telepon dan galeri foto dilarang keras.',
      article: 'POJK No. 10/2022 & UU PDP No. 27/2022',
    },
    {
      question:
        'Berapakah batas maksimum suku bunga harian yang ditetapkan oleh OJK untuk pinjaman online konsumtif jangka pendek di tahun 2024 - 2026?',
      options: [
        '0.8% per hari',
        '0.3% per hari (berangsur turun menjadi 0.1% per hari)',
        '1.5% per hari',
        'Bebas ditentukan oleh aplikasi pinjaman',
      ],
      correctIndex: 1,
      explanation:
        'Berdasarkan Surat Edaran OJK SEOJK No. 19/SEOJK.05/2023, batas maksimum manfaat ekonomi (bunga dan biaya) untuk pinjaman konsumtif adalah 0.3% per hari pada 2024 dan turun bertahap menjadi 0.1% per hari pada 2026.',
      article: 'SEOJK No. 19/SEOJK.05/2023',
    },
    {
      question:
        'Jam berapakah batas waktu resmi penagihan oleh debt collector menurut POJK No. 22/2023?',
      options: [
        'Bebas 24 jam selama debitur belum membayar',
        'Pukul 08:00 hingga pukul 20:00 waktu setempat',
        'Pukul 06:00 hingga pukul 22:00 waktu setempat',
        'Hanya pada akhir pekan saja',
      ],
      correctIndex: 1,
      explanation:
        'Pasal 62 POJK No. 22/2023 secara tegas mengatur bahwa penagihan langsung maupun melalui media komunikasi hanya diperkenankan pada hari Senin - Sabtu pukul 08:00 - 20:00 waktu setempat.',
      article: 'POJK No. 22/2023 Pasal 62 Ayat (2)',
    },
  ];

  useEffect(() => {
    apiRequest<LiteracyModule[]>('/literacy/modules')
      .then((data) => setModules(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === quizQuestions[currentQuizIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuizIdx((prev) => prev + 1);
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
  };

  const currentQ = quizQuestions[currentQuizIdx];
  const isQuizFinished = currentQuizIdx >= quizQuestions.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-canvas-border pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-stamp-teal" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stamp-teal">
              Pemberdayaan Hukum Konsumen
            </span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-ink-primary">Modul Literasi Mikro &amp; Kuis Pemahaman</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Edukasi ringkas 2 menit berbasis regulasi hukum positif Indonesia untuk mengenali jebakan pinjol dan melindungi hak data pribadi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted bg-canvas-subtle p-2 rounded-lg border border-canvas-border">
          <Layers className="w-4 h-4 text-stamp-teal" />
          <span>Kurikulum POJK &amp; UU PDP 2026</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-ink-primary">Modul Bacaan Kilat 2 Menit</h2>
          <span className="text-xs font-mono text-ink-muted">Tersedia {modules.length} modul</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-canvas-surface border border-canvas-border rounded-xl p-5 shadow-sm space-y-3 hover:border-ink-navy/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stamp-teal bg-stamp-teal-bg px-2 py-0.5 rounded border border-stamp-teal font-semibold">
                    {mod.reading_time_minutes} Menit Baca
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">Modul #{mod.id}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">{mod.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{mod.brief_content}</p>
              </div>

              <div className="pt-3 border-t border-canvas-border flex items-center justify-between text-[11px] text-ink-navy font-semibold font-mono">
                <span className="flex items-center gap-1">
                  <Scale className="w-3 h-3 text-stamp-teal" />
                  Dasar Regulasi
                </span>
                <span className="text-stamp-teal">Terverifikasi</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-canvas-surface border border-canvas-border rounded-xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-canvas-border pb-4">
          <div className="flex items-center gap-2.5 text-ink-navy">
            <HelpCircle className="w-6 h-6 text-stamp-teal" />
            <div>
              <h3 className="font-serif font-bold text-xl text-ink-primary">Kuis Pemahaman Regulasi</h3>
              <span className="text-xs text-ink-muted">Uji ketelitian Anda mengenali hak perlindungan konsumen</span>
            </div>
          </div>

          {!isQuizFinished && (
            <span className="font-mono text-xs font-bold text-ink-navy bg-canvas-subtle px-3 py-1 rounded-full border border-canvas-border">
              Soal {currentQuizIdx + 1} dari {quizQuestions.length}
            </span>
          )}
        </div>

        {!isQuizFinished ? (
          <div className="space-y-5">
            <p className="text-sm sm:text-base text-ink-primary font-semibold leading-relaxed">
              {currentQ.question}
            </p>

            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optionStyle = 'border-canvas-border hover:bg-canvas-subtle text-ink-primary';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-stamp-teal bg-stamp-teal-bg text-stamp-teal font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-stamp-red bg-stamp-red-bg text-stamp-red font-semibold';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-ink-navy bg-canvas-subtle text-ink-navy font-semibold ring-1 ring-ink-navy';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`tactile-btn w-full text-left p-4 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-stamp-teal shrink-0" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-stamp-red shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-4 rounded-lg border bg-canvas-subtle border-canvas-border text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-stamp-teal">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Rujukan Yuridis: {currentQ.article}</span>
                </div>
                <p className="text-ink-primary leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="tactile-btn bg-ink-navy hover:bg-opacity-95 text-canvas-paper px-6 py-2.5 rounded-lg text-xs font-mono font-semibold transition disabled:opacity-40"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="tactile-btn bg-stamp-teal hover:bg-opacity-95 text-canvas-paper px-6 py-2.5 rounded-lg text-xs font-mono font-semibold transition"
                >
                  {currentQuizIdx + 1 < quizQuestions.length ? 'Soal Berikutnya' : 'Lihat Skor Akhir'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-stamp-teal-bg border border-stamp-teal text-stamp-teal flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-2xl text-ink-primary">Kuis Selesai!</h4>
            <p className="text-sm text-ink-muted">
              Skor Anda:{' '}
              <span className="font-mono font-bold text-ink-navy text-lg">
                {score} / {quizQuestions.length}
              </span>{' '}
              ({Math.round((score / quizQuestions.length) * 100)}% Pemahaman Regulasi)
            </p>
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="tactile-btn inline-flex items-center gap-2 bg-ink-navy text-canvas-paper px-5 py-2.5 rounded-lg text-xs font-mono font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
