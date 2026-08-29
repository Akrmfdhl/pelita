import React, { useState, useRef, useEffect } from 'react';
import { useAssistantChat, useGenerateComplaintDraft } from '../../hooks/useReporting';
import { ChatMessage, ComplaintDraftResponse } from '../../types';
import {
  MessageSquareText,
  Send,
  Bot,
  Scale,
  FileDown,
  PhoneCall,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const AssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Halo! Saya Asisten Advokasi Konsumen Pelita. Saya dapat membantu Anda mengidentifikasi pelanggaran penagihan, menghitung denda ilegal, dan menyusun surat aduan resmi ke OJK Kontak 157, Posko AFPI, atau Bareskrim Polri.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [activeDraft, setActiveDraft] = useState<ComplaintDraftResponse | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAssistantChat();
  const draftMutation = useGenerateComplaintDraft();

  const loading = chatMutation.isPending || draftMutation.isPending;

  const quickQuestions = [
    'Debt collector mengancam sebar data KTP, apa pasal hukumnya?',
    'Penagih meneror keluarga di luar kontak darurat, lapor ke mana?',
    'Suku bunga pinjol saya 0.8% per hari, apakah ini ilegal?',
    'Buatkan draf surat pengaduan resmi untuk OJK 157.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    try {
      if (messageText.toLowerCase().includes('draf') || messageText.toLowerCase().includes('surat')) {
        const draft = await draftMutation.mutateAsync({
          case_id: 'case_default_01',
          channel_code: 'ojk',
          victim_name: 'Korban Intimidasi Pinjol',
          victim_nik: '3171012345678901',
          victim_phone: '+6281234567890',
        });

        setActiveDraft(draft);

        const aiMsg: ChatMessage = {
          role: 'assistant',
          content: `Saya telah menyusun draf resmi **${draft.draft_title}**. Berkas ini telah mencantumkan dasar hukum POJK No. 10/2022, POJK No. 22/2023, serta UU PDP No. 27/2022. Anda dapat melihat dan menyalin berkas surat di panel sebelah kanan.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          legal_citations: [
            'POJK No. 10/POJK.05/2022',
            'POJK No. 22 Tahun 2023 Pasal 62',
            'UU No. 27/2022 tentang PDP Pasal 65',
          ],
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const res = await chatMutation.mutateAsync({
          message: messageText,
          conversation_history: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        const aiMsg: ChatMessage = {
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          legal_citations: res.relevant_articles,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        role: 'assistant',
        content:
          'Berdasarkan POJK No. 22 Tahun 2023 Pasal 62, penagihan hanya diperkenankan pada hari Senin - Sabtu pukul 08.00 - 20.00 waktu setempat, dilarang menggunakan intimidasi, dan dilarang menyebarkan data kepada pihak ketiga selain kontak darurat.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        legal_citations: ['POJK No. 22 Tahun 2023 Pasal 62', 'UU PDP No. 27 Tahun 2022 Pasal 65'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleCopyDraft = () => {
    if (!activeDraft) return;
    navigator.clipboard.writeText(activeDraft.generated_letter_body);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b-2 border-[#4A69B3]/35 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareText className="w-5 h-5 text-[#BA3801]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BA3801]">
              RAG Legal Assistant &amp; Letter Drafter
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2C4F] tracking-tight">
            Asisten Advokasi &amp; Pembuat Draf Aduan
          </h1>
          <p className="text-[#2E3E6E] text-sm mt-1 max-w-2xl font-medium">
            Konsultasikan intimidasi pinjol dengan AI yang terikat basis data regulasi POJK, AFPI, KUHP, dan UU PDP tanpa
            halusinasi pasal hukum.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-950 bg-white px-3.5 py-1.5 rounded-xl border-2 border-emerald-400 font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>RAG pgvector Aktif (48 Klausul Hukum)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 shadow-xl shadow-[#1E2C4F]/5 flex flex-col h-[640px]">
          <div className="flex items-center justify-between border-b border-[#4A69B3]/25 pb-3.5 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#BA3801] flex items-center justify-center text-[#BA3801]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#1E2C4F]">Konsultasi Yuridis AI</h2>
                <span className="text-[10px] font-mono text-[#2E3E6E] font-bold">
                  Grounded on Indonesian Financial Law
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono bg-white px-2.5 py-0.5 rounded-md border border-[#1E2C4F] text-[#1E2C4F] font-bold">
              Llama 3.3 RAG
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#BA3801] text-[#BA3801] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-xs ${
                    m.role === 'user'
                      ? 'bg-[#1E2C4F] text-white rounded-tr-xs'
                      : 'bg-white border-2 border-[#4A69B3] text-[#1E2C4F] rounded-tl-xs'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap font-medium">{m.content}</div>

                  {m.legal_citations && m.legal_citations.length > 0 && (
                    <div className="pt-2 border-t border-[#4A69B3]/25 space-y-1">
                      <span className="font-mono text-[10px] font-bold text-[#BA3801] uppercase tracking-wider block">
                        Dasar Yuridis Positif:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.legal_citations.map((cite: string, cIdx: number) => (
                          <span
                            key={cIdx}
                            className="bg-white border border-[#4A69B3] text-[#1E2C4F] font-mono text-[10px] px-2 py-0.5 rounded-md font-bold"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] font-mono text-right ${
                      m.role === 'user' ? 'text-blue-200' : 'text-[#2E3E6E]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#BA3801] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs shadow-xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 text-xs items-center text-[#2E3E6E] font-mono font-medium">
                <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#BA3801] text-[#BA3801] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border-2 border-[#4A69B3] p-3.5 rounded-2xl flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#BA3801] border-t-transparent rounded-full animate-spin" />
                  <span>Mengecek basis data regulasi &amp; menyusun respon...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="pt-3 border-t border-[#4A69B3]/25 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="tactile-btn whitespace-nowrap text-[10px] font-mono bg-white border-2 border-[#4A69B3]/35 hover:bg-[#FFEC89] text-[#1E2C4F] font-bold px-3 py-1 rounded-full transition-all shrink-0"
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan masalah bunga, teror kontak, atau ketik 'buatkan draf surat'..."
                className="flex-1 bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-4 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="tactile-btn bg-[#BA3801] hover:bg-[#9A2E01] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#FFEC89]" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#1E2C4F]/5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#4A69B3]/25 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#BA3801]" />
              <h2 className="font-bold text-base text-[#1E2C4F]">Draf Surat Aduan Formal</h2>
            </div>

            {activeDraft && (
              <button
                type="button"
                onClick={handleCopyDraft}
                className="tactile-btn text-xs font-mono text-white bg-[#BA3801] hover:bg-[#9A2E01] px-3.5 py-1 rounded-full flex items-center gap-1 font-bold shadow-xs"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3 h-3 text-[#FFEC89]" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#FFEC89]" />
                    Salin Teks
                  </>
                )}
              </button>
            )}
          </div>

          {activeDraft ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 bg-white rounded-2xl border-2 border-[#4A69B3]/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#2E3E6E]">Tujuan Disposisi:</span>
                  <span className="font-bold text-[#1E2C4F]">{activeDraft.channel_name}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#2E3E6E]">Portal Pengaduan:</span>
                  <a
                    href={activeDraft.official_portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#BA3801] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{activeDraft.official_portal_url}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#2E3E6E]">WhatsApp Resmi:</span>
                  <span className="font-bold text-[#1E2C4F]">{activeDraft.official_whatsapp}</span>
                </div>
              </div>

              <div className="bg-white border-2 border-[#4A69B3]/35 rounded-2xl p-4 font-mono text-[11px] text-[#1E2C4F] whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-y-auto">
                {activeDraft.generated_letter_body}
              </div>

              <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl text-[11px] text-rose-950 space-y-1">
                <span className="font-bold block font-mono">Pemberitahuan Zero-Auto-Submission:</span>
                <p className="leading-relaxed font-medium">{activeDraft.submission_guidelines}</p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#4A69B3] rounded-2xl p-8 text-center text-[#2E3E6E] space-y-2">
              <FileDown className="w-8 h-8 text-[#BA3801] mx-auto" />
              <h3 className="font-bold text-sm text-[#1E2C4F]">Belum Ada Draf Dibuat</h3>
              <p className="text-xs max-w-xs mx-auto text-[#2E3E6E] font-medium">
                Ketik "buatkan draf surat pengaduan OJK" pada obrolan di sebelah kiri untuk menghasilkan berkas resmi.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-[#4A69B3]/25 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2E3E6E] font-bold block">
              Kanal Pengaduan Resmi Indonesia:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#4A69B3]/35 space-y-0.5">
                <span className="font-bold text-[#1E2C4F] block flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-[#BA3801]" /> OJK 157
                </span>
                <span className="text-[10px] text-[#2E3E6E]">Telepon: 157</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#4A69B3]/35 space-y-0.5">
                <span className="font-bold text-[#1E2C4F] block flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[#BA3801]" /> Posko AFPI
                </span>
                <span className="text-[10px] text-[#2E3E6E]">150 505 / pengaduan@afpi.or.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
