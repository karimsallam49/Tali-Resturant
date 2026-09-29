import { cogs } from '../lib/calc';
import { fmt, num } from '../lib/format';
import { useApp } from '../store/AppContext';
import DataTable from '../components/ui/DataTable';
import KpiCard from '../components/ui/KpiCard';

export default function InventoryView() {
  const { state, dispatch } = useApp();
  const { ingredients, menu } = state;

  const stockVal = ingredients.reduce((s, i) => s + i.stock * i.cost, 0);
  const lowCount = ingredients.filter(i => i.stock < i.par).length;
  const sorted = [...ingredients].sort((a, b) => a.stock / a.par - b.stock / b.par);

  return (
    <section className="view active">
      <div className="kpis">
        <KpiCard tone="lime" title="Stock value" value={num(stockVal)} label="EGP at cost" />
        <KpiCard tone="white" title="Below par" value={lowCount} label="Ingredients to reorder" />
        <KpiCard title="Waste today" value={num(state.waste)} label="EGP logged" />
        <KpiCard title="Depleted by sales" value={num(state.depleted)} label="EGP consumed today" />
      </div>

      <div className="head">
        <h2>Ingredients</h2>
        <span className="spacer" />
        <button className="btn" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'count' } })}>Start count</button>
        <button className="btn" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'waste' } })}>Log waste</button>
        <button className="btn white" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: 'auto-po' } })}>Suggest purchase order</button>
      </div>

      <DataTable
        cols="1.4fr 90px 70px 1fr 100px 110px 130px"
        head={['Ingredient', 'On hand', 'Par', 'Level', 'Unit cost', 'Value', 'Supplier']}
        rows={sorted.map(i => {
          const p = Math.min(100, i.stock / i.par * 100);
          return [
            <b>{i.name}<small>{i.unit}</small></b>,
            <span className={p < 50 ? 'crit' : p < 100 ? 'low' : ''}>{i.stock} {i.unit}</span>,
            i.par,
            <div className="prog"><i className={p < 50 ? 'bad' : p < 100 ? 'warn' : ''} style={{ width: p + '%' }} /></div>,
            fmt(i.cost),
            fmt(i.stock * i.cost),
            <small style={{ color: 'var(--fg)' }}>{i.sup}</small>,
          ];
        })}
      />

      <div className="card">
        <h3>Recipes <span className="badge">Sales deplete stock automatically</span></h3>
        <div className="rows">
          {menu.filter(m => Object.keys(m.recipe || {}).length).slice(0, 8).map(m => (
            <div key={m.id}>
              <span>{m.icon} {m.name}</span>
              <span className="r">
                {Object.entries(m.recipe).map(([k, q]) => {
                  const i = ingredients.find(x => x.id === k);
                  return i ? `${q} ${i.unit} ${i.name}` : '';
                }).join(' · ')} → cost {fmt(cogs(menu, ingredients, [{ id: m.id, qty: 1, note: '', mods: [] }]))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
