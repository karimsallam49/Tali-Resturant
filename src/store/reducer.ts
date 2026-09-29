import type {
  CartLine, Customer, Discount, GiftCard, Ingredient, Integration, MenuItem,
  ModalState, Order, OrderFilter, OrderStatus, OrderType, Promo, PromptKind,
  PurchaseOrder, ReportTab, Reservation, SettingsTab, Shift, Split, Station, ViewId,
} from '../types';
import {
  SEED_CUSTOMERS, SEED_GIFT, SEED_ING, SEED_INTEGRATIONS, SEED_MENU,
  SEED_POS, SEED_PROMOS, SEED_RESV, buildSeedOrders,
} from '../data/seed';
import { ORDER_STATUSES } from '../data/constants';
import { calc, depleteFor, lowBySupplier } from '../lib/calc';
import { fmt } from '../lib/format';

export interface AppState {
  view: ViewId;
  menu: MenuItem[];
  ingredients: Ingredient[];
  customers: Customer[];
  promos: Promo[];
  giftCards: GiftCard[];
  purchaseOrders: PurchaseOrder[];
  reservations: Reservation[];
  integrations: Integration[];
  orders: Order[];
  cart: CartLine[];
  discount: Discount;
  nextNo: number;
  currentOrderNo: number;
  poSeq: number;
  shift: Shift | null;
  online: boolean;
  waste: number;
  depleted: number;
  cat: string;
  search: string;
  lineType: OrderType;
  orderType: OrderType;
  station: Station;
  ofilter: OrderFilter;
  rtab: ReportTab;
  stab: SettingsTab;
  selectedCustomer: string;
  selectedTable: string;
  cartOpen: boolean;
  navOpen: boolean;
  modal: ModalState | null;
  toast: { msg: string; id: number } | null;
  tick: number;
}

const NO_DISCOUNT: Discount = { type: null, value: 0, label: '' };

export function initialState(): AppState {
  const menu = SEED_MENU.map(m => ({ ...m, recipe: { ...m.recipe } }));
  let ingredients = SEED_ING.map(i => ({ ...i }));
  const { orders, nextNo } = buildSeedOrders(menu);
  orders.filter(o => o.status !== 'Cancelled').forEach(o => {
    ingredients = depleteFor(menu, ingredients, o).ings;
  });
  return {
    view: 'pos',
    menu, ingredients,
    customers: SEED_CUSTOMERS.map(c => ({ ...c })),
    promos: SEED_PROMOS.map(p => ({ ...p })),
    giftCards: SEED_GIFT.map(g => ({ ...g })),
    purchaseOrders: SEED_POS.map(p => ({ ...p })),
    reservations: SEED_RESV.map(r => ({ ...r })),
    integrations: SEED_INTEGRATIONS.map(i => ({ ...i })),
    orders,
    cart: [],
    discount: NO_DISCOUNT,
    nextNo,
    currentOrderNo: nextNo,
    poSeq: 1042,
    shift: { user: 'Mahmoud Fathy', float: 500, start: Date.now() - 3 * 3600000 },
    online: true,
    waste: 0,
    depleted: 0,
    cat: 'All',
    search: '',
    lineType: 'Dine in',
    orderType: 'Dine in',
    station: 'All',
    ofilter: 'all',
    rtab: 'sales',
    stab: 'branches',
    selectedCustomer: '',
    selectedTable: '',
    cartOpen: false,
    navOpen: false,
    modal: null,
    toast: null,
    tick: 0,
  };
}

