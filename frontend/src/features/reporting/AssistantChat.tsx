import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import {
  Send,
  FileCheck,
  Copy,
  Check,
  MessageSquareText,
  Scale,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  articles?: string[];
}

export const AssistantChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Halo, saya Asisten Advokasi Pelita. Ceritakan masalah penagihan kasar atau keraguan kontrak pinjaman online yang Anda hadapi. Saya akan memetakan dasar hukumnya dan menyusun draf surat pengaduan formal resmi.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [letterDraft, setLetterDraft] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [victimName, setVictimName] = useState('Budi Santoso');
  const [platformName, setPlatformName] = useState('Pinjaman Dana Instan');

  const quickQuestions = [
    'Berapa batas bunga harian maksimal menurut OJK?',
    'Apakah debt collector boleh menghubungi kontak darurat?',
    'Bagaimana prosedur melapor ke Satgas PASTI & Kepolisian?',
    'Apa sanksi pidana jika pinjol menyebarkan foto KTP saya?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await apiRequest<{
        reply: string;
        suggested_channel: string;
        relevant_articles: string[];
      }>('/reporting/chat', {
        method: 'POST',
        body: JSON.stringify({ message: query }),
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          articles: res.relevant_articles,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    try {
      const res = await apiRequest<{ generated_letter_body: string }>('/reporting/drafts', {
        method: 'POST',
        body: JSON.stringify({
          case_id: 'case-demo-1',
          channel_code: 'ojk',
          victim_name: victimName,
          victim_nik: '3201234567890001',
          victim_phone: '081234567890',
          platform_name: platformName,
        }),
      });
      setLetterDraft(res.generated_letter_body);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLetter = () => {
    if (!letterDraft) return;
    navigator.clipboard.writeText(letterDraft);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-canvas-border pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareText className="w-5 h-5 text-stamp-teal" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stamp-teal">
              Asisten Regulasi &amp; Draf Aduan
            </span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-ink-primary">Asisten Pelaporan &amp; Advokasi</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Konsultasikan intimidasi penagihan dan dapatkan rujukan regulasi resmi POJK No. 10/2022, POJK No. 22/2023, serta UU PDP No. 27/2022.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-canvas-subtle p-2 rounded-lg border border-canvas-border">
          <PhoneCall className="w-4 h-4 text-stamp-amber" />
          <span>Hotline OJK: 157 | Satgas PASTI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-canvas-surface border border-canvas-border rounded-xl shadow-sm flex flex-col h-[560px] overflow-hidden">
          <div className="p-4 border-b border-canvas-border bg-canvas-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stamp-teal" />
              <span className="font-semibold text-xs text-ink-primary">Pelita Legal RAG Assistant</span>
            </div>
            <span className="font-mono text-[10px] text-ink-muted">Grounded on POJK &amp; KUHP</span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-4 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-ink-navy text-canvas-paper rounded-br-none shadow-sm'
                      : 'bg-canvas-subtle border border-canvas-border text-ink-primary rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.articles && m.articles.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-canvas-border/80 space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block font-semibold">
                        Rujukan Regulasi Terkait:
                      </span>
                      {m.articles.map((art, idx) => (
                        <div key={idx} className="font-mono text-xs text-stamp-teal flex items-center gap-1.5 font-medium">
                          <Scale className="w-3 h-3 shrink-0" />
                          <span>{art}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 text-xs font-mono text-ink-muted bg-canvas-subtle rounded-lg border border-canvas-border w-fit animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-stamp-teal animate-spin" />
                <span>Asisten Pelita sedang mencari pasal hukum terkait...</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-canvas-subtle border-t border-canvas-border">
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="tactile-btn text-[11px] font-medium bg-canvas-surface hover:bg-canvas-paper text-ink-primary border border-canvas-border px-3 py-1 rounded-full whitespace-nowrap shrink-0 shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan masalah pinjol atau intimidasi yang Anda alami..."
                className="flex-1 bg-canvas-surface border border-canvas-border rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="tactile-btn bg-ink-navy hover:bg-opacity-95 text-canvas-paper px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 bg-canvas-surface border border-canvas-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-stamp-teal" />
              <h2 className="font-serif font-bold text-lg text-ink-primary">Draf Surat Aduan Formal</h2>
            </div>
            <span className="font-mono text-[11px] text-stamp-teal bg-stamp-teal-bg px-2 py-0.5 rounded border border-stamp-teal">
              Format OJK 157
            </span>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            Hasilkan draf surat aduan resmi yang memuat kronologi fakta, identitas platform, dan rujukan pasal hukum secara otomatis.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Nama Lengkap Korban
              </label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3 py-2 text-xs font-medium text-ink-primary focus:outline-none focus:border-ink-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Nama Aplikasi Pinjol
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3 py-2 text-xs font-medium text-ink-primary focus:outline-none focus:border-ink-navy"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              className="tactile-btn w-full bg-stamp-teal hover:bg-opacity-95 text-canvas-paper py-2.5 rounded-lg text-xs font-mono font-semibold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <FileCheck className="w-4 h-4" />
              Generate Draf Surat Resmi
            </button>
          </div>

          {letterDraft && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase text-ink-navy">Pratinjau Draf Surat:</span>
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="tactile-btn font-mono text-[11px] text-stamp-teal bg-stamp-teal-bg px-2.5 py-1 rounded border border-stamp-teal flex items-center gap-1 hover:bg-opacity-80"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3 h-3" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Salin Teks Surat
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                rows={8}
                value={letterDraft}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg p-3 text-[11px] font-mono text-ink-primary leading-relaxed focus:outline-none select-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
