import { ago, fmt, num } from '../lib/format';
import { useApp } from '../store/AppContext';
import DataTable from '../components/ui/DataTable';
import KpiCard from '../components/ui/KpiCard';

export default function CustomersView() {
  const { state, dispatch } = useApp();
  const { customers, giftCards, orders } = state;

  const members = customers.filter(c => c.points > 0).length;
  const points = customers.reduce((s, c) => s + c.points, 0);
  const gift = giftCards.reduce((s, g) => s + g.balance, 0);
  const sorted = [...customers].sort((a, b) => b.spend - a.spend);

  return (
    <section className="view active">
      <div className="kpis">
        <KpiCard tone="lime" title="Customers" value={customers.length} label="Profiles" />
        <KpiCard tone="white" title="Loyalty members" value={members} label="Earning points" />
        <KpiCard title="Points liability" value={num(points)} label="Outstanding points" />
        <KpiCard title="Gift card balance" value={num(gift)} label="EGP outstanding" />
      </div>

      <div className="head">
        <h2>Customers</h2>
        <span className="spacer" />
        <button className="btn" onClick={() => dispatch({ type: 'TOAST', msg: 'Campaign scheduled to 3 segments via WhatsApp' })}>Send campaign</button>
        <button className="btn white" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'customer' })}>Add customer</button>
      </div>

      <DataTable
        cols="1.4fr 140px 80px 120px 90px 90px 120px"
        head={['Customer', 'Phone', 'Visits', 'Lifetime spend', 'Points', 'Tier', '']}
        rows={sorted.map(c => {
          const cos = orders.filter(o => o.custId === c.id);
          return [
            <b>{c.name}<small>Last order {cos.length ? ago(Math.max(...cos.map(o => o.time))) : '—'}</small></b>,
            c.phone,
            c.visits,
            <b>{fmt(c.spend)}</b>,
            c.points,
            <span className={`badge ${c.tier === 'Black' ? 'done' : c.tier === 'Gold' ? 'amber' : ''}`}>{c.tier}</span>,
            <button className="btn sm" onClick={() => dispatch({ type: 'NEW_ORDER_FOR', custId: c.id })}>New order</button>,
          ];
        })}
      />

      <div className="card">
        <h3>Loyalty programme <span className="badge lime">Active</span></h3>
        <div className="rows">
          <div><span>Earn</span><span className="r">1 point per EGP 10 spent</span></div>
          <div><span>Redeem</span><span className="r">100 points = EGP 10 off</span></div>
          <div><span>Tiers</span><span className="r">Silver 0 · Gold 500 · Black 1,500 points</span></div>
        </div>
      </div>
    </section>
  );
}
