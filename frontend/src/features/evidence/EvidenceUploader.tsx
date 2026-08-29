import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { EvidenceItem } from '../../types';
import {
  ShieldAlert,
  Plus,
  Clock,
  Trash2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const EvidenceUploader: React.FC = () => {
  const [senderPhone, setSenderPhone] = useState('+6289512345678');
  const [messageTimeHour, setMessageTimeHour] = useState('22');
  const [messageText, setMessageText] = useState(
    'Segera bayar sebelum jam 12 siang atau foto KTP dan kontak Anda akan kami sebar ke seluruh grup WA teman kerja!'
  );
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);

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
        'Dasar maling tidak tahu diri! Kami akan buat Anda dipecat dari kantor hari ini juga kalau tidak transfer sekarang!'
      );
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setLoading(true);
    try {
      const res = await apiRequest<EvidenceItem>('/evidence/cases/case-demo-1/items', {
        method: 'POST',
        body: JSON.stringify({
          file_url: 'https://storage.pelita.id/evidence/chat_screenshot_01.png',
          media_type: 'image/png',
          message_timestamp_hour: parseInt(messageTimeHour, 10),
          sender_phone: senderPhone,
          message_text: messageText,
          threat_category: 'contact_dox_threat',
        }),
      });
      setItems([{ ...res, message_timestamp_hour: parseInt(messageTimeHour, 10) }, ...items]);
      setMessageText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const generateDossierText = () => {
    let dossier = `BERKAS BUKTI KRONOLOGIS INTIMIDASI PINJAMAN ONLINE\nDisusun otomatis via Pelita Integrity Platform\n\n`;
    items.forEach((item, idx) => {
      dossier += `--- BUKTI #${idx + 1} ---\n`;
      dossier += `Pengirim: ${item.sender_phone}\n`;
      dossier += `Waktu Kirim: Pukul ${item.message_timestamp_hour || 22}:00 WIB\n`;
      dossier += `Pesan Intimidasi: "${item.message_text}"\n`;
      dossier += `Pelanggaran Teridentifikasi:\n`;
      item.violations.forEach((v) => {
        dossier += `  - [${v.rule_code}] ${v.violation_type} (${v.statutory_article})\n`;
      });
      dossier += `\n`;
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
      <div className="border-b border-canvas-border pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-stamp-red" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stamp-red">
              Modul Advokasi Kuratif
            </span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-ink-primary">Penyusun Bukti &amp; Rekonstruksi Kronologi</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Ekstrak bukti teror dari tangkapan layar WhatsApp/SMS debt collector, tandai pelanggaran hukum secara otomatis
            (UU PDP &amp; POJK 22/2023), dan susun berkas laporan resmi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('dox')}
            className="tactile-btn text-xs font-mono px-3 py-1.5 rounded bg-stamp-red-bg text-stamp-red border border-stamp-red flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Preset: Ancaman Sebar KTP
          </button>
          <button
            type="button"
            onClick={() => applyPreset('night')}
            className="tactile-btn text-xs font-mono px-3 py-1.5 rounded bg-stamp-amber-bg text-stamp-amber border border-stamp-amber flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Preset: Teror Jam 23:00
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-canvas-surface border border-canvas-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <h2 className="font-serif font-bold text-lg text-ink-primary">Input Pesan Teror</h2>
            <span className="font-mono text-[11px] text-stamp-red bg-stamp-red-bg px-2 py-0.5 rounded border border-stamp-red">
              Enkripsi AES-256
            </span>
          </div>

          <form onSubmit={handleAddEvidence} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Nomor Telepon Penagih
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-mono focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Jam Kirim (WIB)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={messageTimeHour}
                  onChange={(e) => setMessageTimeHour(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-mono text-center focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                Teks Pesan Ancaman / Transkrip Chat
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                placeholder="Masukkan transkrip pesan atau kata-kata ancaman penagih..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageText.trim()}
              className="tactile-btn w-full bg-ink-navy hover:bg-opacity-95 text-canvas-paper py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-4 h-4 border-2 border-canvas-paper border-t-transparent rounded-full animate-spin" />
                  Mengekstrak &amp; Menandai Pasal...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-stamp-teal" />
                  Tambahkan ke Lini Masa Bukti
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-ink-primary">
                Lini Masa Bukti Kasus ({items.length})
              </h2>
              <span className="text-xs text-ink-muted">Urutan kronologis untuk pelaporan ke OJK / Kepolisian</span>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleCopyDossier}
                className="tactile-btn font-mono text-xs text-canvas-paper bg-stamp-teal hover:bg-opacity-95 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                {copiedDossier ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Berkas Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Berkas Kronologi
                  </>
                )}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-canvas-surface border-2 border-dashed border-canvas-border rounded-xl p-12 text-center text-ink-muted shadow-sm">
              <ShieldAlert className="w-12 h-12 text-ink-muted/40 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-base text-ink-primary">Belum Ada Item Bukti</h3>
              <p className="text-sm max-w-sm mx-auto mt-1">
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
                    className="bg-canvas-surface border border-canvas-border rounded-xl p-5 shadow-sm space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink-navy bg-canvas-subtle px-2 py-0.5 rounded border border-canvas-border">
                          Bukti #{idx + 1}
                        </span>
                        <span className="text-ink-muted">{item.sender_phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                            isLateNight
                              ? 'bg-stamp-red-bg text-stamp-red border border-stamp-red font-semibold'
                              : 'bg-canvas-subtle text-ink-muted border border-canvas-border'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {hour}:00 WIB {isLateNight && '(Di Luar Jam Resmi)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-ink-muted hover:text-stamp-red transition-colors p-1"
                          title="Hapus bukti"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <blockquote className="border-l-4 border-stamp-amber bg-canvas-subtle p-3.5 rounded-r-lg text-sm text-ink-primary italic leading-relaxed">
                      "{item.message_text}"
                    </blockquote>

                    {item.violations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stamp-red block">
                          Pelanggaran Hukum Terkait:
                        </span>
                        {item.violations.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-stamp-red-bg/50 border border-stamp-red/40 text-stamp-red p-2.5 rounded-md text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>{v.violation_type}</span>
                              <span className="font-mono text-[10px]">{v.rule_code}</span>
                            </div>
                            <p className="font-mono text-[11px] text-ink-primary font-medium">{v.statutory_article}</p>
                            <p className="text-[11px] text-ink-muted">{v.legal_explanation}</p>
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
