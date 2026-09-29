import { BRANCHES, TITLES } from '../../data/constants';
import { useApp } from '../../store/AppContext';
import Icon from '../ui/Icon';

export default function TopBar() {
  const { state, dispatch } = useApp();

  return (
    <header className="topbar">
      <div className="brand">
        <button className="menu-btn" aria-label="Menu" onClick={() => dispatch({ type: 'TOGGLE_NAV' })}>
          <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
        </button>
        TALI
        <select
          aria-label="Branch"
          defaultValue="maadi"
          onChange={e => dispatch({ type: 'TOAST', msg: 'Switched to ' + (BRANCHES.find(b => b.id === e.target.value)?.name || '') + ' branch' })}
        >
          {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="title">{TITLES[state.view]}</div>
      <div className="tools">
        <button
          className={`pill${state.online ? '' : ' off'}`}
          aria-label="Connection"
          onClick={() => dispatch({ type: 'TOGGLE_NET' })}
        >
          <i /><span>{state.online ? 'Online' : 'Offline · orders queued'}</span>
        </button>
        <button
          className="pill"
          onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: state.shift ? 'shift-close' : 'shift-open' } })}
        >
          {state.shift
            ? <><i /><span>{state.shift.user.split(' ')[0]} · shift open</span></>
            : <><i style={{ background: 'var(--amber)' }} /><span>No shift · tap to open</span></>}
        </button>
        <button
          className="icon-btn"
          aria-label="Calendar"
          onClick={() => dispatch({ type: 'TOAST', msg: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) })}
        >
          <Icon name="calendar" />
        </button>
        <span className="avatar" title="Mahmoud · Cashier" />
      </div>
    </header>
  );
}
