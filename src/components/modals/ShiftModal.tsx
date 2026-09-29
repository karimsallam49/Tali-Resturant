import { useState } from 'react';
import { USERS } from '../../data/constants';
import { fmt } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function ShiftModal({ mode }: { mode: 'shift-open' | 'shift-close' }) {
  const { state, dispatch } = useApp();
  const [user, setUser] = useState('Mahmoud Fathy');
  const [floatVal, setFloatVal] = useState('500');
  const [counted, setCounted] = useState('');

  if (mode === 'shift-open') {
    return (
      <Modal title="Open shift">
        <div className="form">
          <label>
            Cashier
            <select value={user} onChange={e => setUser(e.target.value)}>
              {USERS.filter(u => u.role === 'Cashier' || u.role === 'Branch manager').map(u => (
                <option key={u.name}>{u.name}</option>
              ))}
            </select>
          </label>
          <label>
            Opening float (EGP)
            <input type="number" value={floatVal} onChange={e => setFloatVal(e.target.value)} />
          </label>
        </div>
        <button
          className="btn lime" style={{ justifyContent: 'center', padding: 14 }}
          onClick={() => dispatch({ type: 'OPEN_SHIFT', user, float: +floatVal || 0 })}
        >
          Open shift
        </button>
      </Modal>
    );
  }

  const shift = state.shift!;
  const cashSales = state.orders
    .filter(o => o.paid && !o.refunded && (o.paidAt ?? 0) >= shift.start)
    .reduce((s, o) => s + (o.splits || []).filter(p => p.tender === 'Cash').reduce((a, p) => a + p.amt, 0), 0);
  const expected = shift.float + cashSales;

  return (
    <Modal title="Close shift">
      <div className="rows">
        <div><span>Cashier</span><span className="r">{shift.user}</span></div>
        <div><span>Opened</span><span className="r">{new Date(shift.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span></div>
        <div><span>Opening float</span><span className="r">{fmt(shift.float)}</span></div>
        <div><span>Cash sales this shift</span><span className="r">{fmt(cashSales)}</span></div>
        <div><b>Expected in drawer</b><b>{fmt(expected)}</b></div>
      </div>
      <div className="form">
        <label className="full">
          Counted cash (blind count)
          <input type="number" placeholder="0.00" value={counted} onChange={e => setCounted(e.target.value)} />
        </label>
      </div>
      <button
        className="btn lime" style={{ justifyContent: 'center', padding: 14 }}
        onClick={() => dispatch({ type: 'CLOSE_SHIFT', counted: +counted || 0 })}
      >
        Close & print Z report
      </button>
    </Modal>
  );
}
