import { useState } from 'react';
import { MODGROUPS } from '../../data/constants';
import { fmt } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function ModsModal({ itemId }: { itemId: number }) {
  const { state, dispatch } = useApp();
  const m = state.menu.find(x => x.id === itemId);
  const g = m?.mods ? MODGROUPS[m.mods] : undefined;
  const [sel, setSel] = useState(g?.opts[0][0] || '');

  if (!m || !g) return null;

  return (
    <Modal title={<>{m.icon} {m.name}</>}>
      <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{g.name} · choose one</div>
      <div className="mods">
        {g.opts.map(([n, p]) => (
          <label key={n}>
            <span>
              <input type="radio" name="mod" checked={sel === n} onChange={() => setSel(n)} /> {n}
            </span>
            <span>{p ? '+ ' + fmt(p) : ''}</span>
          </label>
        ))}
      </div>
      <button
        className="btn lime"
        style={{ justifyContent: 'center', padding: 14 }}
        onClick={() => { dispatch({ type: 'ADD_TO_CART', id: m.id, mod: sel }); dispatch({ type: 'CLOSE_MODAL' }); }}
      >
        Add to order
      </button>
    </Modal>
  );
}