export type Action =
  | { type: 'VIEW'; view: ViewId }
  | { type: 'SET_CAT'; cat: string }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_LINE_TYPE'; lineType: OrderType }
  | { type: 'SET_ORDER_TYPE'; orderType: OrderType }
  | { type: 'SET_STATION'; station: Station }
  | { type: 'SET_OFILTER'; ofilter: OrderFilter }
  | { type: 'SET_RTAB'; rtab: ReportTab }
  | { type: 'SET_STAB'; stab: SettingsTab }
  | { type: 'SET_CUSTOMER'; id: string }
  | { type: 'SET_TABLE'; table: string }
  | { type: 'SET_CART_OPEN'; open: boolean }
  | { type: 'SET_NAV_OPEN'; open: boolean }
  | { type: 'TOGGLE_NAV' }
  | { type: 'CART_INC'; id: number }
  | { type: 'CART_DEC'; id: number }
  | { type: 'LINE_QTY'; index: number; delta: number }
  | { type: 'LINE_REMOVE'; index: number }
  | { type: 'ADD_TO_CART'; id: number; mod?: string }
  | { type: 'SET_LAST_NOTE'; note: string }
  | { type: 'APPLY_VOUCHER'; code: string }
  | { type: 'APPLY_DISCOUNT'; raw: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SEND_ORDER'; payNow: boolean }
  | { type: 'ADVANCE'; no: number }
  | { type: 'SET_STATUS'; no: number; status: OrderStatus }
  | { type: 'CANCEL_ORDER'; no: number; reason: string }
  | { type: 'REFUND'; no: number; reason: string }
  | { type: 'REQUEST_BILL'; no: number }
  | { type: 'PAY_ORDER'; no: number; splits: Split[] }
  | { type: 'REDEEM_GIFT'; code: string; amount: number }
  | { type: 'REDEEM_POINTS'; custId: number; pts: number }
  | { type: 'OPEN_SHIFT'; user: string; float: number }
  | { type: 'CLOSE_SHIFT'; counted: number }
  | { type: 'TOGGLE_NET' }
  | { type: 'TABLE_SELECT'; n: number }
  | { type: 'NEW_ORDER_FOR'; custId: number }
  | { type: 'ADD_RESERVATION'; r: Reservation }
  | { type: 'SET_PRICE'; id: number; price: number }
  | { type: 'TOGGLE_ITEM'; id: number }
  | { type: 'ADD_ITEM'; item: MenuItem }
  | { type: 'LOG_WASTE'; id: string; qty: number; reason: string }
  | { type: 'POST_COUNT'; counts: Record<string, number> }
  | { type: 'CREATE_POS' }
  | { type: 'PO_STATUS'; index: number; status: PurchaseOrder['status'] }
  | { type: 'ADD_CUSTOMER'; name: string; phone: string }
  | { type: 'TOGGLE_PROMO'; index: number }
  | { type: 'ADD_PROMO'; name: string; value: number; code: string }
  | { type: 'SELL_GIFT'; amount: number }
  | { type: 'TOGGLE_INTEGRATION'; index: number }
  | { type: 'OPEN_MODAL'; modal: ModalState }
  | { type: 'OPEN_PROMPT'; prompt: PromptKind; orderNo?: number }
  | { type: 'CLOSE_MODAL' }
  | { type: 'TOAST'; msg: string }
  | { type: 'DISMISS_TOAST' }
  | { type: 'TICK' };

const toast = (msg: string) => ({ msg, id: Date.now() });

function resetCart(s: AppState): Partial<AppState> {
  return {
    cart: [], discount: NO_DISCOUNT, selectedCustomer: '',
    selectedTable: '', currentOrderNo: s.nextNo,
  };
}

function mapOrder(orders: Order[], no: number, fn: (o: Order) => Order): Order[] {
  return orders.map(o => (o.no === no ? fn(o) : o));
}

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'VIEW':
      return { ...s, view: a.view, cartOpen: false, navOpen: false };
    case 'SET_CAT': return { ...s, cat: a.cat };
    case 'SET_SEARCH': return { ...s, search: a.search };
    case 'SET_LINE_TYPE': return { ...s, lineType: a.lineType };
    case 'SET_ORDER_TYPE': return { ...s, orderType: a.orderType };
    case 'SET_STATION': return { ...s, station: a.station };
    case 'SET_OFILTER': return { ...s, ofilter: a.ofilter };
    case 'SET_RTAB': return { ...s, rtab: a.rtab };
    case 'SET_STAB': return { ...s, stab: a.stab };
    case 'SET_CUSTOMER': return { ...s, selectedCustomer: a.id };
    case 'SET_TABLE': return { ...s, selectedTable: a.table };
    case 'SET_CART_OPEN': return { ...s, cartOpen: a.open };
    case 'SET_NAV_OPEN': return { ...s, navOpen: a.open };
    case 'TOGGLE_NAV': return { ...s, navOpen: !s.navOpen };

    /* ---------- cart ---------- */
    case 'CART_INC': {
      const m = s.menu.find(x => x.id === a.id);
      if (!m) return s;
      if (m.mods) return { ...s, modal: { kind: 'mods', itemId: m.id } };
      const i = s.cart.findIndex(x => x.id === a.id && !x.mods.length);
      const cart = i >= 0
        ? s.cart.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l))
        : [...s.cart, { id: a.id, qty: 1, note: '', mods: [] }];
      return { ...s, cart };
    }
    case 'CART_DEC': {
      const i = s.cart.map(x => x.id).lastIndexOf(a.id);
      if (i < 0) return s;
      const l = s.cart[i];
      const cart = l.qty - 1 <= 0
        ? s.cart.filter((_, j) => j !== i)
        : s.cart.map((x, j) => (j === i ? { ...x, qty: x.qty - 1 } : x));
      return { ...s, cart };
    }
    case 'LINE_QTY': {
      const l = s.cart[a.index];
      if (!l) return s;
      const cart = l.qty + a.delta <= 0
        ? s.cart.filter((_, j) => j !== a.index)
        : s.cart.map((x, j) => (j === a.index ? { ...x, qty: x.qty + a.delta } : x));
      return { ...s, cart };
    }
    case 'LINE_REMOVE':
      return { ...s, cart: s.cart.filter((_, j) => j !== a.index) };
    case 'ADD_TO_CART': {
      const mods = a.mod ? [a.mod] : [];
      const i = a.mod ? s.cart.findIndex(x => x.id === a.id && x.mods[0] === a.mod) : -1;
      const cart = i >= 0
        ? s.cart.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l))
        : [...s.cart, { id: a.id, qty: 1, note: '', mods }];
      return { ...s, cart };
    }
    case 'SET_LAST_NOTE': {
      if (!s.cart.length) return s;
      const cart = s.cart.map((l, j) => (j === s.cart.length - 1 ? { ...l, note: a.note } : l));
      return { ...s, cart, modal: null };
    }
    case 'APPLY_VOUCHER': {
      const p = s.promos.find(x => x.code && x.code === a.code.trim().toUpperCase() && x.active);
      if (!p) return { ...s, modal: null, toast: toast('That code isn’t valid or is paused') };
      return {
        ...s, modal: null,
        discount: { type: 'voucher', value: p.value, label: p.code },
        promos: s.promos.map(x => (x === p ? { ...x, uses: x.uses + 1 } : x)),
        toast: toast(`${p.code} applied · ${p.value}% off`),
      };
    }
    case 'APPLY_DISCOUNT': {
      const n = parseFloat(a.raw);
      if (!n) return { ...s, modal: null };
      const discount: Discount = /egp|le/i.test(a.raw)
        ? { type: 'amt', value: n, label: 'Manager discount' }
        : { type: 'pct', value: Math.min(100, n), label: `Manager ${n}%` };
      return { ...s, discount, modal: null, toast: toast('Discount applied · logged for audit') };
    }
    case 'CLEAR_CART':
      return { ...s, ...resetCart(s), toast: s.cart.length ? toast('Order cleared') : s.toast };

    /* ---------- order lifecycle ---------- */
    case 'SEND_ORDER': {
      if (!s.cart.length) return s;
      if (!s.shift) {
        return { ...s, modal: { kind: 'shift-open' }, toast: toast('Open a shift before taking orders') };
      }
      if (s.orderType === 'Dine in' && !s.selectedTable) {
        return { ...s, cartOpen: true, toast: toast('Choose a table for this dine-in order') };
      }
      const c = s.customers.find(x => x.id === +s.selectedCustomer);
      const lines = s.cart.map(l => ({ ...l, mods: [...l.mods] }));
      const o: Order = {
        no: s.currentOrderNo,
        customer: c ? c.name : 'Walk-in',
        custId: c ? c.id : null,
        type: s.orderType,
        table: s.orderType === 'Dine in' ? s.selectedTable : '',
        status: 'New', lines, time: Date.now(), paid: false, tender: null,
        voided: [], discLabel: s.discount.label || undefined, offline: !s.online || undefined,
        ...calc(s.menu, lines, s.discount, s.orderType), disc: 0,
      };
      o.disc = o.d;
      const { ings, cost } = depleteFor(s.menu, s.ingredients, o);
      const nextNo = s.nextNo + 1;
      return {
        ...s, orders: [...s.orders, o], ingredients: ings, depleted: s.depleted + cost,
        nextNo, lineType: s.orderType,
        ...resetCart({ ...s, nextNo }),
        modal: a.payNow ? { kind: 'pay', orderNo: o.no } : null,
        toast: a.payNow ? s.toast : toast(`Order #${o.no} sent to kitchen${s.online ? '' : ' · queued offline'}`),
      };
    }
    case 'ADVANCE': {
      const o = s.orders.find(x => x.no === a.no);
      if (!o) return s;
      const i = ORDER_STATUSES.indexOf(o.status);
      if (i < 0 || i === ORDER_STATUSES.length - 1) {
        return { ...s, toast: toast(`Order #${a.no} is ${o.status.toLowerCase()}`) };
      }
      if (o.status === 'Ready to serve' && !o.paid) {
        return { ...s, modal: { kind: 'pay', orderNo: a.no }, toast: toast('Take payment before completing this order') };
      }
      const status = ORDER_STATUSES[i + 1];
      return { ...s, orders: mapOrder(s.orders, a.no, x => ({ ...x, status })), toast: toast(`Order #${a.no} · ${status}`) };
    }
    case 'SET_STATUS':
      return {
        ...s,
        orders: mapOrder(s.orders, a.no, x => ({ ...x, status: a.status })),
        toast: toast(`#${a.no} · ${a.status}`),
      };
    case 'CANCEL_ORDER': {
      const o = s.orders.find(x => x.no === a.no);
      if (!o) return { ...s, modal: null };
      if (o.paid) return { ...s, modal: null, toast: toast('Refund it from Orders first') };
      return {
        ...s, modal: null,
        orders: mapOrder(s.orders, a.no, x => ({ ...x, status: 'Cancelled', cancelReason: a.reason || 'Not given' })),
        toast: toast(`Order #${a.no} cancelled`),
      };
    }
    case 'REFUND': {
      const o = s.orders.find(x => x.no === a.no);
      if (!o || !o.paid) return { ...s, modal: null };
      return {
        ...s, modal: null,
        orders: mapOrder(s.orders, a.no, x => ({
          ...x, refunded: true, status: 'Cancelled', cancelReason: 'Refund: ' + (a.reason || 'Not given'),
        })),
        toast: toast(`Refunded ${fmt(o.total)}`),
      };
    }
    case 'REQUEST_BILL':
      return {
        ...s, modal: null,
        orders: mapOrder(s.orders, a.no, x => ({ ...x, billReq: true })),
        toast: toast('Bill printed for ' + (s.orders.find(x => x.no === a.no)?.table || '')),
      };
    case 'PAY_ORDER': {
      const o = s.orders.find(x => x.no === a.no);
      if (!o || o.paid) return { ...s, modal: null };
      const custId = o.custId;
      return {
        ...s,
        orders: mapOrder(s.orders, a.no, x => ({
          ...x, paid: true, paidAt: Date.now(),
          tender: a.splits.length === 1 ? a.splits[0].tender : 'Split',
          splits: a.splits,
          status: x.status === 'Ready to serve' ? 'Completed' : x.status,
        })),
        customers: custId ? s.customers.map(c => {
          if (c.id !== custId) return c;
          const points = c.points + Math.floor(o.total / 10);
          return { ...c, points, spend: c.spend + o.total, visits: c.visits + 1, tier: points >= 1500 ? 'Black' : points >= 500 ? 'Gold' : 'Silver' };
        }) : s.customers,
        modal: { kind: 'receipt', orderNo: a.no },
      };
    }
    case 'REDEEM_GIFT':
      return {
        ...s,
        giftCards: s.giftCards.map(g => (g.code === a.code ? { ...g, balance: Math.max(0, +(g.balance - a.amount).toFixed(2)) } : g)),
      };
    case 'REDEEM_POINTS':
      return {
        ...s,
        customers: s.customers.map(c => (c.id === a.custId ? { ...c, points: Math.max(0, c.points - a.pts) } : c)),
      };

    /* ---------- shift ---------- */
    case 'OPEN_SHIFT':
      return {
        ...s, modal: null,
        shift: { user: a.user, float: a.float, start: Date.now() },
        toast: toast('Shift opened · ' + a.user),
      };
    case 'CLOSE_SHIFT': {
      if (!s.shift) return { ...s, modal: null };
      const cashSales = s.orders
        .filter(o => o.paid && !o.refunded && (o.paidAt ?? 0) >= s.shift!.start)
        .reduce((sum, o) => sum + (o.splits || []).filter(p => p.tender === 'Cash').reduce((x, p) => x + p.amt, 0), 0);
      const expected = s.shift.float + cashSales;
      const v = a.counted - expected;
      return { ...s, shift: null, modal: null, toast: toast(`Shift closed · variance ${v >= 0 ? '+' : ''}${fmt(v)}`) };
    }
    case 'TOGGLE_NET': {
      const online = !s.online;
      return {
        ...s, online,
        orders: online ? s.orders.map(o => ({ ...o, offline: undefined })) : s.orders,
        toast: toast(online
          ? 'Back online · queue synced'
          : 'Offline · POS keeps working, orders will sync when back'),
      };
    }

    /* ---------- tables ---------- */
    case 'TABLE_SELECT':
      return {
        ...s, view: 'pos', orderType: 'Dine in', selectedTable: 'Table ' + a.n,
        cartOpen: true, toast: toast('Table ' + a.n + ' selected · add dishes'),
      };
    case 'NEW_ORDER_FOR':
      return {
        ...s, view: 'pos', selectedCustomer: String(a.custId), cartOpen: true,
        toast: toast((s.customers.find(c => c.id === a.custId)?.name || '') + ' attached to the current order'),
      };
    case 'ADD_RESERVATION':
      return {
        ...s, modal: null, reservations: [...s.reservations, a.r],
        toast: toast('Reservation added · WhatsApp confirmation sent'),
      };

    /* ---------- menu manager ---------- */
    case 'SET_PRICE': {
      const m = s.menu.find(x => x.id === a.id);
      if (!m || !a.price) return s;
      return {
        ...s,
        menu: s.menu.map(x => (x.id === a.id ? { ...x, price: a.price } : x)),
        toast: toast(`${m.name} price updated · pushed to POS, online & aggregators`),
      };
    }
    case 'TOGGLE_ITEM': {
      const m = s.menu.find(x => x.id === a.id);
      if (!m) return s;
      return {
        ...s,
        menu: s.menu.map(x => (x.id === a.id ? { ...x, off: !x.off } : x)),
        toast: toast(`${m.name} ${m.off ? 'shown on' : 'hidden from'} POS, online and aggregators`),
      };
    }
    case 'ADD_ITEM':
      return {
        ...s, modal: null, menu: [...s.menu, a.item],
        toast: toast(`${a.item.name} added to the menu across 3 branches`),
      };

    /* ---------- inventory & purchasing ---------- */
    case 'LOG_WASTE': {
      const i = s.ingredients.find(x => x.id === a.id);
      if (!i || !a.qty) return { ...s, modal: null };
      return {
        ...s, modal: null,
        ingredients: s.ingredients.map(x => (x.id === a.id ? { ...x, stock: Math.max(0, +(x.stock - a.qty).toFixed(2)) } : x)),
        waste: s.waste + a.qty * i.cost,
        toast: toast(`${a.qty} ${i.unit} ${i.name} logged as ${a.reason.toLowerCase()}`),
      };
    }
    case 'POST_COUNT': {
      let adj = 0;
      const ingredients = s.ingredients.map(i => {
        const v = a.counts[i.id];
        if (v === undefined || v === i.stock) return i;
        adj += Math.abs(v - i.stock) * i.cost;
        return { ...i, stock: v };
      });
      return { ...s, modal: null, ingredients, toast: toast(`Count posted · ${fmt(adj)} in adjustments`) };
    }
    case 'CREATE_POS': {
      const bySup = lowBySupplier(s.ingredients);
      const entries = Object.entries(bySup);
      if (!entries.length) return { ...s, modal: null, toast: toast('Everything is at par — nothing to order') };
      let seq = s.poSeq;
      const newPOs: PurchaseOrder[] = entries.map(([sup, items]) => ({
        no: 'PO-' + seq++, sup,
        lines: items.map(i => `${i.name} ${+(i.par * 1.2 - i.stock).toFixed(1)} ${i.unit}`).join(' · '),
        total: items.reduce((x, i) => x + (i.par * 1.2 - i.stock) * i.cost, 0),
        status: 'Awaiting approval',
        items: items.map(i => ({ id: i.id, qty: +(i.par * 1.2 - i.stock).toFixed(1) })),
      }));
      return {
        ...s, poSeq: seq, purchaseOrders: [...newPOs, ...s.purchaseOrders],
        modal: null, view: 'purchasing',
        toast: toast('Purchase orders created · manager approval requested'),
      };
    }
    case 'PO_STATUS': {
      const p = s.purchaseOrders[a.index];
      if (!p) return s;
      let ingredients = s.ingredients;
      if (a.status === 'Received') {
        ingredients = s.ingredients.map(x => {
          const it = p.items?.find(i => i.id === x.id);
          if (it) return { ...x, stock: +(x.stock + it.qty).toFixed(1) };
          if (!p.items && p.lines.includes(x.name)) return { ...x, stock: +(x.stock + x.par).toFixed(1) };
          return x;
        });
      }
      return {
        ...s, ingredients,
        purchaseOrders: s.purchaseOrders.map((x, i) => (i === a.index ? { ...x, status: a.status } : x)),
        toast: toast(`${p.no} · ${a.status}${a.status === 'Received' ? ' · stock updated' : a.status === 'Sent' ? ' · emailed to supplier' : ''}`),
      };
    }

    /* ---------- customers & promos ---------- */
    case 'ADD_CUSTOMER':
      return {
        ...s, modal: null,
        customers: [...s.customers, {
          id: Math.max(0, ...s.customers.map(c => c.id)) + 1,
          name: a.name, phone: a.phone, visits: 0, spend: 0, points: 0, tier: 'Silver',
        }],
        toast: toast(a.name + ' added'),
      };
    case 'TOGGLE_PROMO': {
      const p = s.promos[a.index];
      if (!p) return s;
      return {
        ...s,
        promos: s.promos.map((x, i) => (i === a.index ? { ...x, active: !x.active } : x)),
        toast: toast(`${p.name} ${p.active ? 'paused' : 'activated'}`),
      };
    }
    case 'ADD_PROMO':
      return {
        ...s, modal: null,
        promos: [...s.promos, { code: a.code.toUpperCase(), name: a.name, type: a.code ? 'Coupon' : 'Promotion', value: a.value, active: true, uses: 0 }],
        toast: toast(a.name + ' is live'),
      };
    case 'SELL_GIFT':
      return {
        ...s, modal: null,
        giftCards: [...s.giftCards, { code: 'GC-' + (4480 + s.giftCards.length), balance: a.amount }],
        toast: toast('Gift card sold · ' + fmt(a.amount)),
      };
    case 'TOGGLE_INTEGRATION': {
      const x = s.integrations[a.index];
      if (!x) return s;
      return {
        ...s,
        integrations: s.integrations.map((it, i) => (i === a.index ? { ...it, on: !it.on } : it)),
        toast: toast(`${x.name} ${x.on ? 'disconnected' : 'connected'}`),
      };
    }

    /* ---------- modal & toast ---------- */
    case 'OPEN_MODAL': return { ...s, modal: a.modal };
    case 'OPEN_PROMPT': return { ...s, modal: { kind: 'prompt', prompt: a.prompt, orderNo: a.orderNo } };
    case 'CLOSE_MODAL': return { ...s, modal: null };
    case 'TOAST': return { ...s, toast: toast(a.msg) };
    case 'DISMISS_TOAST': return { ...s, toast: null };
    case 'TICK': return { ...s, tick: s.tick + 1 };
    default: return s;
  }
}
