import { CATS } from '../data/constants';
import { available } from '../lib/calc';
import { ago, barColor, cls, initials, isOpen, num } from '../lib/format';
import { useApp } from '../store/AppContext';
import type { Order, OrderType } from '../types';
import Icon from '../components/ui/Icon';
import KpiCard from '../components/ui/KpiCard';
import Tabs from '../components/ui/Tabs';

const LINE_TYPES: OrderType[] = ['Dine in', 'Take away', 'Delivery'];
const AV = ['#7A1FE0', '#3B82F6', '#F0605A', '#F5C542', '#C8F000'];

function OrderCard({ o, first }: { o: Order; first: boolean }) {
  const { dispatch } = useApp();
  return (
    <div className={`ocard${first ? ' white' : ''}`} style={{ ['--bar' as string]: barColor(o.status), ['--av' as string]: AV[o.no % AV.length] }}>
      <div className="top">
        <span className="av">{initials(o.customer)}</span>
        <div>
          <div className="name">{o.customer}</div>
          <div className="meta">#{o.no} · {o.lines.reduce((s, l) => s + l.qty, 0)} items · {ago(o.time)}</div>
        </div>
      </div>
      <div className="foot">
        <span className="badge">{o.table || o.type}</span>
        <button className={`badge ${cls(o.status)}`} onClick={() => dispatch({ type: 'ADVANCE', no: o.no })}>{o.status}</button>
        {o.paid
          ? <span className="badge lime">Paid</span>
          : <button className="badge white" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'pay', orderNo: o.no } })}>Pay {num(o.total)}</button>}
      </div>
    </div>
  );
}

export default function PosView() {
  const { state, dispatch } = useApp();
  const { orders, menu, ingredients, cat, search, lineType } = state;

  const open = orders.filter(isOpen);
  const paid = orders.filter(o => o.paid && !o.refunded);
  const sales = paid.reduce((s, o) => s + o.total, 0);
  const unpaid = orders.filter(o => !o.paid && o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const drawer = (state.shift?.float ?? 0) + orders
    .filter(o => o.paid && !o.refunded && (o.paidAt ?? 0) >= (state.shift?.start ?? 0))
    .reduce((s, o) => s + (o.splits || []).filter(p => p.tender === 'Cash').reduce((a, p) => a + p.amt, 0), 0);

  const lineList = orders
    .filter(o => o.type === lineType && (isOpen(o) || (!o.paid && o.status !== 'Cancelled')))
    .sort((a, b) => b.time - a.time);

  const q = search.trim().toLowerCase();
  const dishes = menu.filter(m => (cat === 'All' || m.cat === cat) && (!q || m.name.toLowerCase().includes(q)));

  return (
    <section className="view active">
      <div className="kpis">
        <KpiCard tone="lime" title="Open orders" value={open.length} label="In kitchen right now" />
        <KpiCard tone="white" title="Net sales" value={num(sales)} label="EGP paid today" />
        <KpiCard title="Unpaid" value={num(unpaid)} label="EGP awaiting payment" />
        <KpiCard title="Cash in drawer" value={num(drawer)} label="EGP expected" />
      </div>

      <div className="head">
        <h2>Order line</h2>
        <Tabs
          items={LINE_TYPES.map(x => ({ key: x, label: x, count: orders.filter(o => o.type === x && isOpen(o)).length }))}
          selected={lineType}
          onSelect={k => dispatch({ type: 'SET_LINE_TYPE', lineType: k as OrderType })}
        />
        <span className="spacer" />
        <button className="btn" onClick={() => dispatch({ type: 'VIEW', view: 'orders' })}>All orders</button>
      </div>

      <div className="order-line">
        {lineList.length
          ? lineList.map((o, i) => <OrderCard key={o.no} o={o} first={i === 0} />)
          : <div className="empty">No {lineType.toLowerCase()} orders right now.</div>}
      </div>

      <div className="head">
        <h2>Menu</h2>
        <div className="cats" role="tablist">
          {['All', ...CATS].map(c => (
            <button key={c} role="tab" aria-selected={c === cat} onClick={() => dispatch({ type: 'SET_CAT', cat: c })}>
              {c}<span className="count">{c === 'All' ? menu.length : menu.filter(m => m.cat === c).length}</span>
            </button>
          ))}
        </div>
        <span className="spacer" />
        <label className="search">
          <Icon name="search" />
          <input type="search" placeholder="Search dishes" value={search} onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })} />
        </label>
      </div>

      <div className="grid">
        {dishes.length ? dishes.map(m => {
          const qty = state.cart.filter(l => l.id === m.id).reduce((s, l) => s + l.qty, 0);
          const out = m.off || !available(ingredients, m);
          return (
            <article className={`item${out ? ' out' : ''}`} key={m.id}>
              <div className="tile" aria-hidden="true">{m.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="cat">{m.cat}</div>
                <div className="nm">{m.name}</div>
                <div className="price">{m.price.toFixed(2)} EGP</div>
                <div className="qty">
                  <button aria-label="Less" disabled={!qty} onClick={() => dispatch({ type: 'CART_DEC', id: m.id })}>−</button>
                  <span>{qty}</span>
                  <button className="add" aria-label={`Add ${m.name}`} disabled={out} onClick={() => dispatch({ type: 'CART_INC', id: m.id })}>+</button>
                </div>
                {out && <div className="soldout">{m.off ? 'Hidden' : 'Out of stock'}</div>}
              </div>
            </article>
          );
        }) : <div className="empty">No dishes match “{q}”.</div>}
      </div>
    </section>
  );
}
