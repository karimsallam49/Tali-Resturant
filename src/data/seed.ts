import type {
  CartLine, Customer, GiftCard, Ingredient, Integration, MenuItem,
  Order, OrderStatus, OrderType, Promo, PurchaseOrder, Reservation,
} from '../types';
import { calc } from '../lib/calc';

export const SEED_ING: Ingredient[] = [
  { id: 'rice', name: 'Rice', unit: 'kg', stock: 18, par: 20, cost: 28, sup: 'Al Ahram Foods' },
  { id: 'lentil', name: 'Lentils', unit: 'kg', stock: 6, par: 8, cost: 45, sup: 'Al Ahram Foods' },
  { id: 'pasta', name: 'Pasta', unit: 'kg', stock: 9, par: 10, cost: 32, sup: 'Al Ahram Foods' },
  { id: 'chick', name: 'Chicken', unit: 'kg', stock: 14, par: 15, cost: 120, sup: 'Cairo Poultry' },
  { id: 'beef', name: 'Beef', unit: 'kg', stock: 4.5, par: 10, cost: 380, sup: 'Cairo Poultry' },
  { id: 'molo', name: 'Molokhia', unit: 'kg', stock: 3, par: 5, cost: 60, sup: 'Green Valley' },
  { id: 'veg', name: 'Mixed vegetables', unit: 'kg', stock: 12, par: 10, cost: 25, sup: 'Green Valley' },
  { id: 'tahini', name: 'Tahini', unit: 'kg', stock: 2, par: 4, cost: 150, sup: 'Al Ahram Foods' },
  { id: 'bread', name: 'Baladi bread', unit: 'pc', stock: 120, par: 150, cost: 2.5, sup: 'Bakery Co' },
  { id: 'mango', name: 'Mango pulp', unit: 'l', stock: 5, par: 6, cost: 90, sup: 'Green Valley' },
  { id: 'hib', name: 'Hibiscus', unit: 'kg', stock: 1.2, par: 2, cost: 110, sup: 'Al Ahram Foods' },
  { id: 'milk', name: 'Milk', unit: 'l', stock: 10, par: 12, cost: 38, sup: 'Juhayna' },
  { id: 'sugar', name: 'Sugar', unit: 'kg', stock: 7, par: 8, cost: 30, sup: 'Al Ahram Foods' },
  { id: 'nuts', name: 'Mixed nuts', unit: 'kg', stock: 1.5, par: 2, cost: 420, sup: 'Al Ahram Foods' },
  { id: 'kona', name: 'Konafa dough', unit: 'kg', stock: 0, par: 3, cost: 70, sup: 'Bakery Co' },
];

