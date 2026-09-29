import { STATION } from '../data/constants';
import { mins } from '../lib/format';
import { useApp } from '../store/AppContext';
import type { Station } from '../types';
import Tabs from '../components/ui/Tabs';

const STATIONS: Station[] = ['All', 'Hot', 'Grill', 'Cold', 'Bar', 'Expo'];

export default function KdsView() {
  const { state, dispatch } = useApp();
  const { orders, menu, station } = state;

  const active = orders.filter(o => ['New', 'In progress'].includes(o.status));
  const countFor = (s: Station) =>
    active.filter(o => o.lines.some(l => STATION[menu.find(m => m.id === l.id)?.cat || ''] === s)).length;

  let list = orders
    .filter(o => ['New', 'In progress', 'Ready to serve'].includes(o.status))
    .sort((a, b) => a.time - b.time);
  if (station === 'Expo') list = list.filter(o => o.status === 'Ready to serve');
  else if (station !== 'All') list = list.filter(o => o.status !== 'Ready to serve' && o.lines.some(l => STATION[menu.find(m => m.id === l.id)?.cat || ''] === station));

  const times = orders.filter(o => o.status === 'Completed' && o.paidAt).map(o => (o.paidAt! - o.time) / 60000);
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  return (
    <section className="view active">
      <div className="head">
        <h2>Kitchen display</h2>
        <Tabs
          items={STATIONS.map(s => ({ key: s, label: s, count: ['All', 'Expo'].includes(s) ? undefined : countFor(s) }))}
          selected={station}
          onSelect={k => dispatch({ type: 'SET_STATION', station: k as Station })}
        />
        <span className="spacer" />
        <span className="btn">Avg ticket time {avg} min</span>
      </div>

      <div className="kds">
        {list.length ? list.map(o => {
          const m = mins(o.time);
          const late = m > 12 && o.status !== 'Ready to serve';
          const ls = o.lines.filter(l => ['All', 'Expo'].includes(station) || STATION[menu.find(x => x.id === l.id)?.cat || ''] === station);
          const tk = o.status === 'Ready to serve' ? 'var(--lime)' : o.status === 'In progress' ? 'var(--purple)' : 'var(--amber)';
          return (
            <div className="ticket" key={o.no}>
              <div className={`th${late ? ' late' : ''}`} style={{ background: late ? undefined : tk, color: o.status === 'In progress' && !late ? '#fff' : undefined }}>
                <span>#{o.no} · {o.table || o.type}</span><span>{m} min</span>
              </div>
              <ul>
                {ls.map((l, i) => {
                  const mi = menu.find(x => x.id === l.id);
                  if (!mi) return null;
                  return (
                    <li key={i}>
                      <b>{l.qty}×</b>
                      <span>
                        {mi.name}
                        {!!l.mods.length && <small>{l.mods.join(', ')}</small>}
                        {l.note && <small>⚠ {l.note}</small>}
                        <small>{STATION[mi.cat]}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="tf">
                {o.status === 'New' && <button className="btn purple" onClick={() => dispatch({ type: 'SET_STATUS', no: o.no, status: 'In progress' })}>Start</button>}
                {o.status === 'In progress' && <button className="btn lime" onClick={() => dispatch({ type: 'SET_STATUS', no: o.no, status: 'Ready to serve' })}>Bump · ready</button>}
                {o.status === 'Ready to serve' && <>
                  <button className="btn" onClick={() => dispatch({ type: 'SET_STATUS', no: o.no, status: 'In progress' })}>Recall</button>
                  <button className="btn lime" onClick={() => dispatch({ type: 'ADVANCE', no: o.no })}>Served</button>
                </>}
              </div>
            </div>
          );
        }) : <div className="empty">No tickets for {station}. Kitchen is clear.</div>}
      </div>
    </section>
  );
}
