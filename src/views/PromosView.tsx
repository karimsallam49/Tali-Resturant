import { fmt } from '../lib/format';
import { useApp } from '../store/AppContext';
import DataTable from '../components/ui/DataTable';
import Toggle from '../components/ui/Toggle';

export default function PromosView() {
  const { state, dispatch } = useApp();

  return (
    <section className="view active">
      <div className="head">
        <h2>Promotions</h2>
        <span className="spacer" />
        <button className="btn white" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'promo' })}>New promotion</button>
      </div>

      <DataTable
        cols="1.6fr 120px 110px 90px 90px 90px"
        head={['Promotion', 'Type', 'Code', 'Value', 'Uses', 'Active']}
        rows={state.promos.map((p, i) => [
          <b>{p.name}{p.note && <small>{p.note}</small>}</b>,
          p.type,
          p.code || '—',
          p.value ? p.value + '%' : 'Item',
          p.uses,
          <Toggle checked={p.active} label="Active" onChange={() => dispatch({ type: 'TOGGLE_PROMO', index: i })} />,
        ])}
      />

      <div className="card">
        <h3>Gift cards</h3>
        <div className="rows">
          {state.giftCards.map(g => (
            <div key={g.code}><span>{g.code}</span><span className="r">Balance {fmt(g.balance)}</span></div>
          ))}
          <div><button className="btn sm white" onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'gift' })}>Sell gift card</button></div>
        </div>
      </div>
    </section>
  );
}
