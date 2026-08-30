import React, { useState, useRef, useEffect } from 'react';
import { useAssistantChat, useGenerateComplaintDraft } from '../../hooks/useReporting';
import { ChatMessage, ComplaintDraftResponse, ExtractedMediaContext } from '../../types';
import {
  Send,
  Scale,
  FileDown,
  PhoneCall,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Building2,
  ShieldAlert,
  Paperclip,
  X,
  ImageIcon,
  ArrowDownCircle,
} from 'lucide-react';
import { PelitaMascot } from '../../components/brand/PelitaMascot';
import { ProcessOrbPill, OrbState } from '../../components/brand/LitaThinkingOrb';
import { LegalMarkdownViewer } from '../../components/common/LegalMarkdownViewer';
import { generateOfficialLegalDossierPDF } from '../../lib/pdfLegalGenerator';

export const AssistantChat: React.FC = () => {
  const userName = localStorage.getItem('pelita_user_name') || 'Pengguna Terverifikasi';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `## Selamat Datang di Pusat Advokasi Konsumen Pelita\n\nHalo **${userName}**! Saya **Lita**, Asisten AI Sentinel Advokasi & Integritas Hukum resmi platform Pelita.\n\nAnda dapat mengunggah **screenshot chat intimidasi WhatsApp / SMS** atau mengajukan pertanyaan yuridis mengenai bunga ilegal dan teror penagih. Saya akan mengekstrak bukti secara otomatis dan menyusun draf berkas aduan resmi lengkap di bagian bawah halaman ini.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
  } | null>(null);

  const [currentOrbState, setCurrentOrbState] = useState<OrbState>('listening');
  const [currentOrbLabel, setCurrentOrbLabel] = useState<string>('Lita Siap Mendampingi');

  const [selectedChannel, setSelectedChannel] = useState<'ojk' | 'afpi' | 'polri'>('ojk');
  const [victimName, setVictimName] = useState(userName);
  const [victimNIK, setVictimNIK] = useState('3171012345678901');
  const [victimPhone, setVictimPhone] = useState('+6281234567890');
  const [platformName, setPlatformName] = useState('Pinjaman Dana Kilat (Terindikasi Ilegal)');
  const [violationSummary, setViolationSummary] = useState(
    'Teror ancaman penyebaran foto KTP dan kontak darurat di luar jam operasional resmi (22.00 WIB).'
  );

  const [activeDraft, setActiveDraft] = useState<ComplaintDraftResponse | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const draftSectionRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAssistantChat();
  const draftMutation = useGenerateComplaintDraft();

  const loading = chatMutation.isPending || draftMutation.isPending;

  const quickQuestions = [
    'Debt collector mengancam sebar data KTP, apa pasal hukumnya?',
    'Penagih meneror keluarga di luar kontak darurat, lapor ke mana?',
    'Suku bunga pinjol saya 0.8% per hari, apakah ini ilegal?',
    'Tentukan saluran dan susun draf pengaduan resmi.',
  ];

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (loading) {
      setCurrentOrbState('solving');
      setCurrentOrbLabel('Menganalisis Dokumen & Fakta...');
      const timer1 = setTimeout(() => {
        setCurrentOrbState('searching');
        setCurrentOrbLabel('Memeriksa Regulasi POJK & UU PDP...');
      }, 1500);
      const timer2 = setTimeout(() => {
        setCurrentOrbState('composing');
        setCurrentOrbLabel('Menyusun Telaah Yuridis...');
      }, 3000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setCurrentOrbState('listening');
      setCurrentOrbLabel('Lita Siap Mendampingi');
    }
  }, [loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Full = reader.result as string;
      const base64Data = base64Full.split(',')[1] || '';
      setSelectedFile({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateDraft = async (channelOverride?: 'ojk' | 'afpi' | 'polri') => {
    setApiError(null);
    const targetChannel = channelOverride || selectedChannel;
    setCurrentOrbState('composing');
    setCurrentOrbLabel('Menyusun Draf Surat Aduan Lengkap...');

    try {
      const draft = await draftMutation.mutateAsync({
        case_id: 'case_active_user',
        channel_code: targetChannel,
        victim_name: victimName,
        victim_nik: victimNIK,
        victim_phone: victimPhone,
        platform_name: platformName,
        violation_summary: violationSummary,
      });

      setActiveDraft(draft);
      setSelectedChannel(targetChannel);
      setCurrentOrbState('listening');
      setCurrentOrbLabel('Draf Berkas Resmi Selesai Disusun');
      draftSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: unknown) {
      const error = err as Error;
      setApiError(`Gagal membuat draf via API: ${error.message || 'Server Go API tidak dapat dijangkau di port 8080'}`);
      setCurrentOrbState('listening');
      setCurrentOrbLabel('Koneksi Gagal');
    }
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if ((!messageText.trim() && !selectedFile) || loading) return;

    setApiError(null);

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageText || (selectedFile ? `[Mengunggah Dokumen/Screenshot: ${selectedFile.file.name}]` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment_preview: selectedFile?.previewUrl,
      attachment_name: selectedFile?.file.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }

    const attachmentPayload = selectedFile
      ? {
          attachment_base64: selectedFile.base64,
          attachment_type: selectedFile.file.type,
          attachment_name: selectedFile.file.name,
        }
      : {};

    const fileToClean = selectedFile;
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const lower = messageText.toLowerCase();
    let detectedTargetChannel: 'ojk' | 'afpi' | 'polri' = selectedChannel;
    if (lower.includes('afpi')) detectedTargetChannel = 'afpi';
    if (lower.includes('polri') || lower.includes('polisi') || lower.includes('siber')) detectedTargetChannel = 'polri';

    try {
      const res = await chatMutation.mutateAsync({
        message: messageText || 'Tolong analisis dokumen/screenshot yang saya lampirkan.',
        conversation_history: messages.map((m) => ({ role: m.role, content: m.content })),
        ...attachmentPayload,
      });

      if (res.extracted_context) {
        const ctx: ExtractedMediaContext = res.extracted_context;
        if (ctx.platform_name) setPlatformName(ctx.platform_name);
        if (ctx.threat_summary) setViolationSummary(ctx.threat_summary);
      }

      if (lower.includes('draf') || lower.includes('surat') || lower.includes('lapor')) {
        await handleGenerateDraft(detectedTargetChannel);
      }

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        legal_citations: res.relevant_articles,
        extracted_context: res.extracted_context,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const error = err as Error;
      setApiError(`Koneksi Backend API Offline: ${error.message || 'Gagal menghubungi http://localhost:8080/api/v1/reporting/chat'}`);
      const errResponse: ChatMessage = {
        role: 'assistant',
        content: `[GAGAL TERHUBUNG KE OTORITAS AI] Layanan backend API tidak merespons. Pastikan server Go API aktif di port 8080.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errResponse]);
    }

    if (fileToClean?.previewUrl) {
      URL.revokeObjectURL(fileToClean.previewUrl);
    }
  };

  const handleCopyDraft = () => {
    if (!activeDraft) return;
    navigator.clipboard.writeText(activeDraft.generated_letter_body);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleExportPDF = () => {
    if (!activeDraft) return;

    generateOfficialLegalDossierPDF({
      channelCode: selectedChannel,
      channelName: activeDraft.channel_name,
      officialPortalUrl: activeDraft.official_portal_url,
      officialWhatsapp: activeDraft.official_whatsapp,
      victimName: victimName,
      victimNIK: victimNIK,
      victimPhone: victimPhone,
      platformName: platformName,
      violationSummary: violationSummary,
      customLetterBody: activeDraft.generated_letter_body,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header Section with Official Mascot & Dynamic Process Orb Pill */}
      <div className="space-y-4 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-3">
            <PelitaMascot size="sm" mood="guiding" />
            <div>
              <span className="font-semibold text-sm text-[#1E2C4F] block">Pelita AI Sentinel</span>
              <span className="text-[11px] font-mono text-slate-500">Platform Advokasi Konsumen Finansial</span>
            </div>
          </div>

          <ProcessOrbPill state={currentOrbState} label={currentOrbLabel} theme="dark" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Asisten Advokasi &amp; <span className="text-[#BA3801]">Analisis Multimodal</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Konsultasikan intimidasi penagihan atau lampirkan screenshot percakapan WhatsApp untuk dianalisis langsung oleh Lita AI Sentinel.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-mono text-[#1E2C4F] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>OCR Multimodal &amp; 48 Klausul POJK</span>
          </div>
        </div>

        {apiError && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-center gap-2.5 font-mono animate-fadeIn shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}
      </div>

      {/* TOP SECTION: Full-Width Chat Workspace */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm flex flex-col h-[740px] ring-1 ring-slate-900/5">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <PelitaMascot size="sm" mood={loading ? 'analyzing' : 'guiding'} />
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-[#1E2C4F]">Konsultasi Bersama Lita AI Sentinel</h2>
              <span className="text-[11px] font-mono text-slate-500">
                Didukung Analisis Multimodal Screenshot &amp; Regulasi POJK / UU PDP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProcessOrbPill state={currentOrbState} label={currentOrbLabel} theme="light" />
            <span className="text-[11px] font-mono bg-[#BA3801]/10 text-[#BA3801] px-3.5 py-1 rounded-full font-semibold border border-[#BA3801]/20">
              Sesi: {userName}
            </span>
          </div>
        </div>

        {/* Chat Message Log (Internal Scroll Container) */}
        <div
          ref={chatScrollContainerRef}
          className="flex-1 overflow-y-auto space-y-6 pr-2 scroll-smooth"
        >
          {messages.map((m, idx) => (
            <div key={idx} className="w-full">
              {m.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-[#1E2C4F] text-white p-4 space-y-2.5 shadow-xs">
                    {m.attachment_preview && (
                      <div className="rounded-xl overflow-hidden border border-white/20 bg-slate-900/40 p-1">
                        <img
                          src={m.attachment_preview}
                          alt={m.attachment_name || 'Lampiran'}
                          className="max-h-48 rounded-lg object-contain mx-auto"
                        />
                        <span className="block text-[10px] font-mono text-slate-300 mt-1 text-center truncate px-2">
                          {m.attachment_name}
                        </span>
                      </div>
                    )}
                    <div className="text-[13px] leading-relaxed font-normal whitespace-pre-wrap">{m.content}</div>
                    <div className="text-[10px] font-mono text-blue-200 text-right">{m.timestamp}</div>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-4 hover:border-[#BA3801]/30 transition-all ring-1 ring-slate-900/5">
                  {/* Document Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <PelitaMascot size="sm" mood="guiding" />
                      <div>
                        <span className="font-semibold text-xs text-[#1E2C4F] block">Lita AI Sentinel</span>
                        <span className="text-[10px] font-mono text-slate-500">Telaah Yuridis Resmi</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {m.extracted_context && (
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                          Konteks Screenshot Terdeteksi
                        </span>
                      )}
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                        Terverifikasi Hukum
                      </span>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="w-full overflow-hidden">
                    <LegalMarkdownViewer content={m.content} />
                  </div>

                  {/* Quick Action CTA to Full Draft */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1E2C4F]">
                      <FileText className="w-4 h-4 text-[#BA3801]" />
                      <span>Draf Surat Pengaduan Resmi Terkonsolidasi:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerateDraft(selectedChannel)}
                      className="px-4 py-1.5 rounded-full bg-[#BA3801] hover:bg-[#9A2E01] text-white text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs shrink-0"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      <span>Buka Draf Lengkap di Bawah</span>
                    </button>
                  </div>

                  {/* Document Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {m.legal_citations && m.legal_citations.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase font-semibold text-[#BA3801] mr-1">
                          Rujukan:
                        </span>
                        {m.legal_citations.map((cite: string, cIdx: number) => (
                          <span
                            key={cIdx}
                            className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded-md font-medium border border-slate-200/60"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div />
                    )}

                    <span className="text-[10px] font-mono text-slate-400 shrink-0 self-end sm:self-center">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between gap-4 text-xs font-mono text-slate-700 shadow-xs">
              <div className="flex items-center gap-3">
                <PelitaMascot size="sm" mood="analyzing" />
                <span>Lita sedang memproses telaah yuridis via AI Groq 120B...</span>
              </div>
              <ProcessOrbPill state={currentOrbState} label={currentOrbLabel} theme="dark" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-3 border-t border-slate-200 space-y-2.5 mt-2 shrink-0">
          {/* File Preview Badge */}
          {selectedFile && (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono animate-fadeIn">
              <div className="flex items-center gap-2.5 truncate">
                <ImageIcon className="w-4 h-4 text-[#BA3801] shrink-0" />
                <span className="truncate text-slate-800 font-medium">{selectedFile.file.name}</span>
                <span className="text-slate-400 text-[10px]">
                  ({(selectedFile.file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Questions Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[11px] font-mono bg-slate-100 hover:bg-[#BA3801]/10 hover:text-[#BA3801] text-slate-700 font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 active:scale-95 shrink-0"
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
            className="flex items-end gap-2 bg-slate-50/80 p-1.5 rounded-3xl border border-slate-200 focus-within:border-[#BA3801] focus-within:ring-1 focus-within:ring-[#BA3801] transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Unggah screenshot chat atau dokumen kontrak"
              className="p-2.5 rounded-full bg-white hover:bg-slate-200 text-slate-700 transition-all duration-150 active:scale-95 shrink-0 shadow-2xs mb-0.5 ml-0.5"
            >
              <Paperclip className="w-4 h-4 text-[#BA3801]" />
            </button>

            {/* Auto-expanding textarea (Claude / Gemini style) */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan pasal hukum, atau lampirkan screenshot chat intimidasi... (Shift+Enter untuk baris baru)"
              className="flex-1 bg-transparent px-2.5 py-2 text-xs text-[#1E2C4F] font-medium focus:outline-none transition-all resize-none max-h-40 overflow-y-auto leading-relaxed"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedFile)}
              className="bg-[#BA3801] hover:bg-[#9A2E01] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50 shrink-0 mb-0.5 mr-0.5"
            >
              <Send className="w-3.5 h-3.5 text-[#FFEC89]" />
              <span>Kirim</span>
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM SECTION: Official Complaint Drafting Center */}
      <div
        ref={draftSectionRef}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-7 ring-1 ring-slate-900/5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-[#BA3801]" />
            <div>
              <h2 className="font-semibold text-lg text-[#1E2C4F]">Pusat Pembuatan Draf Surat Aduan Formal</h2>
              <p className="text-xs text-slate-500 font-normal">
                Kompilasi otomatis pelanggaran POJK, AFPI, dan UU PDP ke dalam berkas pengaduan resmi siap kirim.
              </p>
            </div>
          </div>

          {activeDraft && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-[#1E2C4F] border border-slate-200 shadow-2xs transition-all duration-150 active:scale-95 flex items-center gap-2 shrink-0"
              >
                <FileDown className="w-4 h-4 text-[#BA3801]" />
                <span>Export PDF Resmi</span>
              </button>

              <button
                type="button"
                onClick={handleCopyDraft}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#BA3801] hover:bg-[#9A2E01] text-white transition-all duration-150 active:scale-95 flex items-center gap-2 shadow-sm shrink-0"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFEC89]" />
                    <span>Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FFEC89]" />
                    <span>Salin Dokumen Surat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Channel Selector Tabs */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-600 uppercase tracking-wider font-semibold block">
            1. Tentukan Tujuan Saluran Disposisi Resmi:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleGenerateDraft('ojk')}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 ${
                selectedChannel === 'ojk'
                  ? 'bg-slate-50 border-[#BA3801] shadow-2xs ring-1 ring-[#BA3801]/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#1E2C4F]">
                  <Building2 className="w-4 h-4 text-[#BA3801]" />
                  <span>Satgas PASTI OJK 157</span>
                </div>
                {selectedChannel === 'ojk' && <span className="w-2 h-2 rounded-full bg-[#BA3801]" />}
              </div>
              <span className="text-[11px] text-slate-500 block">Pinjol legal &amp; ilegal ke kontak157.ojk.go.id</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateDraft('afpi')}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 ${
                selectedChannel === 'afpi'
                  ? 'bg-slate-50 border-[#BA3801] shadow-2xs ring-1 ring-[#BA3801]/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#1E2C4F]">
                  <FileText className="w-4 h-4 text-[#BA3801]" />
                  <span>Posko Pengaduan AFPI</span>
                </div>
                {selectedChannel === 'afpi' && <span className="w-2 h-2 rounded-full bg-[#BA3801]" />}
              </div>
              <span className="text-[11px] text-slate-500 block">Pelanggaran kode etik debt collector berizin</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateDraft('polri')}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 ${
                selectedChannel === 'polri'
                  ? 'bg-slate-50 border-[#BA3801] shadow-2xs ring-1 ring-[#BA3801]/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#1E2C4F]">
                  <ShieldAlert className="w-4 h-4 text-[#BA3801]" />
                  <span>Patroli Siber Bareskrim Polri</span>
                </div>
                {selectedChannel === 'polri' && <span className="w-2 h-2 rounded-full bg-[#BA3801]" />}
              </div>
              <span className="text-[11px] text-slate-500 block">Tindak pidana pemerasan, ancaman &amp; sebar KTP</span>
            </button>
          </div>
        </div>

        {/* Complaint Details Form */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-mono text-slate-600 uppercase tracking-wider font-semibold block">
            2. Parameter Identitas &amp; Fakta Pelanggaran:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-500 mb-1 block">Nama Lengkap Korban</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-500 mb-1 block">NIK Pelapor</label>
              <input
                type="text"
                value={victimNIK}
                onChange={(e) => setVictimNIK(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-500 mb-1 block">Nomor Telepon / WA</label>
              <input
                type="text"
                value={victimPhone}
                onChange={(e) => setVictimPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-500 mb-1 block">Nama Platform / Pinjol Terlapor</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-500 mb-1 block">Ringkasan Fakta Ancaman</label>
              <input
                type="text"
                value={violationSummary}
                onChange={(e) => setViolationSummary(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleGenerateDraft()}
              disabled={loading}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1E2C4F] hover:bg-[#15203A] text-white transition-all duration-150 active:scale-95 shadow-sm"
            >
              Susun / Perbarui Draf Surat Aduan Lengkap
            </button>
          </div>
        </div>

        {/* Rendered Letter Output */}
        {activeDraft ? (
          <div className="space-y-4 animate-fadeIn pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[11px]">Tujuan Disposisi:</span>
                <span className="font-semibold text-[#1E2C4F] block">{activeDraft.channel_name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[11px]">Portal Pengaduan:</span>
                <a
                  href={activeDraft.official_portal_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#BA3801] font-semibold hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{activeDraft.official_portal_url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[11px]">Hotline / WA Resmi:</span>
                <span className="font-semibold text-[#1E2C4F] block">{activeDraft.official_whatsapp}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 font-mono text-xs text-[#1E2C4F] whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto shadow-2xs select-all">
              {activeDraft.generated_letter_body}
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950 space-y-1.5">
              <span className="font-semibold block font-mono">Petunjuk Pengiriman Berkas:</span>
              <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">{activeDraft.submission_guidelines}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 space-y-3 shadow-2xs">
            <FileDown className="w-10 h-10 text-[#BA3801] mx-auto opacity-90" />
            <h3 className="font-semibold text-sm text-[#1E2C4F]">Draf Surat Aduan Belum Dihasilkan</h3>
            <p className="text-xs max-w-md mx-auto text-slate-600 leading-relaxed">
              Pilih salah satu tab tujuan disposisi di atas dan klik tombol di bawah untuk menyusun dokumen resmi lengkap.
            </p>
            <button
              type="button"
              onClick={() => handleGenerateDraft('ojk')}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#BA3801] hover:bg-[#9A2E01] text-white transition-all duration-150 active:scale-95 shadow-sm inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Susun Draf Lengkap Sekarang</span>
            </button>
          </div>
        )}

        {/* Official Directory Contacts Footer */}
        <div className="pt-4 border-t border-slate-200">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-3">
            Direktori Pengaduan Konsumen Resmi Republik Indonesia:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-[#1E2C4F] flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#BA3801]" />
                <span>Satgas PASTI OJK</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Hotline 157 / WA 081-157-157-157</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-[#1E2C4F] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#BA3801]" />
                <span>Posko AFPI</span>
              </span>
              <span className="text-[10px] text-slate-500 block">150 505 / pengaduan@afpi.or.id</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-[#1E2C4F] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#BA3801]" />
                <span>Patroli Siber Polri</span>
              </span>
              <span className="text-[10px] text-slate-500 block">patrolisiber.id / Call Center 110</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
