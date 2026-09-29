import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

const REASONS = ['Expired', 'Spoiled', 'Over-prepared', 'Dropped / damaged', 'Staff meal'];

export default function WasteModal() {
  const { state, dispatch } = useApp();
  const [ing, setIng] = useState(state.ingredients[0]?.id || '');
  const [qty, setQty] = useState('1');
  const [why, setWhy] = useState(REASONS[0]);

  return (
    <Modal title="Log waste">
      <div className="form">
        <label>
          Ingredient
          <select value={ing} onChange={e => setIng(e.target.value)}>
            {state.ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </label>
        <label>
          Quantity
          <input type="number" value={qty} onChange={e => setQty(e.target.value)} />
        </label>
        <label className="full">
          Reason
          <select value={why} onChange={e => setWhy(e.target.value)}>
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <button
        className="btn lime" style={{ justifyContent: 'center', padding: 14 }}
        onClick={() => dispatch({ type: 'LOG_WASTE', id: ing, qty: +qty || 0, reason: why })}
      >
        Log waste
      </button>
    </Modal>
  );
}
