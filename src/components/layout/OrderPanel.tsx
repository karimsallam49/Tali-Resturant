import { TABLES } from '../../data/constants';
import { calc, linePrice } from '../../lib/calc';
import { fmt, num } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import type { OrderType } from '../../types';
import Icon from '../ui/Icon';
import Tabs from '../ui/Tabs';

const ORDER_TYPES: OrderType[] = ['Dine in', 'Take away', 'Delivery'];

export default function OrderPanel() {
  const { state, dispatch } = useApp();
  const { cart, menu, customers, orderType, discount } = state;
  const t = calc(menu, cart, discount, orderType);
  const itemCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      <aside className={`side${state.cartOpen ? ' open' : ''}`} aria-label="Order details">
        <div className="side-head">
          <h2>Order details</h2>
          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear</button>
            <button className="cart-close" onClick={() => dispatch({ type: 'SET_CART_OPEN', open: false })}>Close</button>
          </div>
        </div>

        <Tabs
          items={ORDER_TYPES.map(x => ({ key: x, label: x }))}
          selected={orderType}
          onSelect={k => dispatch({ type: 'SET_ORDER_TYPE', orderType: k as OrderType })}
        />

        <div className="field sel">
          <select
            aria-label="Customer"
            value={state.selectedCustomer}
            onChange={e => dispatch({ type: 'SET_CUSTOMER', id: e.target.value })}
          >
            <option value="">Walk-in customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} · {c.points} pts</option>)}
          </select>
        </div>

        {orderType === 'Dine in' && (
          <div className="field sel">
            <select
              aria-label="Table"
              value={state.selectedTable}
              onChange={e => dispatch({ type: 'SET_TABLE', table: e.target.value })}
            >
              <option value="">Select table</option>
              {TABLES.map(x => <option key={x.n}>Table {x.n}</option>)}
            </select>
          </div>
        )}

        <div className="order-id">
          <b>Order #{state.currentOrderNo}</b>
          <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
        </div>

        <div className="cart">
          {cart.length ? cart.map((l, i) => {
            const m = menu.find(x => x.id === l.id)!;
            return (
              <div className="line" key={i}>
                <div className="nm">{m.icon} {m.name}</div>
                {!!l.mods.length && <div className="mods">{l.mods.join(', ')}</div>}
                <button className="rm" aria-label="Remove" onClick={() => dispatch({ type: 'LINE_REMOVE', index: i })}>×</button>
                <div className="bottom">
                  <div className="qty">
                    <button aria-label="Less" onClick={() => dispatch({ type: 'LINE_QTY', index: i, delta: -1 })}>−</button>
                    <span>{l.qty}</span>
                    <button className="add" aria-label="More" onClick={() => dispatch({ type: 'LINE_QTY', index: i, delta: 1 })}>+</button>
                  </div>
                  <span className="amt">{fmt(linePrice(menu, l))}</span>
                </div>
                {l.note && <div className="note">{l.note}</div>}
              </div>
            );
          }) : (
            <div className="cart-empty">Your order is empty.<br />Tap + on any dish to start.</div>
          )}
        </div>

        <div className="extras">
          <button onClick={() => cart.length
            ? dispatch({ type: 'OPEN_PROMPT', prompt: 'note' })
            : dispatch({ type: 'TOAST', msg: 'Add a dish first' })}>
            <Icon name="note" />Cooking request
          </button>
          <button onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'voucher' })}>
            <Icon name="voucher" />Voucher
          </button>
          <button onClick={() => dispatch({ type: 'OPEN_PROMPT', prompt: 'discount' })}>
            <Icon name="percent" />Discount
          </button>
        </div>

        <div className="totals">
          <div><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
          {discount.type && <div><span>{discount.label || 'Discount'}</span><span>– {fmt(t.d)}</span></div>}
          {orderType === 'Dine in' && <div><span>Service 12%</span><span>{fmt(t.svc)}</span></div>}
          <div><span>VAT 14%</span><span>{fmt(t.vat)}</span></div>
          <div className="grand"><span>Total</span><span>{fmt(t.total)}</span></div>
        </div>

        <div className="side-actions">
          <button className="btn purple" disabled={!cart.length} onClick={() => dispatch({ type: 'SEND_ORDER', payNow: false })}>Send to kitchen</button>
          <button className="btn lime" disabled={!cart.length} onClick={() => dispatch({ type: 'SEND_ORDER', payNow: true })}>
            {cart.length ? `Pay ${num(t.total)}` : 'Pay'}
          </button>
        </div>
      </aside>

      {state.view === 'pos' && (
        <button className="cart-fab" onClick={() => dispatch({ type: 'SET_CART_OPEN', open: true })}>
          <span className="n">{itemCount}</span> {itemCount ? `Order · ${num(t.total)} EGP` : 'New order'}
        </button>
      )}
    </>
  );
}
