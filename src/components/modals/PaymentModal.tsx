import { useState } from 'react';
import { TENDERS } from '../../data/constants';
import { fmt } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import type { Split } from '../../types';
import Modal from '../ui/Modal';

const TENDER_ICONS: Record<string, string> = {
  Cash: '💵', Card: '💳', InstaPay: '📱', Fawry: '🏪', 'Gift card': '🎁', Points: '⭐',
};

export default function PaymentModal({ orderNo }: { orderNo: number }) {
  const { state, dispatch } = useApp();
  const o = state.orders.find(x => x.no === orderNo);

  const [tender, setTender] = useState<string>('Cash');
  const [given, setGiven] = useState('');
  const [splits, setSplits] = useState<Split[]>([]);
  const [splitMode, setSplitMode] = useState(false);
  const [splitAmt, setSplitAmt] = useState('');
  const [gcCode, setGcCode] = useState('');

  if (!o || o.paid) return null;

  const due = o.total - splits.reduce((s, p) => s + p.amt, 0);
  const givenNum = +given || 0;
  const change = tender === 'Cash' && givenNum > due ? givenNum - due : 0;
  const customer = state.customers.find(c => c.id === o.custId);
  const ptsAvail = customer?.points ?? 0;

  const numpad = (k: string) => {
    if (k === 'C') setGiven('');
    else if (k === '⌫') setGiven(g => g.slice(0, -1));
    else if (k === 'Exact') setGiven(due.toFixed(2));
    else setGiven(g => g + k);
  };

  const finalize = (finalSplits: Split[]) =>
    dispatch({ type: 'PAY_ORDER', no: o.no, splits: finalSplits });

  const takePayment = () => {
    if (tender === 'Cash') {
      if (givenNum < due) {
        dispatch({ type: 'TOAST', msg: 'Cash received is less than the amount due' });
        return;
      }
      finalize([...splits, { tender: 'Cash', amt: due, given: givenNum }]);
      return;
    }
    if (tender === 'Gift card') {
      const g = state.giftCards.find(x => x.code === gcCode.trim().toUpperCase());
      if (!g || !g.balance) {
        dispatch({ type: 'TOAST', msg: 'Gift card not found or empty' });
        return;
      }
      const use = Math.min(g.balance, due);
      dispatch({ type: 'REDEEM_GIFT', code: g.code, amount: use });
      const next = [...splits, { tender: 'Gift card', amt: use }];
      if (due - use > 0.01) {
        setSplits(next); setTender('Cash'); setGiven('');
        dispatch({ type: 'TOAST', msg: `${fmt(use)} taken from gift card · ${fmt(due - use)} still due` });
      } else finalize(next);
      return;
    }
    if (tender === 'Points') {
      if (!customer) return;
      const pts = Math.min(customer.points, Math.floor(due * 10));
      dispatch({ type: 'REDEEM_POINTS', custId: customer.id, pts });
      const next = [...splits, { tender: 'Points', amt: pts / 10 }];
      if (due - pts / 10 > 0.01) {
        setSplits(next); setTender('Cash'); setGiven('');
        dispatch({ type: 'TOAST', msg: `${pts} points redeemed · ${fmt(due - pts / 10)} still due` });
      } else finalize(next);
      return;
    }
    finalize([...splits, { tender, amt: due }]);
  };

  const splitPay = () => {
    const v = parseFloat(splitAmt);
    if (!v || v <= 0 || v > due) return;
    setSplits(s => [...s, { tender, amt: v }]);
    setSplitMode(false); setSplitAmt(''); setGiven('');
    dispatch({ type: 'TOAST', msg: `${fmt(v)} taken by ${tender}` });
    if (due - v < 0.01) finalize([...splits, { tender, amt: v }]);
  };

  const exactKey = Math.ceil(due);
  const keys: (string | number)[] = [1, 2, 3, '⌫', 4, 5, 6, 'C', 7, 8, 9, '00', 0, '.', exactKey, 'Exact'];

  return (
    <Modal title={<>Pay · Order #{o.no}</>}>
      <div className="big">
        <small>Amount due{splits.length ? ` · ${splits.length} split${splits.length > 1 ? 's' : ''} taken` : ''}</small>
        {fmt(due)}
      </div>

      <div className="tenders">
        {TENDERS.map(t => (
          <button
            key={t}
            aria-pressed={tender === t}
            disabled={t === 'Points' && ptsAvail < 100}
            onClick={() => { setTender(t); setGiven(''); }}
          >
            {TENDER_ICONS[t]}
            <span>{t}</span>
            {t === 'Points' && <small style={{ fontSize: 10, opacity: .7 }}>{ptsAvail} pts</small>}
          </button>
        ))}
      </div>

      {tender === 'Cash' && <>
        <div className="big"><small>Cash received</small>{given || '0'}</div>
        <div className="numpad">
          {keys.map(k => (
            <button key={String(k)} className={k === 'Exact' || k === exactKey ? 'lime' : ''} onClick={() => numpad(String(k))}>{k}</button>
          ))}
        </div>
        {change > 0 && <div style={{ textAlign: 'right', fontSize: 14 }}>Change due: <b style={{ color: 'var(--lime)' }}>{fmt(change)}</b></div>}
      </>}

      {tender === 'Card' && (
        <div className="card" style={{ textAlign: 'center', fontSize: 13 }}>
          Terminal ready · tap, insert or swipe<br />
          <span style={{ color: 'var(--fg-2)', fontSize: 11 }}>Tali Pay terminal T-01 · Meeza / Visa / Mastercard / Apple Pay</span>
        </div>
      )}

      {['InstaPay', 'Fawry'].includes(tender) && (
        <div className="card" style={{ textAlign: 'center', fontSize: 13 }}>
          <div className="qr" />Ask the guest to scan · {tender} · {fmt(due)}
        </div>
      )}

      {tender === 'Gift card' && (
        <div className="form">
          <label className="full">Gift card code
            <input placeholder="GC-4471" value={gcCode} onChange={e => setGcCode(e.target.value)} />
          </label>
        </div>
      )}

      {tender === 'Points' && (
        <div className="card" style={{ fontSize: 13 }}>
          Redeem {Math.min(ptsAvail, Math.floor(due * 10))} points → {fmt(Math.min(ptsAvail, Math.floor(due * 10)) / 10)} off
        </div>
      )}

      {splitMode && (
        <div className="form">
          <label className="full">Amount to take now by {tender} (due {fmt(due)})
            <input type="number" value={splitAmt} onChange={e => setSplitAmt(e.target.value)} placeholder={(due / 2).toFixed(2)} autoFocus />
          </label>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {splitMode
          ? <button className="btn white" onClick={splitPay}>Take {fmt(parseFloat(splitAmt) || 0)}</button>
          : <button className="btn" onClick={() => setSplitMode(true)}>Split · pay part now</button>}
        <span className="spacer" />
        <button className="btn lime" style={{ padding: '12px 22px' }} onClick={takePayment}>
          {tender === 'Cash' ? 'Take cash' : 'Confirm payment'}
        </button>
      </div>
    </Modal>
  );
}
