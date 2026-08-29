import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { EvidenceItem } from '../../types';
import { ShieldAlert, Plus, FileSpreadsheet } from 'lucide-react';

export const EvidenceUploader: React.FC = () => {
  const [senderPhone, setSenderPhone] = useState('+6289512345678');
  const [messageText, setMessageText] = useState('Segera bayar sebelum jam 12 siang atau foto KTP dan kontak Anda akan kami sebar ke seluruh grup WA teman kerja!');
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest<EvidenceItem>('/evidence/cases/case-demo-1/items', {
        method: 'POST',
        body: JSON.stringify({
          file_url: 'https://storage.pelita.id/evidence/chat_screenshot_01.png',
          media_type: 'image/png',
          message_timestamp_hour: 22,
          sender_phone: senderPhone,
          message_text: messageText,
          threat_category: 'contact_dox_threat',
        }),
      });
      setItems([res, ...items]);
      setMessageText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-bold text-3xl text-ink-primary">Penyusun Bukti & Rekonstruksi Kronologi</h1>
        <p className="text-ink-muted text-sm mt-1">
          Ekstrak bukti teror penagihan kasar dari tangkapan layar chat, tandai pelanggaran hukum secara otomatis, dan susun berkas PDF aduan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-canvas-surface border border-canvas-border rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-ink-primary mb-4">Tambah Bukti Intimidasi</h2>
          <form onSubmit={handleAddEvidence} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Nomor Telepon / Identitas Penagih
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Teks Pesan Ancaman / Transkrip Chat
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !messageText}
              className="w-full bg-ink-navy hover:bg-opacity-95 text-canvas-paper py-2.5 rounded font-medium text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Mengevaluasi Bukti...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambahkan ke Lini Masa Bukti
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-ink-primary">Lini Masa Bukti Kasus ({items.length})</h2>
            {items.length > 0 && (
              <button className="font-mono text-xs text-canvas-paper bg-stamp-teal hover:bg-opacity-95 px-3 py-1.5 rounded flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Ekspor PDF Kronologis
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-canvas-surface border border-dashed border-canvas-border rounded-lg p-12 text-center text-ink-muted">
              <ShieldAlert className="w-10 h-10 text-canvas-border mx-auto mb-2" />
              <p className="text-sm">Belum ada item bukti. Masukkan teks atau unggah screenshot chat teror untuk merekonstruksi kronologi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="bg-canvas-surface border border-canvas-border rounded-lg p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
                    <span>Pengirim: {item.sender_phone}</span>
                    <span>Waktu: 22:00 WIB (Di luar jam resmi)</span>
                  </div>
                  <blockquote className="border-l-2 border-ink-muted pl-3 text-sm text-ink-primary italic bg-canvas-subtle p-2 rounded-r">
                    "{item.message_text}"
                  </blockquote>
                  {item.violations.map((v, vIdx) => (
                    <div key={vIdx} className="bg-stamp-red-bg border border-stamp-red text-stamp-red px-3 py-2 rounded text-xs">
                      <span className="font-semibold block">{v.violation_type}</span>
                      <span className="font-mono text-[11px] block mt-0.5">{v.statutory_article}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
