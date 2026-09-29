import { CATS, MODGROUPS, STATION } from '../data/constants';
import { available, cogs } from '../lib/calc';
import { fmt } from '../lib/format';
import { useApp } from '../store/AppContext';
import DataTable from '../components/ui/DataTable';
import Toggle from '../components/ui/Toggle';

export default function MenuView() {
  const { state, dispatch } = useApp();
  const { menu, ingredients } = state;

  return (
    <section className="view active">
      <div className="head">
        <h2>Menu manager</h2>
        <span className="badge">Maadi · {menu.length} items</span>
        <span className="spacer" />
        <button className="btn white" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'item-form' } })}>Add dish</button>
      </div>

      <DataTable
        cols="44px 1.5fr 110px 110px 110px 100px 100px 90px"
        head={['', 'Dish', 'Category', 'Price', 'Cost', 'Margin', 'Stock', 'On menu']}
        rows={menu.map(m => {
          const cost = cogs(menu, ingredients, [{ id: m.id, qty: 1, note: '', mods: [] }]);
          const margin = m.price ? (m.price - cost) / m.price : 0;
          const ok = available(ingredients, m);
          return [
            <span style={{ fontSize: 22 }}>{m.icon}</span>,
            <b>{m.name}<small>{m.mods ? 'Modifiers: ' + MODGROUPS[m.mods].name : 'No modifiers'} · {STATION[m.cat]} station</small></b>,
            m.cat,
            <input
              type="number" aria-label="Price" defaultValue={m.price}
              onBlur={e => { const v = +e.target.value; if (v && v !== m.price) dispatch({ type: 'SET_PRICE', id: m.id, price: v }); }}
            />,
            fmt(cost),
            <span className={margin < .6 ? 'low' : ''}>{Math.round(margin * 100)}%</span>,
            <span className={ok ? '' : 'crit'}>{ok ? 'OK' : 'Out'}</span>,
            <Toggle checked={!m.off} label="On menu" onChange={() => dispatch({ type: 'TOGGLE_ITEM', id: m.id })} />,
          ];
        })}
      />

      <div className="two">
        <div className="card">
          <h3>Categories</h3>
          <div className="rows">
            {CATS.map(c => (
              <div key={c}><span>{c}</span><span className="r">{menu.filter(m => m.cat === c).length} dishes · {STATION[c]} station</span></div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Modifier groups</h3>
          <div className="rows">
            {Object.values(MODGROUPS).map(g => (
              <div key={g.name}><span>{g.name}</span><span className="r">{g.opts.map(o => o[0] + (o[1] ? ' +' + o[1] : '')).join(' · ')}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
