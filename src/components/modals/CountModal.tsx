import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function CountModal() {
  const { state, dispatch } = useApp();
  const [counts, setCounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(state.ingredients.map(i => [i.id, String(i.stock)])));

  const submit = () => {
    dispatch({
      type: 'POST_COUNT',
      counts: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, +v || 0])),
    });
  };

  return (
    <Modal title="Stock count">
      <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>
        Enter counted quantities. Differences are posted as adjustments for manager approval.
      </div>
      <div className="form">
        {state.ingredients.map(i => (
          <label key={i.id}>
            {i.name} ({i.unit})
            <input
              type="number" step="0.1" value={counts[i.id] ?? ''}
              onChange={e => setCounts(c => ({ ...c, [i.id]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <button className="btn lime" style={{ justifyContent: 'center', padding: 14 }} onClick={submit}>Post count</button>
    </Modal>
  );
}
