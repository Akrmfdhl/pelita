import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Send, FileCheck, Copy } from 'lucide-react';

interface ChatResponse {
  reply: string;
  suggested_channel: string;
  relevant_articles: string[];
}

export const AssistantChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; articles?: string[] }>>([
    {
      sender: 'assistant',
      text: 'Halo, saya Asisten Advokasi Pelita. Ceritakan intimidasi atau masalah pinjaman yang sedang Anda hadapi, dan saya akan memetakan dasar hukum serta menyusun draf aduan resminya.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await apiRequest<ChatResponse>('/reporting/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userText }),
      });
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: res.reply, articles: res.relevant_articles },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif font-bold text-3xl text-ink-primary">Asisten Pelaporan & Konsultasi Regulasi</h1>
        <p className="text-ink-muted text-sm mt-1">
          Dapatkan panduan hukum berbasis regulasi resmi OJK, AFPI, dan UU PDP serta draf surat aduan formal siap-salin.
        </p>
      </div>

      <div className="bg-canvas-surface border border-canvas-border rounded-lg shadow-sm flex flex-col h-[520px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl rounded-lg p-4 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-ink-navy text-canvas-paper rounded-br-none'
                    : 'bg-canvas-subtle border border-canvas-border text-ink-primary rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                {m.articles && m.articles.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-canvas-border space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                      Rujukan Regulasi Terkait:
                    </span>
                    {m.articles.map((art, idx) => (
                      <span key={idx} className="font-mono text-xs text-stamp-teal block">
                        • {art}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs font-mono text-ink-muted animate-pulse">
              Asisten Pelita sedang menganalisis dasar pasal...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-canvas-border bg-canvas-subtle flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pertanyaan atau situasi intimidasi yang Anda alami..."
            className="flex-1 bg-canvas-surface border border-canvas-border rounded px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-ink-navy"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-ink-navy hover:bg-opacity-95 text-canvas-paper px-5 py-2.5 rounded text-sm font-medium transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </form>
      </div>

      <div className="bg-stamp-teal-bg border border-stamp-teal p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-stamp-teal shrink-0" />
          <div>
            <span className="font-semibold text-sm text-ink-primary block">Buat Draf Surat Aduan Formal OJK / AFPI / Polri</span>
            <span className="text-xs text-ink-muted">Format standar siap-salin dengan rujukan pasal dan bukti kronologi otomatis.</span>
          </div>
        </div>
        <button
          onClick={async () => {
            const res = await apiRequest<{ generated_letter_body: string }>('/reporting/drafts', {
              method: 'POST',
              body: JSON.stringify({
                case_id: 'case-demo-1',
                channel_code: 'ojk',
                victim_name: 'Budi Santoso',
                victim_nik: '3201234567890001',
                victim_phone: '081234567890',
              }),
            });
            navigator.clipboard.writeText(res.generated_letter_body);
            alert('Draf surat aduan formal berhasil disalin ke clipboard!');
          }}
          className="font-mono text-xs bg-stamp-teal text-canvas-paper px-3.5 py-2 rounded flex items-center gap-1.5 hover:bg-opacity-95"
        >
          <Copy className="w-3.5 h-3.5" />
          Salin Draf Surat
        </button>
      </div>
    </div>
  );
};
