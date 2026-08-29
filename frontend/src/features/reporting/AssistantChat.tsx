import React, { useState, useRef, useEffect } from 'react';
import { useAssistantChat, useGenerateComplaintDraft } from '../../hooks/useReporting';
import { ChatMessage, ComplaintDraftResponse } from '../../types';
import {
  Send,
  Scale,
  FileDown,
  PhoneCall,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { PelitaMascot } from '../../components/brand/PelitaMascot';

export const AssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Halo! Saya Asisten Advokasi Konsumen Pelita. Saya dapat membantu Anda mengidentifikasi pelanggaran penagihan, menghitung denda non-prosedural, dan menyusun surat aduan resmi ke OJK Kontak 157, Posko AFPI, atau Bareskrim Polri.',
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
          'Berdasarkan POJK No. 22 Tahun 2023 Pasal 62, penagihan hanya diperkenankan pada hari Senin sampai Sabtu pukul 08.00 sampai 20.00 waktu setempat, dilarang menggunakan intimidasi, dan dilarang menyebarkan data kepada pihak ketiga selain kontak darurat.',
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Platform Advokasi Konsumen &amp; Asisten Yuridis</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Asisten Advokasi &amp; <span className="text-[#BA3801]">Pembuat Draf Aduan</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Konsultasikan intimidasi penagihan dengan AI yang terikat basis data regulasi POJK, AFPI, KUHP, dan UU PDP tanpa rekayasa pasal hukum.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs text-xs font-mono text-[#1E2C4F] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>48 Klausul Regulasi Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chat Conversation */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-sm flex flex-col h-[650px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <PelitaMascot size="sm" mood="analyzing" />
              <div>
                <h2 className="font-semibold text-sm text-[#1E2C4F]">Konsultasi Bersama Lita AI</h2>
                <span className="text-[11px] font-mono text-slate-500">
                  Didukung Regulasi POJK &amp; UU PDP
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono bg-[#BA3801]/10 text-[#BA3801] px-3 py-1 rounded-full font-semibold">
              Sentinel Yuridis
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="shrink-0 mt-0.5">
                    <PelitaMascot size="sm" mood="guiding" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-[#1E2C4F] text-white rounded-tr-xs'
                      : 'bg-slate-50/90 border border-slate-200/60 text-[#1E2C4F] rounded-tl-xs'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap font-normal text-[13px]">{m.content}</div>

                  {m.legal_citations && m.legal_citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                      <span className="font-mono text-[10px] font-semibold text-[#BA3801] uppercase tracking-wider block">
                        Dasar Regulasi Terkait:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.legal_citations.map((cite: string, cIdx: number) => (
                          <span
                            key={cIdx}
                            className="bg-white border border-slate-200/80 text-slate-800 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-2xs"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] font-mono text-right ${
                      m.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#BA3801] text-white flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-semibold shadow-2xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 text-xs items-center text-slate-600 font-mono">
                <div className="shrink-0">
                  <PelitaMascot size="sm" mood="analyzing" />
                </div>
                <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 border-2 border-[#BA3801] border-t-transparent rounded-full animate-spin" />
                  <span>Memeriksa basis data hukum dan menyusun respon...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions & Input Form */}
          <div className="pt-3 border-t border-slate-200/60 space-y-2.5 mt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap text-[11px] font-mono bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 active:scale-95 shrink-0"
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
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan dasar hukum, atau ketik 'buatkan draf surat aduan'..."
                className="flex-1 bg-white border border-slate-200/80 rounded-full px-4 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#BA3801] hover:bg-[#9A2E01] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#FFEC89]" />
                <span>Kirim</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Formal Complaint Letter & Direct Portal Links */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#BA3801]" />
              <h2 className="font-semibold text-base text-[#1E2C4F]">Draf Surat Aduan Formal</h2>
            </div>

            {activeDraft && (
              <button
                type="button"
                onClick={handleCopyDraft}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#BA3801] hover:bg-[#9A2E01] text-white transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFEC89]" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FFEC89]" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            )}
          </div>

          {activeDraft ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Tujuan Disposisi:</span>
                  <span className="font-semibold text-[#1E2C4F]">{activeDraft.channel_name}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Portal Pengaduan:</span>
                  <a
                    href={activeDraft.official_portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#BA3801] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{activeDraft.official_portal_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">WhatsApp Resmi:</span>
                  <span className="font-semibold text-[#1E2C4F]">{activeDraft.official_whatsapp}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 font-mono text-[11px] text-[#1E2C4F] whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {activeDraft.generated_letter_body}
              </div>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200/70 rounded-2xl text-[11px] text-rose-950 space-y-1">
                <span className="font-semibold block font-mono">Pemberitahuan Prosedur Pelaporan:</span>
                <p className="leading-relaxed text-slate-700">{activeDraft.submission_guidelines}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/90 bg-white/60 p-8 text-center text-slate-500 space-y-2">
              <FileDown className="w-8 h-8 text-[#BA3801] mx-auto opacity-90" />
              <h3 className="font-semibold text-sm text-[#1E2C4F]">Belum Ada Draf Dihasilkan</h3>
              <p className="text-xs max-w-xs mx-auto text-slate-600 leading-relaxed">
                Ketik "buatkan draf surat pengaduan OJK" pada obrolan di sebelah kiri untuk menghasilkan berkas resmi.
              </p>
            </div>
          )}

          {/* Official Channel Directory */}
          <div className="pt-3 border-t border-slate-200/60 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Kanal Pengaduan Resmi Indonesia:
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                <span className="font-semibold text-[#1E2C4F] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>OJK 157</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Hotline: 157</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                <span className="font-semibold text-[#1E2C4F] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Posko AFPI</span>
                </span>
                <span className="text-[10px] text-slate-500 block">150 505 / afpi.or.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
