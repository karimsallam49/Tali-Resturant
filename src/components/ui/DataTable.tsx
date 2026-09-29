import type { ReactNode } from 'react';

/** Grid-based table matching the original .table/.tr markup. */
export default function DataTable({ cols, head, rows, empty }: {
  cols: string;
  head: ReactNode[];
  rows: ReactNode[][];
  empty?: string;
}) {
  return (
    <div className="table">
      <div className="tr" style={{ gridTemplateColumns: cols }}>
        {head.map((h, i) => <span key={i} data-label={h}>{h}</span>)}
      </div>
      {rows.length
        ? rows.map((r, i) => (
            <div className="tr" key={i} style={{ gridTemplateColumns: cols }}>
              {r.map((c, j) => <span key={j} data-label={String(head[j] || '')}>{c}</span>)}
            </div>
          ))
        : <div className="tr" style={{ gridTemplateColumns: '1fr' }}><span>{empty || 'No rows.'}</span></div>}
    </div>
  );
}
