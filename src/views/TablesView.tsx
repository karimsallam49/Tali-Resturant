import { TABLES } from '../data/constants';
import { ago, fmt, isOpen } from '../lib/format';
import { useApp } from '../store/AppContext';
import type { Order } from '../types';

export function tableState(orders: Order[], n: number): [string, string, Order | null] {
  const o = orders.find(x => x.table === 'Table ' + n && isOpen(x));
  if (!o) return ['', 'Free', null];
  if (o.status === 'Ready to serve') return ['ready', 'Food ready', o];
  if (o.billReq) return ['bill', 'Bill requested', o];
  return ['occ', 'Seated · ' + o.status, o];
}

export default function TablesView() {
  const { state, dispatch } = useApp();
  const seated = TABLES.filter(t => tableState(state.orders, t.n)[2]).length;

  return (
    <section className="view active">
      <div className="head">
        <h2>Floor</h2>
        <span className="badge">Free</span>
        <span className="badge purple">Seated</span>
        <span className="badge amber">Bill requested</span>
        <span className="badge lime">Food ready</span>
        <span className="spacer" />
        <span className="btn">{seated}/{TABLES.length} tables seated</span>
      </div>

      <div className="floor">
        {TABLES.map(t => {
          const [c, s, o] = tableState(state.orders, t.n);
          return (
            <button key={t.n} className={`tbl ${c}`} onClick={() =>
              o
                ? dispatch({ type: 'OPEN_MODAL', modal: { kind: 'table', table: t.n } })
                : dispatch({ type: 'TABLE_SELECT', n: t.n })
            }>
              <div>
                <div className="n">Table {t.n}</div>
                <div className="s">{t.seats} seats</div>
              </div>
              <div className="s">
                {s}
                {o && <><br />#{o.no} · {fmt(o.total)} · {ago(o.time)}</>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="card">
        <h3>
          Reservations tonight
          <button className="btn sm white" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'reservation' })}>Add reservation</button>
        </h3>
        <div className="rows">
          {state.reservations.length
            ? state.reservations.map((r, i) => (
                <div key={i}><span>{r.time} · {r.name}</span><span className="r">{r.covers} covers · Table {r.table}</span></div>
              ))
            : <div><span className="r">No reservations.</span></div>}
        </div>
      </div>
    </section>
  );
}
