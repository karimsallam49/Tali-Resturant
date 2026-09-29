import { cogs, linePrice } from './calc';
import { fmt } from './format';
import type { AppState } from '../store/reducer';

type Cell = string | number;

export function reportRows(s: AppState): Cell[][] {
  const paid = s.orders.filter(o => o.paid && !o.refunded);
  const all = s.orders.filter(o => o.status !== 'Cancelled');
  const tot = all.reduce((x, o) => x + o.total, 0);

  if (s.rtab === 'sales') {
    const byT: Record<string, { n: number; s: number; d: number }> = {};
    all.forEach(o => {
      byT[o.type] = byT[o.type] || { n: 0, s: 0, d: 0 };
      byT[o.type].n++; byT[o.type].s += o.total; byT[o.type].d += o.d;
    });
    return [
      ['Channel', 'Orders', 'Discounts', 'Net sales', 'Avg order'],
      ...Object.entries(byT).map(([k, v]) => [k, v.n, fmt(v.d), fmt(v.s), fmt(v.s / v.n)]),
      ['Total', all.length, fmt(all.reduce((x, o) => x + o.d, 0)), fmt(tot), fmt(tot / (all.length || 1))],
    ];
  }

  if (s.rtab === 'products') {
    const t: Record<number, { q: number; s: number }> = {};
    all.forEach(o => o.lines.forEach(l => {
      t[l.id] = t[l.id] || { q: 0, s: 0 };
      t[l.id].q += l.qty; t[l.id].s += linePrice(s.menu, l);
    }));
    return [
      ['Dish', 'Category', 'Qty sold', 'Revenue', 'Food cost', 'Margin'],
      ...Object.entries(t).sort((a, b) => b[1].s - a[1].s).map(([id, v]) => {
        const m = s.menu.find(x => x.id === +id)!;
        const c = cogs(s.menu, s.ingredients, [{ id: m.id, qty: v.q, note: '', mods: [] }]);
        return [m.name, m.cat, v.q, fmt(v.s), fmt(c), Math.round((v.s - c) / v.s * 100) + '%'];
      }),
    ];
  }

  if (s.rtab === 'payments') {
    const t: Record<string, { n: number; a: number }> = {};
    const ps = paid.reduce((x, o) => x + o.total, 0) || 1;
    paid.forEach(o => (o.splits || [{ tender: o.tender!, amt: o.total }]).forEach(sp => {
      t[sp.tender] = t[sp.tender] || { n: 0, a: 0 };
      t[sp.tender].n++; t[sp.tender].a += sp.amt;
    }));
    return [
      ['Tender', 'Transactions', 'Amount', 'Share', 'Settlement'],
      ...Object.entries(t).map(([k, v]) => [
        k, v.n, fmt(v.a), Math.round(v.a / ps * 100) + '%',
        k === 'Cash' ? 'In drawer' : k === 'Card' ? 'T+1 · Tali Pay' : k === 'Points' ? 'Loyalty liability' : k === 'Gift card' ? 'Prepaid' : 'T+1',
      ]),
    ];
  }

  if (s.rtab === 'tax') {
    const sub = paid.reduce((x, o) => x + o.sub - o.d, 0);
    const svc = paid.reduce((x, o) => x + o.svc, 0);
    const vat = paid.reduce((x, o) => x + o.vat, 0);
    return [
      ['Line', 'Amount', 'Note'],
      ['Net sales (ex VAT)', fmt(sub + svc), 'Includes service charge'],
      ['VAT 14% collected', fmt(vat), 'Payable to ETA'],
      ['E-receipts submitted', paid.length, 'ETA · 100% accepted'],
      ['Gross', fmt(sub + svc + vat), ''],
    ];
  }

  if (s.rtab === 'staff') {
    return [
      ['Staff', 'Role', 'Clocked in', 'Orders', 'Sales', 'Voids'],
      ['Mahmoud Fathy', 'Cashier', s.shift ? new Date(s.shift.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—', all.length, fmt(tot), s.orders.filter(o => o.status === 'Cancelled').length],
      ['Karim Adel', 'Kitchen', '08:30', s.orders.filter(o => o.status === 'Completed').length + ' bumped', '—', '0'],
      ['Noura Samir', 'Branch manager', '08:00', '—', '—', s.orders.filter(o => o.cancelReason).length + ' approved'],
    ];
  }

  if (s.rtab === 'voids') {
    return [
      ['Order', 'Type', 'Reason / label', 'Amount', 'By'],
      ...s.orders.filter(o => o.status === 'Cancelled' || o.d).map(o => [
        '#' + o.no,
        o.status === 'Cancelled' ? (o.refunded ? 'Refund' : 'Void') : 'Discount',
        o.cancelReason || o.discLabel || '—',
        fmt(o.status === 'Cancelled' ? o.total : o.d),
        'Mahmoud · approved by Noura',
      ]),
    ];
  }

  return [['No data']];
}