export const SEED_MENU: MenuItem[] = [
  { id: 1, cat: 'Main course', name: 'Koshary', price: 65, icon: '🍝', recipe: { rice: .12, lentil: .08, pasta: .1, veg: .05 }, mods: 'size' },
  { id: 2, cat: 'Main course', name: 'Molokhia with rice', price: 95, icon: '🥬', recipe: { molo: .15, rice: .15, chick: .1 }, mods: 'protein' },
  { id: 3, cat: 'Main course', name: 'Chicken fattah', price: 140, icon: '🍛', recipe: { rice: .2, chick: .25, bread: 2 } },
  { id: 4, cat: 'Main course', name: 'Hawawshi', price: 85, icon: '🥙', recipe: { beef: .15, bread: 1, veg: .03 } },
  { id: 5, cat: 'Main course', name: 'Ful & taameya plate', price: 55, icon: '🧆', recipe: { bread: 2, veg: .08, tahini: .03 } },
  { id: 6, cat: 'Main course', name: 'Shawarma wrap', price: 90, icon: '🌯', recipe: { chick: .18, bread: 1, tahini: .02, veg: .04 }, mods: 'protein' },
  { id: 7, cat: 'Grills', name: 'Mixed grill', price: 260, icon: '🍢', recipe: { beef: .25, chick: .2, veg: .1, bread: 2 } },
  { id: 8, cat: 'Grills', name: 'Kofta skewers', price: 150, icon: '🍡', recipe: { beef: .22, bread: 2, veg: .05 } },
  { id: 9, cat: 'Grills', name: 'Grilled chicken half', price: 135, icon: '🍗', recipe: { chick: .5, rice: .1 } },
  { id: 10, cat: 'Soup', name: 'Lentil soup', price: 45, icon: '🍲', recipe: { lentil: .1, veg: .05 } },
  { id: 11, cat: 'Soup', name: 'Orzo soup', price: 40, icon: '🥣', recipe: { pasta: .06, chick: .05 } },
  { id: 12, cat: 'Salads', name: 'Baladi salad', price: 35, icon: '🥗', recipe: { veg: .2 } },
  { id: 13, cat: 'Salads', name: 'Tahini & baba ghanoush', price: 40, icon: '🥙', recipe: { tahini: .06, veg: .1, bread: 1 } },
  { id: 14, cat: 'Drinks', name: 'Mango juice', price: 50, icon: '🥭', recipe: { mango: .25, sugar: .02 }, mods: 'size' },
  { id: 15, cat: 'Drinks', name: 'Karkade', price: 35, icon: '🧃', recipe: { hib: .03, sugar: .03 }, mods: 'size' },
  { id: 16, cat: 'Drinks', name: 'Sahlab', price: 45, icon: '☕', recipe: { milk: .25, sugar: .02, nuts: .01 } },
  { id: 17, cat: 'Dessert', name: 'Om Ali', price: 70, icon: '🍮', recipe: { milk: .2, nuts: .03, sugar: .03, bread: 1 } },
  { id: 18, cat: 'Dessert', name: 'Konafa', price: 80, icon: '🥧', recipe: { kona: .15, nuts: .02, sugar: .05 } },
  { id: 19, cat: 'Dessert', name: 'Basbousa', price: 40, icon: '🍯', recipe: { sugar: .06, milk: .05, nuts: .01 } },
];

export const SEED_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Leslie Alexander', phone: '0100 123 4567', visits: 14, spend: 4120, points: 412, tier: 'Silver' },
  { id: 2, name: 'Sara Adel', phone: '0122 987 6543', visits: 31, spend: 9800, points: 980, tier: 'Gold' },
  { id: 3, name: 'Omar Hassan', phone: '0111 555 1212', visits: 6, spend: 1450, points: 145, tier: 'Silver' },
  { id: 4, name: 'Nour Kamel', phone: '0106 321 9876', visits: 52, spend: 18200, points: 1820, tier: 'Black' },
  { id: 5, name: 'Esther Howard', phone: '0128 444 0000', visits: 2, spend: 380, points: 38, tier: 'Silver' },
];

export const SEED_PROMOS: Promo[] = [
  { code: 'TALI10', name: 'Welcome 10%', type: 'Coupon', value: 10, active: true, uses: 23 },
  { code: 'RAMADAN20', name: 'Iftar 20% off', type: 'Coupon', value: 20, active: true, uses: 140 },
  { code: '', name: 'Happy hour drinks −30%', type: 'Timed event', value: 30, active: false, uses: 0, note: 'Weekdays 16:00–18:00 · Drinks' },
  { code: '', name: 'Buy 2 koshary get 1 lentil soup', type: 'Promotion', value: 0, active: true, uses: 11 },
];

export const SEED_GIFT: GiftCard[] = [
  { code: 'GC-4471', balance: 150 },
  { code: 'GC-4472', balance: 420 },
  { code: 'GC-4480', balance: 0 },
];

export const SEED_POS: PurchaseOrder[] = [
  { no: 'PO-1041', sup: 'Cairo Poultry', lines: 'Beef 10 kg · Chicken 10 kg', total: 5000, status: 'Awaiting approval' },
  { no: 'PO-1040', sup: 'Bakery Co', lines: 'Baladi bread 300 pc', total: 750, status: 'Received' },
  { no: 'PO-1039', sup: 'Al Ahram Foods', lines: 'Rice 25 kg · Lentils 10 kg · Pasta 10 kg', total: 1470, status: 'Sent' },
];

