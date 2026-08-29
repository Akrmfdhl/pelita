import React, { useState, useRef } from 'react';
import { useEvidenceCases, useCreateCase, useAddEvidenceItem } from '../../hooks/useEvidence';
import { EvidenceItem } from '../../types';
import {
  ShieldAlert,
  Plus,
  Clock,
  Trash2,
  Copy,
  Check,
  Zap,
  FolderPlus,
  FolderArchive,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export const EvidenceUploader: React.FC = () => {
  const { data: cases = [] } = useEvidenceCases();
  const createCaseMutation = useCreateCase();
  const addEvidenceMutation = useAddEvidenceItem();

  const [activeCaseId, setActiveCaseId] = useState<string>('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [senderPhone, setSenderPhone] = useState('');
  const [messageTimeHour, setMessageTimeHour] = useState('');
  const [messageText, setMessageText] = useState('');
  const [uploadedScreenshotName, setUploadedScreenshotName] = useState<string | null>(null);
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [copiedDossier, setCopiedDossier] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveActiveCaseId = activeCaseId || (cases.length > 0 ? cases[0].id : '');
  const loading = createCaseMutation.isPending || addEvidenceMutation.isPending;

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim()) return;

    try {
      const newCase = await createCaseMutation.mutateAsync({
        case_title: newCaseTitle,
        platform_name: 'Pinjaman Terlapor',
        debt_collector_identifier: senderPhone || '+6281234567890',
        claimed_debt_amount: 3000000,
        case_summary: 'Rekonstruksi intimidasi penagihan dan teror data pribadi.',
      });
      setActiveCaseId(newCase.id);
      setNewCaseTitle('');
      setShowNewCaseModal(false);
    } catch {
      // Handled via TanStack Query state
    }
  };

  const applyPreset = (scenario: 'dox' | 'night' | 'abuse') => {
    if (scenario === 'dox') {
      setSenderPhone('+6281298765432');
      setMessageTimeHour('14');
      setMessageText(
        'Peringatan terakhir! Data KTP Anda dan nomor kontak seluruh keluarga sudah ada di tim lapangan kami. Kami akan broadcast ke teman Anda jika tidak bayar dalam 1 jam!'
      );
    } else if (scenario === 'night') {
      setSenderPhone('+6287811223344');
      setMessageTimeHour('23');
      setMessageText(
        'Buka pintu rumah sekarang! Jangan pura-pura tidur! Kami tahu Anda ada di dalam, bayar hutang pinjol Anda malam ini juga!'
      );
    } else if (scenario === 'abuse') {
      setSenderPhone('+6285600112233');
      setMessageTimeHour('09');
      setMessageText(
        'Dasar penipu tidak tahu diri! Kami akan buat Anda dipecat dari kantor hari ini juga kalau tidak transfer sekarang!'
      );
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !effectiveActiveCaseId) return;

    try {
      const res = await addEvidenceMutation.mutateAsync({
        caseId: effectiveActiveCaseId,
        item: {
          file_url: uploadedScreenshotName
            ? `https://storage.pelita.id/evidence/${encodeURIComponent(uploadedScreenshotName)}`
            : 'https://storage.pelita.id/evidence/chat_screenshot_01.png',
          media_type: 'image/png',
          message_timestamp_hour: parseInt(messageTimeHour || '22', 10),
          sender_phone: senderPhone || '+6281234567890',
          message_text: messageText,
          threat_category: 'contact_dox_threat',
        },
      });
      setItems([{ ...res, message_timestamp_hour: parseInt(messageTimeHour || '22', 10) }, ...items]);
      setMessageText('');
      setUploadedScreenshotName(null);
    } catch {
      // Handled via TanStack Query state
    }
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const generateDossierText = () => {
    const activeCase = cases.find((c) => c.id === effectiveActiveCaseId);
    let dossier = `BERKAS BUKTI KRONOLOGIS INTIMIDASI PINJAMAN ONLINE\nKasus: ${activeCase?.case_title || 'Aduan Pinjol'}\nDisusun via Pelita Integrity Platform\n\n`;
    items.forEach((item, idx) => {
      dossier += `--- BUKTI #${idx + 1} ---\n`;
      dossier += `Pengirim: ${item.sender_phone}\n`;
      dossier += `Waktu Kirim: Pukul ${item.message_timestamp_hour || 22}:00 WIB\n`;
      dossier += `Pesan Intimidasi: "${item.message_text}"\n`;
      dossier += `Pelanggaran Teridentifikasi:\n`;
      item.violations.forEach((v) => {
        dossier += `  - [${v.rule_code}] ${v.violation_type} (${v.statutory_article})\n`;
      });
      dossier += '\n';
    });
    return dossier;
  };

  const handleCopyDossier = () => {
    const text = generateDossierText();
    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <span>Platform Advokasi Kuratif &amp; Investigasi Bukti</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Penyusun Bukti &amp; <span className="text-[#BA3801]">Rekonstruksi Kronologi</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Ekstrak bukti teror dari tangkapan layar WhatsApp/SMS debt collector, tandai pelanggaran hukum secara otomatis (UU PDP dan POJK No. 22/2023), dan susun berkas laporan resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('dox')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100/80 text-rose-900 border border-rose-200/80 transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Preset: Ancaman Sebar Data</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('night')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Preset: Teror Jam 23:00</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Switcher Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
            <FolderArchive className="w-5 h-5 text-[#BA3801]" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-mono uppercase text-slate-500 font-medium">
              Berkas Kasus Aktif:
            </label>
            <select
              value={effectiveActiveCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-semibold text-[#1E2C4F] focus:outline-none cursor-pointer"
            >
              {cases.length === 0 && <option value="">(Belum Ada Kasus - Buat Kasus Baru)</option>}
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.case_title} ({c.id.substring(0, 8)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewCaseModal(!showNewCaseModal)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-[#1E2C4F] border border-slate-200/90 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-2xs shrink-0"
        >
          <FolderPlus className="w-4 h-4 text-[#BA3801]" />
          <span>Buat Kasus Baru</span>
        </button>
      </div>

      {/* Modal / Inline Creator for New Case */}
      {showNewCaseModal && (
        <form
          onSubmit={handleCreateCase}
          className="p-5 rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl flex flex-col sm:flex-row gap-3 shadow-md animate-fadeIn"
        >
          <input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Judul kasus baru (contoh: Teror Penagihan Dana Abadi)..."
            className="flex-1 bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
            required
          />
          <button
            type="submit"
            className="bg-[#BA3801] hover:bg-[#9A2E01] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm"
          >
            Simpan Kasus
          </button>
        </form>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Input Pesan Teror */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <h2 className="font-semibold text-base text-[#1E2C4F]">Input Pesan Intimidasi</h2>
            <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Privasi Terjamin
            </span>
          </div>

          {/* Screenshot Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-white rounded-2xl p-5 text-center cursor-pointer transition-all duration-150"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedScreenshotName(e.target.files[0].name);
                }
              }}
            />
            <ImageIcon className="w-6 h-6 text-[#BA3801] mx-auto mb-1.5 opacity-90" />
            {uploadedScreenshotName ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{uploadedScreenshotName}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Lampirkan tangkapan layar chat WhatsApp/SMS (opsional)
              </p>
            )}
          </div>

          <form onSubmit={handleAddEvidence} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                  Nomor Penagih
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-mono focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                  Waktu (WIB)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={messageTimeHour}
                  onChange={(e) => setMessageTimeHour(e.target.value)}
                  placeholder="22"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-mono text-center focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                Transkrip Pesan Teror
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all leading-relaxed"
                placeholder="Masukkan transkrip pesan atau kata-kata ancaman penagih..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageText.trim() || !effectiveActiveCaseId}
              className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full font-semibold text-sm transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menganalisis Pasal Pelanggaran...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#FFEC89]" />
                  <span>Tambahkan ke Lini Masa</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Lini Masa Bukti Kasus */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-xl font-semibold text-[#1E2C4F] tracking-tight">
                Lini Masa Bukti ({items.length})
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                Urutan kronologis resmi untuk pelaporan ke OJK / Kepolisian
              </span>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleCopyDossier}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#BA3801] hover:bg-[#9A2E01] text-white transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                {copiedDossier ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFEC89]" />
                    <span>Berkas Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FFEC89]" />
                    <span>Salin Berkas Kronologi</span>
                  </>
                )}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200/90 bg-white/60 backdrop-blur-md p-12 text-center text-slate-500 shadow-2xs">
              <ShieldAlert className="w-12 h-12 text-[#BA3801] mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold text-base text-[#1E2C4F]">Belum Ada Bukti Tercatat</h3>
              <p className="text-xs max-w-sm mx-auto mt-1.5 text-slate-600 leading-relaxed">
                Pilih salah satu preset skenario di atas atau masukkan transkrip pesan chat untuk merekonstruksi kronologi intimidasi.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => {
                const hour = item.message_timestamp_hour ?? 22;
                const isLateNight = hour < 8 || hour >= 20;

                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-5 sm:p-6 shadow-sm space-y-3.5 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white bg-[#1E2C4F] px-2.5 py-0.5 rounded-full text-[11px]">
                          Bukti #{idx + 1}
                        </span>
                        <span className="text-[#1E2C4F] font-semibold">{item.sender_phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-medium ${
                            isLateNight
                              ? 'bg-rose-50 text-rose-900 border border-rose-200/80'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{hour}:00 WIB {isLateNight && '(Di Luar Jam Resmi)'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Hapus bukti"
                          aria-label="Hapus bukti"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <blockquote className="border-l-2 border-[#BA3801] bg-slate-50/80 p-4 rounded-r-2xl text-[14px] text-[#1E2C4F] leading-relaxed font-normal">
                      "{item.message_text}"
                    </blockquote>

                    {item.violations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="font-mono text-[11px] font-semibold text-rose-900 block">
                          Pelanggaran Teridentifikasi:
                        </span>
                        {item.violations.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-rose-50/60 border border-rose-200/70 text-rose-950 p-3.5 rounded-2xl text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>{v.violation_type}</span>
                              <span className="font-mono text-[10px] text-slate-500">{v.rule_code}</span>
                            </div>
                            <p className="font-mono text-[11px] text-slate-700">Dasar: {v.statutory_article}</p>
                            <p className="text-slate-600 leading-relaxed font-normal">{v.legal_explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
