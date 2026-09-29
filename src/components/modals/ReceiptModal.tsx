import { linePrice } from '../../lib/calc';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function ReceiptModal({ orderNo }: { orderNo: number }) {
  const { state, dispatch } = useApp();
  const o = state.orders.find(x => x.no === orderNo);
  if (!o) return null;

  const cash = (o.splits || []).find(s => s.tender === 'Cash');
  const change = cash && cash.given && cash.given > cash.amt ? cash.given - cash.amt : 0;

  return (
    <Modal title="Paid ✓">
      <div className="receipt">
        <div className="c"><b>TALI · Maadi</b><br />12 Road 9, Maadi, Cairo<br />Tax ID 100-234-567 · ETA e-receipt</div>
        <hr />
        <div className="r"><span>Order #{o.no}</span><span>{o.paidAt ? new Date(o.paidAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}</span></div>
        <div className="r"><span>{o.type}{o.table ? ' · ' + o.table : ''}</span><span>{o.customer}</span></div>
        <hr />
        {o.lines.map((l, i) => {
          const m = state.menu.find(x => x.id === l.id);
          if (!m) return null;
          return (
            <div className="r" key={i}>
              <span>{l.qty} × {m.name}{l.mods.length ? ' (' + l.mods.join(', ') + ')' : ''}</span>
              <span>{linePrice(state.menu, l).toFixed(2)}</span>
            </div>
          );
        })}
        <hr />
        <div className="r"><span>Subtotal</span><span>{o.sub.toFixed(2)}</span></div>
        {!!o.d && <div className="r"><span>Discount</span><span>-{o.d.toFixed(2)}</span></div>}
        {!!o.svc && <div className="r"><span>Service 12%</span><span>{o.svc.toFixed(2)}</span></div>}
        <div className="r"><span>VAT 14%</span><span>{o.vat.toFixed(2)}</span></div>
        <div className="r"><b>TOTAL</b><b>EGP {o.total.toFixed(2)}</b></div>
        <hr />
        {(o.splits || []).map((s, i) => <div className="r" key={i}><span>{s.tender}</span><span>{s.amt.toFixed(2)}</span></div>)}
        {!!change && <div className="r"><span>Change</span><span>{change.toFixed(2)}</span></div>}
        <div className="qr" />
        <div className="c">ETA UUID 9F3A-…-{o.no}<br />Thank you · شكراً</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={() => dispatch({ type: 'TOAST', msg: 'Sent to printer P-01' })}>Print</button>
        <button className="btn" onClick={() => dispatch({ type: 'TOAST', msg: 'Receipt sent by WhatsApp' })}>WhatsApp</button>
        <span className="spacer" />
        <button className="btn lime" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Done</button>
      </div>
    </Modal>
  );
}
