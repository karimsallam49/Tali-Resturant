import { SUPPLIERS } from '../../data/constants';
import { lowBySupplier } from '../../lib/calc';
import { fmt } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function AutoPOModal() {
  const { state, dispatch } = useApp();
  const bySup = lowBySupplier(state.ingredients);
  const entries = Object.entries(bySup);

  if (!entries.length) {
    return (
      <Modal title="Suggested purchase orders">
        <div className="empty">Everything is at par — nothing to order.</div>
      </Modal>
    );
  }

  return (
    <Modal title="Suggested purchase orders">
      <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>
        Quantities bring each ingredient back to par plus 20%, based on today's depletion rate.
      </div>
      {entries.map(([s, items]) => (
        <div className="card" key={s}>
          <h3>{s}<span className="badge">{SUPPLIERS.find(x => x.name === s)?.terms || ''}</span></h3>
          <div className="rows">
            {items.map(i => {
              const q = +(i.par * 1.2 - i.stock).toFixed(1);
              return <div key={i.id}><span>{i.name}</span><span className="r">{q} {i.unit} · {fmt(q * i.cost)}</span></div>;
            })}
          </div>
        </div>
      ))}
      <button
        className="btn lime" style={{ justifyContent: 'center', padding: 14 }}
        onClick={() => dispatch({ type: 'CREATE_POS' })}
      >
        Create {entries.length} purchase order{entries.length > 1 ? 's' : ''} for approval
      </button>
    </Modal>
  );
}