export const SEED_RESV: Reservation[] = [
  { name: 'Family Mansour', time: '19:30', covers: 6, table: 7 },
  { name: 'A. Youssef', time: '20:00', covers: 2, table: 2 },
  { name: 'Birthday · Dina', time: '21:00', covers: 10, table: 8 },
];

export const SEED_INTEGRATIONS: Integration[] = [
  { name: 'Talabat', cat: 'Delivery aggregator', on: true },
  { name: 'elmenus', cat: 'Delivery aggregator', on: true },
  { name: 'Noon Food', cat: 'Delivery aggregator', on: false },
  { name: 'Fawry', cat: 'Payments', on: true },
  { name: 'InstaPay', cat: 'Payments', on: true },
  { name: 'ETA e-receipts', cat: 'Compliance', on: true },
  { name: 'QuickBooks', cat: 'Accounting', on: false },
  { name: 'WhatsApp Business', cat: 'Marketing', on: true },
];

const FIRST_ORDER_NO = 6836457;

interface SeedArgs {
  customer: string; type: OrderType; table: string;
  lines: [number, number, string[]?][];
  status: OrderStatus; minsAgo: number; paid: boolean;
  tender: string | null; custId?: number; cancelReason?: string;
}

/** Rebuilds the demo order book exactly like the original seed() calls. */
export function buildSeedOrders(menu: MenuItem[]): { orders: Order[]; nextNo: number } {
  let nextNo = FIRST_ORDER_NO;
  const defs: SeedArgs[] = [
    { customer: 'Leslie Alexander', type: 'Dine in', table: 'Table 6', lines: [[1, 2], [10, 1]], status: 'Ready to serve', minsAgo: 6, paid: false, tender: null, custId: 1 },
    { customer: 'Sara Adel', type: 'Dine in', table: 'Table 3', lines: [[7, 1], [12, 2], [14, 2, ['Large']]], status: 'In progress', minsAgo: 4, paid: false, tender: null, custId: 2 },
    { customer: 'Omar Hassan', type: 'Take away', table: '', lines: [[6, 2, ['Beef']], [15, 1]], status: 'Completed', minsAgo: 12, paid: true, tender: 'Card', custId: 3 },
    { customer: 'Nour Kamel', type: 'Delivery', table: '', lines: [[3, 1], [17, 1]], status: 'Cancelled', minsAgo: 9, paid: false, tender: null, custId: 4, cancelReason: 'Customer cancelled' },
    { customer: 'Esther Howard', type: 'Dine in', table: 'Table 1', lines: [[9, 1], [13, 1], [16, 2]], status: 'New', minsAgo: 1, paid: false, tender: null, custId: 5 },
    { customer: 'Walk-in', type: 'Take away', table: '', lines: [[1, 1], [14, 1]], status: 'Completed', minsAgo: 35, paid: true, tender: 'Cash' },
    { customer: 'Walk-in', type: 'Take away', table: '', lines: [[5, 2], [15, 2]], status: 'Completed', minsAgo: 58, paid: true, tender: 'InstaPay' },
    { customer: 'Talabat #88213', type: 'Delivery', table: '', lines: [[8, 1], [12, 1], [14, 1]], status: 'Completed', minsAgo: 75, paid: true, tender: 'Card' },
    { customer: 'Walk-in', type: 'Dine in', table: 'Table 4', lines: [[2, 1], [10, 1], [16, 1]], status: 'Completed', minsAgo: 110, paid: true, tender: 'Cash' },
  ];

  const orders = defs.map(d => {
    const lines: CartLine[] = d.lines.map(([id, qty, mods]) => ({ id, qty, note: '', mods: mods || [] }));
    const o: Order = {
      no: nextNo++, customer: d.customer, custId: d.custId ?? null, type: d.type,
      table: d.table, status: d.status, lines, time: Date.now() - d.minsAgo * 60000,
      paid: d.paid, tender: d.tender, voided: [], disc: 0, cancelReason: d.cancelReason,
      ...calc(menu, lines, { type: null, value: 0, label: '' }, d.type),
    };
    if (d.paid) {
      o.paidAt = o.time + 2 * 60000;
      o.splits = [{ tender: d.tender!, amt: o.total }];
    }
    return o;
  });
  return { orders, nextNo };
}
