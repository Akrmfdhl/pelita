import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Scale, FileText } from 'lucide-react';

interface LegalMarkdownViewerProps {
  content: string;
}

function sanitizeText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/—/g, ' - ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export const LegalMarkdownViewer: React.FC<LegalMarkdownViewerProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const cleaned = sanitizeText(content);
  const lines = cleaned.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('|')) {
      const tableRawLines: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('|') ||
          (tableRawLines.length > 0 &&
            lines[i].trim() !== '' &&
            !lines[i].trim().startsWith('#') &&
            !lines[i].trim().startsWith('>')))
      ) {
        const cur = lines[i].trim();
        if (cur.startsWith('|')) {
          tableRawLines.push(cur);
        } else if (tableRawLines.length > 0) {
          tableRawLines[tableRawLines.length - 1] += ' ' + cur;
        }
        i++;
      }

      if (tableRawLines.length >= 2) {
        const parseRow = (rowStr: string) => {
          let s = rowStr;
          if (s.startsWith('|')) s = s.slice(1);
          if (s.endsWith('|')) s = s.slice(0, -1);
          return s.split('|').map((cell) => cell.trim());
        };

        const headers = parseRow(tableRawLines[0]);
        const isDivider = (s: string) => /^[-:| ]+$/.test(s);
        const dataStartIndex = isDivider(tableRawLines[1].replace(/\|/g, '')) ? 2 : 1;
        const rows = tableRawLines.slice(dataStartIndex).map(parseRow);

        elements.push(
          <div
            key={`table-${i}`}
            className="my-4 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs no-scrollbar"
          >
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[#1E2C4F] font-semibold">
                  {headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-700 font-semibold"
                    >
                      {formatInlineText(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                {rows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                    {r.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 align-top leading-relaxed text-[12px] break-words">
                        {formatInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      const blockIndex = i;

      while (
        i < lines.length &&
        (lines[i].trim().startsWith('>') ||
          (quoteLines.length > 0 &&
            lines[i].trim() !== '' &&
            !lines[i].trim().startsWith('#') &&
            !lines[i].trim().startsWith('|')))
      ) {
        const cur = lines[i].trim().replace(/^>\s*/, '');
        if (cur || quoteLines.length > 0) {
          quoteLines.push(cur);
        }
        i++;
      }

      const fullQuoteText = quoteLines.join('\n').trim();

      if (fullQuoteText) {
        elements.push(
          <div
            key={`quote-${blockIndex}`}
            className="my-4 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2 font-semibold font-mono text-[11px] text-[#BA3801]">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Draf Pesan Tanggapan Hukum Resmi</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(fullQuoteText, blockIndex)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-semibold text-[#BA3801] flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs shrink-0"
              >
                {copiedIndex === blockIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Draf Lengkap</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-[11px] sm:text-xs leading-relaxed text-slate-900 bg-white p-4 rounded-xl border border-amber-200 whitespace-pre-wrap select-all shadow-2xs">
              {formatInlineText(fullQuoteText)}
            </div>
          </div>
        );
      }
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '');
      elements.push(
        <div key={`h3-${i}`} className="mt-4 mb-2 flex items-center gap-2 text-[#1E2C4F]">
          <Scale className="w-4 h-4 text-[#BA3801] shrink-0" />
          <h4 className="font-semibold text-sm tracking-tight text-[#1E2C4F]">
            {formatInlineText(headingText)}
          </h4>
        </div>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '');
      elements.push(
        <div
          key={`h2-${i}`}
          className="mt-6 mb-3 pb-2 border-b border-slate-200 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#BA3801] shrink-0" />
            <h3 className="font-semibold text-sm sm:text-[15px] text-[#1E2C4F] tracking-tight">
              {formatInlineText(headingText)}
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold shrink-0 border border-slate-200">
            Kajian Yuridis
          </span>
        </div>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#\s+/, '');
      elements.push(
        <div key={`h1-${i}`} className="mt-2 mb-4 pb-2 border-b border-slate-300">
          <h2 className="font-bold text-base text-[#1E2C4F] tracking-tight">
            {formatInlineText(headingText)}
          </h2>
        </div>
      );
      i++;
      continue;
    }

    if (/^(\d+\.|\*|-)\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+\.|\*|-)\s+(.*)$/);
      const marker = match ? match[1] : '-';
      const itemContent = match ? match[2] : trimmed;

      elements.push(
        <div key={`list-${i}`} className="flex items-start gap-2.5 my-1.5 text-[13px] leading-relaxed text-[#1E2C4F]">
          <span className="font-mono text-[11px] font-semibold text-[#BA3801] shrink-0 mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {marker.replace(/[.*]/g, '')}
          </span>
          <div className="flex-1 font-normal break-words">{formatInlineText(itemContent)}</div>
        </div>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      elements.push(<hr key={`hr-${i}`} className="my-4 border-slate-200" />);
      i++;
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="my-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#1E2C4F] font-normal break-words">
        {formatInlineText(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="w-full space-y-1 text-[#1E2C4F]">{elements}</div>;
};

function formatInlineText(text: string): React.ReactNode {
  let cleaned = text.replace(/[*_]{3,}/g, '');
  const parts: React.ReactNode[] = [];
  let keyIdx = 0;

  while (cleaned.length > 0) {
    const boldMatch = cleaned.match(/\*\*(.+?)\*\*|__(.+?)__/);
    const italicMatch = cleaned.match(/\*(.+?)\*|_(.+?)_/);
    const codeMatch = cleaned.match(/`(.+?)`/);

    const boldIdx = boldMatch && boldMatch.index !== undefined ? boldMatch.index : -1;
    const italicIdx = italicMatch && italicMatch.index !== undefined ? italicMatch.index : -1;
    const codeIdx = codeMatch && codeMatch.index !== undefined ? codeMatch.index : -1;

    let targetType: 'bold' | 'italic' | 'code' | null = null;
    let targetIdx = -1;

    const indices: { type: 'bold' | 'italic' | 'code'; idx: number }[] = [];
    if (boldIdx !== -1) indices.push({ type: 'bold', idx: boldIdx });
    if (codeIdx !== -1) indices.push({ type: 'code', idx: codeIdx });
    if (italicIdx !== -1 && (boldIdx === -1 || italicIdx < boldIdx)) {
      indices.push({ type: 'italic', idx: italicIdx });
    }

    if (indices.length === 0) {
      const remainingClean = cleaned.replace(/[*_`]/g, '');
      parts.push(remainingClean);
      break;
    }

    indices.sort((a, b) => a.idx - b.idx);
    targetType = indices[0].type;
    targetIdx = indices[0].idx;

    if (targetIdx > 0) {
      parts.push(cleaned.substring(0, targetIdx).replace(/[*_`]/g, ''));
    }

    if (targetType === 'bold' && boldMatch) {
      const boldContent = boldMatch[1] || boldMatch[2] || '';
      parts.push(
        <strong key={keyIdx++} className="font-semibold text-[#1E2C4F]">
          {boldContent.replace(/[*_`]/g, '')}
        </strong>
      );
      cleaned = cleaned.substring(targetIdx + boldMatch[0].length);
    } else if (targetType === 'italic' && italicMatch) {
      const italicContent = italicMatch[1] || italicMatch[2] || '';
      parts.push(
        <em key={keyIdx++} className="italic font-normal text-slate-800">
          {italicContent.replace(/[*_`]/g, '')}
        </em>
      );
      cleaned = cleaned.substring(targetIdx + italicMatch[0].length);
    } else if (targetType === 'code' && codeMatch) {
      parts.push(
        <code
          key={keyIdx++}
          className="font-mono text-[11px] bg-slate-100 text-[#BA3801] px-1.5 py-0.5 rounded border border-slate-200 font-semibold"
        >
          {codeMatch[1]}
        </code>
      );
      cleaned = cleaned.substring(targetIdx + codeMatch[0].length);
    }
  }

  return <>{parts}</>;
}
