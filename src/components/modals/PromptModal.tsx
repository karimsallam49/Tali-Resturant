import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import type { PromptKind } from '../../types';
import Modal from '../ui/Modal';

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number';
  placeholder?: string;
  defaultValue?: string;
  full?: boolean;
}

export default function PromptModal({ prompt, orderNo }: { prompt: PromptKind; orderNo?: number }) {
  const { state, dispatch } = useApp();
  const [values, setValues] = useState<Record<string, string>>({});

  const lastLine = state.cart[state.cart.length - 1];
  const lastItem = lastLine ? state.menu.find(m => m.id === lastLine.id) : undefined;
  const order = orderNo !== undefined ? state.orders.find(o => o.no === orderNo) : undefined;

  const cfg: { title: string; body?: string; fields: FieldDef[]; submitLabel: string; onSubmit: (v: Record<string, string>) => void } =
    (() => {
      switch (prompt) {
        case 'note':
          return {
            title: `Cooking request${lastItem ? ' · ' + lastItem.name : ''}`,
            fields: [{ key: 'note', label: 'Request', placeholder: 'e.g. No onions, extra spicy', defaultValue: lastLine?.note || '', full: true }],
            submitLabel: 'Save note',
            onSubmit: v => dispatch({ type: 'SET_LAST_NOTE', note: (v.note || '').trim() }),
          };
        case 'voucher':
          return {
            title: 'Apply voucher',
            fields: [{ key: 'code', label: 'Voucher code', placeholder: 'TALI10 or RAMADAN20', full: true }],
            submitLabel: 'Apply',
            onSubmit: v => dispatch({ type: 'APPLY_VOUCHER', code: v.code || '' }),
          };
        case 'discount':
          return {
            title: 'Manager discount',
            body: 'Enter % (e.g. 10) or amount (e.g. 50 EGP). Manager PIN required.',
            fields: [{ key: 'value', label: 'Discount', placeholder: '10 or 50 EGP', full: true }],
            submitLabel: 'Apply discount',
            onSubmit: v => dispatch({ type: 'APPLY_DISCOUNT', raw: v.value || '' }),
          };
        case 'cancel-order':
          return {
            title: `Cancel order #${orderNo}`,
            body: 'A manager PIN is required to void this order.',
            fields: [{ key: 'reason', label: 'Reason', placeholder: 'customer left, wrong order, test…', full: true }],
            submitLabel: 'Cancel order',
            onSubmit: v => dispatch({ type: 'CANCEL_ORDER', no: orderNo!, reason: v.reason || '' }),
          };
        case 'refund':
          return {
            title: `Refund order #${orderNo}`,
            body: order ? `Refund EGP ${order.total.toFixed(2)} to ${order.tender}? Manager PIN required.` : undefined,
            fields: [{ key: 'reason', label: 'Reason', full: true }],
            submitLabel: 'Refund',
            onSubmit: v => dispatch({ type: 'REFUND', no: orderNo!, reason: v.reason || '' }),
          };
        case 'reservation':
          return {
            title: 'Add reservation',
            fields: [
              { key: 'name', label: 'Guest name', full: true },
              { key: 'time', label: 'Time', defaultValue: '20:30' },
              { key: 'covers', label: 'Covers', type: 'number', defaultValue: '2' },
              { key: 'table', label: 'Table', type: 'number', defaultValue: '5' },
            ],
            submitLabel: 'Add reservation',
            onSubmit: v => dispatch({
              type: 'ADD_RESERVATION',
              r: { name: v.name || 'Guest', time: v.time || '20:30', covers: +v.covers || 2, table: +v.table || 5 },
            }),
          };
        case 'customer':
          return {
            title: 'Add customer',
            fields: [
              { key: 'name', label: 'Customer name', full: true },
              { key: 'phone', label: 'Phone', full: true },
            ],
            submitLabel: 'Add customer',
            onSubmit: v => dispatch({ type: 'ADD_CUSTOMER', name: v.name || 'Guest', phone: v.phone || '' }),
          };
        case 'promo':
          return {
            title: 'New promotion',
            fields: [
              { key: 'name', label: 'Promotion name', full: true },
              { key: 'value', label: 'Discount %', type: 'number', defaultValue: '15' },
              { key: 'code', label: 'Coupon code (blank = automatic)' },
            ],
            submitLabel: 'Create promotion',
            onSubmit: v => dispatch({ type: 'ADD_PROMO', name: v.name || 'Promotion', value: +v.value || 0, code: v.code || '' }),
          };
        case 'gift':
          return {
            title: 'Sell gift card',
            fields: [{ key: 'amount', label: 'Load amount (EGP)', type: 'number', defaultValue: '200', full: true }],
            submitLabel: 'Sell card',
            onSubmit: v => { if (+v.amount > 0) dispatch({ type: 'SELL_GIFT', amount: +v.amount }); else dispatch({ type: 'CLOSE_MODAL' }); },
          };
      }
    })();

  return (
    <Modal title={cfg.title}>
      {cfg.body && <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{cfg.body}</div>}
      <form
        className="form"
        onSubmit={e => { e.preventDefault(); cfg.onSubmit(values); }}
      >
        {cfg.fields.map(f => (
          <label key={f.key} className={f.full ? 'full' : ''}>
            {f.label}
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder}
              defaultValue={f.defaultValue}
              autoFocus={f === cfg.fields[0]}
              onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            />
          </label>
        ))}
      </form>
      <button
        className="btn lime"
        style={{ justifyContent: 'center', padding: 14 }}
        onClick={() => cfg.onSubmit(values)}
      >
        {cfg.submitLabel}
      </button>
    </Modal>
  );
}
