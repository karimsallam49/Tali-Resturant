import { cogs } from '../lib/calc';
import { fmt, isOpen, mins, num } from '../lib/format';
import { useApp } from '../store/AppContext';
import KpiCard from '../components/ui/KpiCard';

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const HOUR_SEED = [8, 14, 22, 60, 90, 70, 40, 30, 35, 55, 95, 100, 80, 45];
const TENDER_COLORS: Record<string, string> = {
  Cash: 'var(--lime)', Card: 'var(--purple)', InstaPay: 'var(--blue)',
  Fawry: 'var(--amber)', 'Gift card': 'var(--white)', Points: 'var(--red)',
};

export default function DashboardView() {
  const { state } = useApp();
  const { orders, menu, ingredients, purchaseOrders, shift } = state;

  const paid = orders.filter(o => o.paid && !o.refunded);
  const sales = paid.reduce((s, o) => s + o.total, 0);
  const netSub = paid.reduce((s, o) => s + o.sub - o.d, 0);
  const foodCost = netSub ? Math.round(paid.reduce((s, o) => s + cogs(menu, ingredients, o.lines), 0) / netSub * 100) : 0;

  const mix: Record<string, number> = {};
  paid.forEach(o => (o.splits || [{ tender: o.tender!, amt: o.total }]).forEach(sp => {
    mix[sp.tender] = (mix[sp.tender] || 0) + sp.amt;
  }));
  const mixTotal = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const gradient = Object.entries(mix).map(([k, v]) => {
    const a0 = acc / mixTotal * 360, a1 = (acc + v) / mixTotal * 360;
    acc += v;
    return `${TENDER_COLORS[k] || '#888'} ${a0}deg ${a1}deg`;
  }).join(',');

  const tally: Record<number, number> = {};
  orders.filter(o => o.status !== 'Cancelled').forEach(o => o.lines.forEach(l => {
    tally[l.id] = (tally[l.id] || 0) + l.qty;
  }));
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const alerts: [string, 'red' | 'amber' | 'purple'][] = [];
  ingredients.filter(i => i.stock < i.par * .5).forEach(i => alerts.push([`${i.name} ${i.stock <= 0 ? 'out of stock' : 'critically low'}`, 'red']));
  ingredients.filter(i => i.stock >= i.par * .5 && i.stock < i.par).forEach(i => alerts.push([`${i.name} below par`, 'amber']));
  orders.filter(o => isOpen(o) && mins(o.time) > 12).forEach(o => alerts.push([`Order #${o.no} over 12 min`, 'red']));
  if (!shift) alerts.push(['No shift open on this till', 'amber']);
  if (purchaseOrders.some(p => p.status === 'Awaiting approval')) alerts.push(['Purchase order awaiting approval', 'purple']);

  const channels: Record<string, number> = {};
  orders.filter(o => o.status !== 'Cancelled').forEach(o => {
    const k = o.customer.startsWith('Talabat') ? 'Talabat' : o.type;
    channels[k] = (channels[k] || 0) + o.total;
  });

  return (
    <section className="view active">
      <div className="kpis">
        <KpiCard tone="lime" title="Net sales" value={num(sales)} label="EGP paid today" />
        <KpiCard tone="white" title="Orders" value={orders.filter(o => o.status !== 'Cancelled').length} label="All channels" />
        <KpiCard title="Average order" value={paid.length ? num(sales / paid.length) : 0} label="EGP incl. VAT" />
        <KpiCard tone="purple" title="Food cost" value={foodCost + '%'} label="Theoretical COGS on paid sales" />
      </div>

      <div className="two">
        <div className="card">
          <h3>Sales by hour</h3>
          <div className="bars">
            {HOURS.map((h, i) => (
              <div key={h} className={`bar${HOUR_SEED[i] >= 90 ? ' hot' : HOUR_SEED[i] >= 55 ? ' mid' : ''}`} style={{ height: HOUR_SEED[i] + '%' }}>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Payment mix</h3>
          <div className="donut">
            <div className="ring" style={{ background: `conic-gradient(${gradient || 'var(--card-2) 0 360deg'})` }}>
              <b>{paid.length} paid</b>
            </div>
            <div className="rows" style={{ flex: 1 }}>
              {Object.entries(mix).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                <div key={k}>
                  <span><i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: TENDER_COLORS[k] || '#888', marginRight: 6 }} />{k}</span>
                  <span className="r">{Math.round(v / mixTotal * 100)}% · {fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="three">
        <div className="card">
          <h3>Top dishes</h3>
          <div className="rows">
            {top.map(([id, q]) => {
              const m = menu.find(x => x.id === +id);
              return m ? <div key={id}><span>{m.icon} {m.name}</span><span className="r">{q} sold</span></div> : null;
            })}
          </div>
        </div>
        <div className="card white">
          <h3>Needs attention</h3>
          <div className="rows">
            {alerts.length ? alerts.slice(0, 7).map(([t, c], i) => (
              <div key={i}><span>{t}</span><span className={`badge ${c}`}>{c === 'red' ? 'Act now' : c === 'amber' ? 'Soon' : 'Review'}</span></div>
            )) : <div>All clear.</div>}
          </div>
        </div>
        <div className="card">
          <h3>Channels</h3>
          <div className="rows">
            {Object.entries(channels).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k}><span>{k}</span><span className="r">{fmt(v)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
