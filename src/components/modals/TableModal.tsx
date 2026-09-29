import { linePrice } from '../../lib/calc';
import { fmt, num } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { tableState } from '../../views/TablesView';
import Modal from '../ui/Modal';

export default function TableModal({ table }: { table: number }) {
  const { state, dispatch } = useApp();
  const [, , o] = tableState(state.orders, table);
  if (!o) return null;

  return (
    <Modal title={<>Table {table} · #{o.no}</>}>
      <div className="rows">
        {o.lines.map((l, i) => {
          const m = state.menu.find(x => x.id === l.id);
          return m ? <div key={i}><span>{l.qty} × {m.name}</span><span className="r">{fmt(linePrice(state.menu, l))}</span></div> : null;
        })}
        <div><b>Total</b><b>{fmt(o.total)}</b></div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => dispatch({ type: 'REQUEST_BILL', no: o.no })}>Print bill</button>
        <button className="btn" onClick={() => dispatch({ type: 'TOAST', msg: `QR pay link sent to table ${table}` })}>Pay at table QR</button>
        <button className="btn purple" onClick={() => { dispatch({ type: 'CLOSE_MODAL' }); dispatch({ type: 'ADVANCE', no: o.no }); }}>Advance status</button>
        <span className="spacer" />
        {o.paid
          ? <span className="badge lime">Paid</span>
          : <button className="btn lime" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'pay', orderNo: o.no } })}>Pay {num(o.total)}</button>}
      </div>
    </Modal>
  );
}
