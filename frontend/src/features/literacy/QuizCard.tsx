import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { LiteracyModule } from '../../types';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export const QuizCard: React.FC = () => {
  const [modules, setModules] = useState<LiteracyModule[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  useEffect(() => {
    apiRequest<LiteracyModule[]>('/literacy/modules')
      .then((data) => setModules(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelectOption = async (index: number) => {
    setSelectedAnswer(index);
    try {
      const res = await apiRequest<{ is_correct: boolean; explanation: string }>('/literacy/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          quiz_id: 'quiz-1',
          selected_option_index: index,
        }),
      });
      setQuizResult({
        isCorrect: res.is_correct,
        explanation: res.explanation,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-bold text-3xl text-ink-primary">Modul Literasi Mikro & Kuis Pemahaman</h1>
        <p className="text-ink-muted text-sm mt-1">
          Edukasi ringkas 2 menit berbasis regulasi hukum positif Indonesia untuk mengenali jebakan pinjol dan melindungi hak data pribadi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-canvas-surface border border-canvas-border rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stamp-teal">
              <BookOpen className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-wider">{mod.reading_time_minutes} Menit Baca</span>
            </div>
            <h3 className="font-serif font-bold text-base text-ink-primary">{mod.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed">{mod.brief_content}</p>
          </div>
        ))}
      </div>

      <div className="bg-canvas-surface border border-canvas-border rounded-lg p-6 max-w-2xl mx-auto shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-ink-navy">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-serif font-bold text-lg text-ink-primary">Kuis Pemahaman Kilat</h3>
        </div>

        <p className="text-sm text-ink-primary font-medium">
          Manakah dari izin akses smartphone berikut yang secara hukum DILARANG untuk diminta oleh aplikasi pinjaman online berizin OJK?
        </p>

        <div className="space-y-2.5">
          {[
            'Izin akses seluruh daftar kontak telepon dan galeri foto',
            'Izin akses kamera (hanya untuk verifikasi e-KTP & wajah)',
            'Izin akses mikrofon (untuk panggilan verifikasi suara)',
            'Izin akses lokasi perangkat saat aplikasi digunakan',
          ].map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-3.5 rounded border text-xs font-medium transition flex items-center justify-between ${
                selectedAnswer === idx
                  ? 'border-ink-navy bg-canvas-subtle text-ink-navy'
                  : 'border-canvas-border hover:bg-canvas-subtle text-ink-primary'
              }`}
            >
              <span>{option}</span>
              {selectedAnswer === idx && <CheckCircle className="w-4 h-4 text-ink-navy" />}
            </button>
          ))}
        </div>

        {quizResult && (
          <div
            className={`p-4 rounded border text-xs leading-relaxed ${
              quizResult.isCorrect
                ? 'bg-stamp-teal-bg border-stamp-teal text-stamp-teal'
                : 'bg-stamp-amber-bg border-stamp-amber text-stamp-amber'
            }`}
          >
            <span className="font-bold block mb-1">
              {quizResult.isCorrect ? 'Jawaban Benar!' : 'Perlu Diperhatikan!'}
            </span>
            <p>{quizResult.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
