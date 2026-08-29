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
  CheckCircle,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b-2 border-[#4A69B3]/35 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-700">
              Modul Advokasi Kuratif
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2C4F] tracking-tight">Penyusun Bukti &amp; Rekonstruksi Kronologi</h1>
          <p className="text-[#2E3E6E] text-sm mt-1 max-w-2xl font-medium">
            Ekstrak bukti teror dari tangkapan layar WhatsApp/SMS debt collector, tandai pelanggaran hukum secara otomatis
            (UU PDP &amp; POJK 22/2023), dan susun berkas laporan resmi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('dox')}
            className="tactile-btn text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-950 border-2 border-rose-400 hover:bg-rose-100 flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-rose-700" />
            Preset: Ancaman Sebar KTP
          </button>
          <button
            type="button"
            onClick={() => applyPreset('night')}
            className="tactile-btn text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 border-2 border-amber-400 hover:bg-amber-100 flex items-center gap-1.5 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Preset: Teror Jam 23:00
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-[#4A69B3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FolderArchive className="w-5 h-5 text-[#BA3801] shrink-0" />
          <div className="flex-1">
            <label className="block text-[11px] font-mono uppercase text-[#2E3E6E] font-bold">Berkas Kasus Aktif:</label>
            <select
              value={effectiveActiveCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="bg-white border-2 border-[#4A69B3]/40 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
            >
              {cases.length === 0 && <option value="">(Belum Ada Kasus - Klik Buat Kasus Baru)</option>}
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
          className="tactile-btn text-xs font-mono font-bold bg-white hover:bg-[#FFEC89] text-[#BA3801] border-2 border-[#BA3801] px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          Buat Berkas Kasus Baru
        </button>
      </div>

      {showNewCaseModal && (
        <form onSubmit={handleCreateCase} className="p-4 bg-white border-2 border-[#4A69B3] rounded-2xl flex gap-3 animate-fadeIn shadow-md">
          <input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Judul kasus (contoh: Teror Pinjol Abadi Dana)..."
            className="flex-1 bg-white border-2 border-[#4A69B3]/40 rounded-xl px-3.5 py-2 text-xs font-bold text-[#1E2C4F] focus:outline-none focus:border-[#BA3801]"
            required
          />
          <button
            type="submit"
            className="tactile-btn bg-[#BA3801] hover:bg-[#9A2E01] text-white px-5 py-2 rounded-xl text-xs font-mono font-bold"
          >
            Simpan Kasus
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#1E2C4F]/5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#4A69B3]/25 pb-3">
            <h2 className="font-bold text-lg text-[#1E2C4F]">Input Pesan Teror</h2>
            <span className="font-mono text-[11px] text-rose-950 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-300 font-bold">
              Enkripsi AES-256
            </span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#4A69B3] hover:border-[#BA3801] bg-white rounded-2xl p-4 text-center cursor-pointer transition-all"
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
            <ImageIcon className="w-6 h-6 text-[#BA3801] mx-auto mb-1.5" />
            {uploadedScreenshotName ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{uploadedScreenshotName}</span>
              </div>
            ) : (
              <p className="text-xs text-[#2E3E6E] font-medium">
                Lampirkan screenshot chat WhatsApp/SMS (opsional)
              </p>
            )}
          </div>

          <form onSubmit={handleAddEvidence} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                  Nomor Telepon Penagih
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-mono focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                  Jam Kirim (WIB)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={messageTimeHour}
                  onChange={(e) => setMessageTimeHour(e.target.value)}
                  placeholder="22"
                  className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                Teks Pesan Ancaman / Transkrip Chat
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                placeholder="Masukkan transkrip pesan atau kata-kata ancaman penagih..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageText.trim() || !effectiveActiveCaseId}
              className="tactile-btn w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengekstrak &amp; Menandai Pasal...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#FFEC89]" />
                  Tambahkan ke Lini Masa Bukti
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1E2C4F]">
                Lini Masa Bukti Kasus ({items.length})
              </h2>
              <span className="text-xs text-[#2E3E6E] font-medium">Urutan kronologis untuk pelaporan ke OJK / Kepolisian</span>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleCopyDossier}
                className="tactile-btn font-mono text-xs text-white bg-[#BA3801] hover:bg-[#9A2E01] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md font-bold"
              >
                {copiedDossier ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFEC89]" />
                    Berkas Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FFEC89]" />
                    Salin Berkas Kronologi
                  </>
                )}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#4A69B3] rounded-3xl p-12 text-center text-[#2E3E6E] shadow-sm">
              <ShieldAlert className="w-12 h-12 text-[#BA3801] mx-auto mb-3" />
              <h3 className="font-bold text-base text-[#1E2C4F]">Belum Ada Item Bukti</h3>
              <p className="text-xs max-w-sm mx-auto mt-1 text-[#2E3E6E] font-medium">
                Pilih salah satu preset skenario intimidasi di atas atau masukkan pesan chat untuk merekonstruksi kronologi.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {items.map((item, idx) => {
                const hour = item.message_timestamp_hour ?? 22;
                const isLateNight = hour < 8 || hour >= 20;

                return (
                  <div
                    key={idx}
                    className="bg-white border-2 border-[#4A69B3] rounded-2xl p-5 shadow-xs space-y-3 relative group animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white bg-[#BA3801] px-2.5 py-0.5 rounded-md">
                          Bukti #{idx + 1}
                        </span>
                        <span className="text-[#1E2C4F] font-bold">{item.sender_phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-bold ${
                            isLateNight
                              ? 'bg-rose-50 text-rose-950 border border-rose-300'
                              : 'bg-white text-[#1E2C4F] border border-[#4A69B3]'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {hour}:00 WIB {isLateNight && '(Di Luar Jam Resmi)'}
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

                    <blockquote className="border-l-4 border-[#BA3801] bg-[#FFEC89] p-3.5 rounded-r-xl text-xs sm:text-sm text-[#1E2C4F] italic leading-relaxed font-semibold">
                      "{item.message_text}"
                    </blockquote>

                    {item.violations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                          Pelanggaran Hukum Terkait:
                        </span>
                        {item.violations.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-rose-50 border-2 border-rose-300 text-rose-950 p-3 rounded-xl text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{v.violation_type}</span>
                              <span className="font-mono text-[10px] text-slate-700">{v.rule_code}</span>
                            </div>
                            <p className="font-mono text-[11px] text-[#1E2C4F] font-bold">Dasar: {v.statutory_article}</p>
                            <p className="text-[11px] text-slate-800 leading-relaxed font-medium">{v.legal_explanation}</p>
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
