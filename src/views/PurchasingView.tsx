import { SUPPLIERS } from '../data/constants';
import { fmt } from '../lib/format';
import { useApp } from '../store/AppContext';
import DataTable from '../components/ui/DataTable';

export default function PurchasingView() {
  const { state, dispatch } = useApp();

  return (
    <section className="view active">
      <div className="head">
        <h2>Purchasing</h2>
        <span className="spacer" />
        <button className="btn white" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'auto-po' } })}>New purchase order</button>
      </div>

      <DataTable
        cols="100px 150px 1.6fr 110px 150px 170px"
        head={['PO', 'Supplier', 'Lines', 'Total', 'Status', '']}
        rows={state.purchaseOrders.map((p, i) => [
          <b>{p.no}</b>,
          p.sup,
          <small style={{ color: 'var(--fg)' }}>{p.lines}</small>,
          <b>{fmt(p.total)}</b>,
          <span className={`badge ${p.status === 'Received' ? 'lime' : p.status === 'Sent' ? 'blue' : 'amber'}`}>{p.status}</span>,
          <span style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            {p.status === 'Awaiting approval' && <button className="btn sm lime" onClick={() => dispatch({ type: 'PO_STATUS', index: i, status: 'Sent' })}>Approve & send</button>}
            {p.status === 'Sent' && <button className="btn sm white" onClick={() => dispatch({ type: 'PO_STATUS', index: i, status: 'Received' })}>Receive</button>}
          </span>,
        ])}
      />

      <div className="two">
        <div className="card">
          <h3>Suppliers</h3>
          <div className="rows">
            {SUPPLIERS.map(s => <div key={s.name}><span>{s.name}</span><span className="r">{s.terms} · {s.phone}</span></div>)}
          </div>
        </div>
        <div className="card">
          <h3>Transfers & approvals</h3>
          <div className="rows">
            <div><span>TR-208 · Central kitchen → Maadi</span><span className="badge blue">In transit</span></div>
            <div><span>TR-207 · Maadi → Zamalek (bread 60 pc)</span><span className="badge lime">Received</span></div>
            <div><span>Waste adjustment ADJ-91</span><span className="badge amber">Needs approval</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
