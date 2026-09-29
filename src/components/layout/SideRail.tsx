import type { ViewId } from '../../types';
import { BRANCHES } from '../../data/constants';
import { isOpen } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import Icon, { type IconName } from '../ui/Icon';

interface RailEntry {
  view: ViewId;
  label: string;
  icon: IconName;
  count?: number;
}

export default function SideRail() {
  const { state, dispatch } = useApp();

  const openOrders = state.orders.filter(isOpen).length;
  const kdsCount = state.orders.filter(o => ['New', 'In progress'].includes(o.status)).length;
  const lowStock = state.ingredients.filter(i => i.stock < i.par * .5).length;

  const entries: (RailEntry | 'sep')[] = [
    { view: 'pos', label: 'Point of sale', icon: 'pos' },
    { view: 'tables', label: 'Tables', icon: 'tables' },
    { view: 'kds', label: 'Kitchen display', icon: 'kds', count: kdsCount },
    { view: 'orders', label: 'Orders', icon: 'orders', count: openOrders },
    'sep',
    { view: 'home', label: 'Dashboard', icon: 'home' },
    { view: 'menu', label: 'Menu manager', icon: 'menu' },
    { view: 'inventory', label: 'Inventory', icon: 'inventory', count: lowStock },
    { view: 'purchasing', label: 'Purchasing', icon: 'purchasing' },
    { view: 'customers', label: 'Customers & loyalty', icon: 'customers' },
    { view: 'promos', label: 'Promotions', icon: 'promos' },
    { view: 'reports', label: 'Reports', icon: 'reports' },
    'sep',
    { view: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="rail" aria-label="Main">
      <div className="rail-head">
        <div className="rail-user">
          <span className="avatar" />
          <div>
            <div className="rail-user-name">Mahmoud Fathy</div>
            <div className="rail-user-role">Cashier · Maadi</div>
          </div>
        </div>
      </div>
      <div className="rail-status">
        <button className={`pill${state.online ? '' : ' off'}`} onClick={() => dispatch({ type: 'TOGGLE_NET' })}>
          <i /><span>{state.online ? 'Online' : 'Offline'}</span>
        </button>
        <button className="pill" onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { kind: state.shift ? 'shift-close' : 'shift-open' } })}>
          <i style={{ background: state.shift ? 'var(--lime)' : 'var(--amber)' }} />
          <span>{state.shift ? 'Shift open' : 'No shift'}</span>
        </button>
      </div>
      <select
        className="rail-branch"
        aria-label="Branch"
        defaultValue="maadi"
        onChange={e => dispatch({ type: 'TOAST', msg: 'Switched to ' + (BRANCHES.find(b => b.id === e.target.value)?.name || '') + ' branch' })}
      >
        {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name} branch</option>)}
      </select>
      {entries.map((e, i) => e === 'sep'
        ? <span className="sep" key={i} />
        : (
          <button
            key={e.view}
            aria-label={e.label}
            aria-current={state.view === e.view ? 'page' : undefined}
            onClick={() => dispatch({ type: 'VIEW', view: e.view })}
          >
            <Icon name={e.icon} />
            <span className="rail-label">{e.label}</span>
            {!!e.count && <span className="count">{e.count}</span>}
          </button>
        ))}
    </nav>
  );
}
