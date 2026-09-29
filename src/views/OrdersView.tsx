import { ago, cls, fmt, isOpen } from '../lib/format';
import { useApp } from '../store/AppContext';
import type { OrderFilter } from '../types';
import DataTable from '../components/ui/DataTable';
import Tabs from '../components/ui/Tabs';

const FILTERS: { key: OrderFilter; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'open', label: 'Open' }, { key: 'unpaid', label: 'Unpaid' },
  { key: 'done', label: 'Completed' }, { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersView() {
  const { state, dispatch } = useApp();
  const { orders, ofilter } = state;

  let list = [...orders].sort((a, b) => b.time - a.time);
  if (ofilter === 'open') list = list.filter(isOpen);
  if (ofilter === 'unpaid') list = list.filter(o => !o.paid && o.status !== 'Cancelled');
  if (ofilter === 'done') list = list.filter(o => o.status === 'Completed');
  if (ofilter === 'cancelled') list = list.filter(o => o.status === 'Cancelled');

  return (
    <section className="view active">
      <div className="head">
        <h2>Orders</h2>
        <Tabs white items={FILTERS} selected={ofilter} onSelect={k => dispatch({ type: 'SET_OFILTER', ofilter: k as OrderFilter })} />
        <span className="spacer" />
        <span className="btn">Tap a status to move it forward</span>
      </div>

      <DataTable
        cols="100px 1.4fr 90px 60px 100px 130px 90px 150px"
        head={['Order', 'Customer', 'Type', 'Items', 'Total', 'Status', 'Payment', '']}
        empty="No orders match this filter."
        rows={list.map(o => [
          <b>#{o.no}</b>,
          <>{o.customer}<small>{ago(o.time)}{o.table ? ' · ' + o.table : ''}{o.cancelReason ? ' · ' + o.cancelReason : ''}</small></>,
          o.type,
          o.lines.reduce((s, l) => s + l.qty, 0),
          <b>{fmt(o.total)}</b>,
          <button className={`badge ${cls(o.status)}`} onClick={() => dispatch({ type: 'ADVANCE', no: o.no })}>{o.status}</button>,
          o.refunded ? <span className="badge red">Refunded</span>
            : o.paid ? <span className="badge lime">{o.tender}</span>
            : <span className="badge amber">Unpaid</span>,
          <span style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            {!o.paid && o.status !== 'Cancelled' && <>
              <button className="btn sm white" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'pay', orderNo: o.no } })}>Pay</button>
              <button className="btn sm" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'cancel-order', orderNo: o.no })}>Cancel</button>
            </>}
            {o.paid && !o.refunded && <>
              <button className="btn sm" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'receipt', orderNo: o.no } })}>Receipt</button>
              <button className="btn sm" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'refund', orderNo: o.no })}>Refund</button>
            </>}
          </span>,
        ])}
      />
    </section>
  );
}
