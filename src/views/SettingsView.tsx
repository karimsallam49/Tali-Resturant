import { BRANCHES, ROLES, USERS } from '../data/constants';
import { useApp } from '../store/AppContext';
import type { SettingsTab } from '../types';
import DataTable from '../components/ui/DataTable';
import Tabs from '../components/ui/Tabs';
import Toggle from '../components/ui/Toggle';

const STABS: { key: SettingsTab; label: string }[] = [
  { key: 'branches', label: 'Branches' }, { key: 'users', label: 'Users & roles' },
  { key: 'tax', label: 'Tax & receipts' }, { key: 'integrations', label: 'Integrations' },
  { key: 'devices', label: 'Devices' },
];

const DEVICES: [string, string, string, string, boolean][] = [
  ['POS-01 · this device', 'Android POS', 'just now', '2.4.1', true],
  ['POS-02', 'iPad cashier', '1 min ago', '2.4.1', true],
  ['KDS-01', 'Kitchen display', 'just now', '2.4.0', true],
  ['P-01', 'Receipt printer', '—', '—', true],
  ['T-01', 'Tali Pay terminal', '30 s ago', 'fw 1.9', true],
  ['KIOSK-01', 'Self-order kiosk', '4 h ago', '2.3.8', false],
];

const toast = (msg: string) => ({ type: 'TOAST', msg } as const);

export default function SettingsView() {
  const { state, dispatch } = useApp();
  const { stab } = state;

  return (
    <section className="view active">
      <div className="head">
        <h2>Settings</h2>
        <Tabs white items={STABS} selected={stab} onSelect={k => dispatch({ type: 'SET_STAB', stab: k as SettingsTab })} />
      </div>

      {stab === 'branches' && <>
        <DataTable
          cols="1.4fr 1fr 1.3fr 1.3fr 140px"
          head={['Branch', 'City', 'Devices', 'Menu', 'Status']}
          rows={BRANCHES.map(x => [
            <b>{x.name}</b>, x.city, '2 POS · 1 KDS · 1 printer', 'Shared + local specials',
            <span className={`badge ${x.online ? 'lime' : 'red'}`}>{x.online ? 'Online' : 'Offline · syncing'}</span>,
          ])}
        />
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Brands at this location<span className="badge lime">Multi-brand included</span></h3>
          <div className="rows">
            <div><span>Tali Kitchen (dine-in & takeaway)</span><span className="r">Primary brand</span></div>
            <div><span>Koshary Express (virtual brand · Talabat, elmenus)</span><span className="r">Shares inventory & KDS</span></div>
            <div><button className="btn sm white" onClick={() => dispatch(toast('Brand added · menu cloned for editing'))}>Add virtual brand</button></div>
          </div>
        </div>
      </>}

      {stab === 'users' && <>
        <DataTable
          cols="1.3fr 1fr 1.8fr 100px 70px"
          head={['User', 'Role', 'Permissions', 'Branch', 'PIN']}
          rows={USERS.map(u => [
            <b>{u.name}</b>, u.role,
            <small style={{ color: 'var(--fg)' }}>{(ROLES[u.role] || []).join(' · ')}</small>,
            u.branch, u.pin,
          ])}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn white" onClick={() => dispatch(toast('Invite sent by WhatsApp'))}>Invite user</button>
          <button className="btn" onClick={() => dispatch(toast('Audit log: 148 events today · every void, discount and price change is recorded'))}>View audit log</button>
        </div>
      </>}

      {stab === 'tax' && (
        <div className="two">
          <div className="card">
            <h3>Taxes & charges</h3>
            <div className="rows">
              <div><span>VAT</span><span className="r">14% · added at checkout</span></div>
              <div><span>Service charge (dine-in)</span><span className="r">12%</span></div>
              <div><span>Tax registration</span><span className="r">100-234-567</span></div>
            </div>
          </div>
          <div className="card">
            <h3>Receipts & compliance</h3>
            <div className="rows">
              <div><span>ETA e-receipt submission</span><span className="badge lime">Connected</span></div>
              <div><span>Bilingual receipts (AR/EN)</span><Toggle checked label="Bilingual receipts" onChange={() => dispatch(toast('Setting saved'))} /></div>
              <div><span>Digital receipt by WhatsApp</span><Toggle checked label="WhatsApp receipt" onChange={() => dispatch(toast('Setting saved'))} /></div>
              <div><span>Receipt footer</span><span className="r">Thank you · شكراً</span></div>
            </div>
          </div>
        </div>
      )}

      {stab === 'integrations' && <>
        <DataTable
          cols="1.4fr 1fr 1fr 90px"
          head={['App', 'Category', 'Status', 'On']}
          rows={state.integrations.map((x, i) => [
            <b>{x.name}</b>, x.cat,
            <span className={`badge ${x.on ? 'lime' : ''}`}>{x.on ? 'Connected' : 'Not connected'}</span>,
            <Toggle checked={x.on} label="Toggle" onChange={() => dispatch({ type: 'TOGGLE_INTEGRATION', index: i })} />,
          ])}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn white" onClick={() => dispatch(toast('Marketplace: 100+ apps · opening catalogue'))}>Browse marketplace</button>
          <button className="btn" onClick={() => dispatch(toast('API key created · copy it from the developer console'))}>Create API key</button>
          <button className="btn" onClick={() => dispatch(toast('Webhook added: order.paid → https://…'))}>Add webhook</button>
        </div>
      </>}

      {stab === 'devices' && <>
        <DataTable
          cols="1.2fr 1fr 1fr 1fr 120px"
          head={['Device', 'Type', 'Last sync', 'Version', 'Status']}
          rows={DEVICES.map(d => [
            <b>{d[0]}</b>, d[1], d[2], d[3],
            <span className={`badge ${d[4] ? 'lime' : 'red'}`}>{d[4] ? 'Online' : 'Offline'}</span>,
          ])}
        />
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Offline mode</h3>
          <div className="rows">
            <div><span>Local order queue</span><span className="r">{state.online ? 'Empty · synced' : state.orders.filter(o => o.offline).length + ' orders waiting to sync'}</span></div>
            <div><span>Offline card cap per order</span><span className="r">EGP 2,000</span></div>
            <div><span>Simulate connection loss</span><Toggle checked={!state.online} label="Simulate connection loss" onChange={() => dispatch({ type: 'TOGGLE_NET' })} /></div>
          </div>
        </div>
      </>}
    </section>
  );
}
