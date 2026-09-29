import { useState } from 'react';
import { CATS, MODGROUPS } from '../../data/constants';
import { useApp } from '../../store/AppContext';
import Modal from '../ui/Modal';

export default function ItemFormModal() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState('');
  const [cat, setCat] = useState(CATS[0]);
  const [price, setPrice] = useState('60');
  const [icon, setIcon] = useState('🍽️');
  const [mods, setMods] = useState('');

  const save = () => {
    const n = name.trim();
    if (!n) {
      dispatch({ type: 'TOAST', msg: 'Give the dish a name' });
      return;
    }
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: Math.max(...state.menu.map(m => m.id)) + 1,
        cat, name: n, price: +price || 0, icon: icon || '🍽️',
        recipe: {}, mods: mods || undefined,
      },
    });
  };

  return (
    <Modal title="Add dish">
      <div className="form">
        <label className="full">Name<input placeholder="e.g. Feteer meshaltet" value={name} onChange={e => setName(e.target.value)} autoFocus /></label>
        <label>Category
          <select value={cat} onChange={e => setCat(e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Price (EGP)<input type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>
        <label>Emoji<input value={icon} onChange={e => setIcon(e.target.value)} /></label>
        <label>Modifier group
          <select value={mods} onChange={e => setMods(e.target.value)}>
            <option value="">None</option>
            {Object.entries(MODGROUPS).map(([k, g]) => <option key={k} value={k}>{g.name}</option>)}
          </select>
        </label>
      </div>
      <button className="btn lime" style={{ justifyContent: 'center', padding: 14 }} onClick={save}>Save dish</button>
    </Modal>
  );
}
