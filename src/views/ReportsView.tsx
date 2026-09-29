import { reportRows } from '../lib/reports';
import { useApp } from '../store/AppContext';
import type { ReportTab } from '../types';
import Tabs from '../components/ui/Tabs';

const RTABS: { key: ReportTab; label: string }[] = [
  { key: 'sales', label: 'Sales' }, { key: 'products', label: 'Products' },
  { key: 'payments', label: 'Payments' }, { key: 'tax', label: 'Tax' },
  { key: 'staff', label: 'Staff & shifts' }, { key: 'voids', label: 'Discounts & voids' },
];

export default function ReportsView() {
  const { state, dispatch } = useApp();
  const rows = reportRows(state);
  const cols = rows[0].length;

  const exportCsv = () => {
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `tali-${state.rtab}-report.csv`;
    a.click();
    dispatch({ type: 'TOAST', msg: 'CSV downloaded' });
  };

  return (
    <section className="view active">
      <div className="head">
        <h2>Reports</h2>
        <Tabs white items={RTABS} selected={state.rtab} onSelect={k => dispatch({ type: 'SET_RTAB', rtab: k as ReportTab })} />
        <span className="spacer" />
        <button className="btn white" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="table">
        {rows.map((r, i) => (
          <div className="tr" key={i} style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
            {r.map((c, j) => (j === 0 && i ? <b key={j}>{c}</b> : <span key={j}>{c}</span>))}
          </div>
        ))}
      </div>
    </section>
  );
}
