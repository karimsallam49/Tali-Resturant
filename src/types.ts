export type OrderType = 'Dine in' | 'Take away' | 'Delivery';
export type OrderStatus = 'New' | 'In progress' | 'Ready to serve' | 'Completed' | 'Cancelled';
export type Station = 'All' | 'Hot' | 'Grill' | 'Cold' | 'Bar' | 'Expo';
export type OrderFilter = 'all' | 'open' | 'unpaid' | 'done' | 'cancelled';
export type ReportTab = 'sales' | 'products' | 'payments' | 'tax' | 'staff' | 'voids';
export type SettingsTab = 'branches' | 'users' | 'tax' | 'integrations' | 'devices';
export type ViewId =
  | 'pos' | 'tables' | 'kds' | 'orders' | 'home' | 'menu'
  | 'inventory' | 'purchasing' | 'customers' | 'promos' | 'reports' | 'settings';

export interface Branch { id: string; name: string; city: string; online: boolean }
export interface Ingredient { id: string; name: string; unit: string; stock: number; par: number; cost: number; sup: string }
export interface MenuItem {
  id: number; cat: string; name: string; price: number; icon: string;
  recipe: Record<string, number>; mods?: string; off?: boolean;
}
export interface ModGroup { name: string; opts: [string, number][] }
export interface Supplier { name: string; terms: string; phone: string }
export interface Customer {
  id: number; name: string; phone: string; visits: number;
  spend: number; points: number; tier: string;
}
export interface Promo {
  code: string; name: string; type: string; value: number;
  active: boolean; uses: number; note?: string;
}
export interface GiftCard { code: string; balance: number }
export interface PurchaseOrder {
  no: string; sup: string; lines: string; total: number;
  status: 'Awaiting approval' | 'Sent' | 'Received';
  items?: { id: string; qty: number }[];
}
export interface Reservation { name: string; time: string; covers: number; table: number }
export interface StaffUser { name: string; role: string; pin: string; branch: string }
export interface Integration { name: string; cat: string; on: boolean }
export interface TableInfo { n: number; seats: number }

export interface CartLine { id: number; qty: number; note: string; mods: string[] }
export interface Split { tender: string; amt: number; given?: number }

export interface Order {
  no: number;
  customer: string;
  custId: number | null;
  type: OrderType;
  table: string;
  status: OrderStatus;
  lines: CartLine[];
  time: number;
  paid: boolean;
  paidAt?: number;
  tender: string | null;
  splits?: Split[];
  sub: number;
  d: number;
  disc: number;
  discLabel?: string;
  svc: number;
  vat: number;
  total: number;
  voided: unknown[];
  cancelReason?: string;
  billReq?: boolean;
  refunded?: boolean;
  offline?: boolean;
}

export interface Discount { type: 'pct' | 'amt' | 'voucher' | null; value: number; label: string }
export interface Shift { user: string; float: number; start: number }

export type PromptKind =
  | 'note' | 'voucher' | 'discount' | 'cancel-order' | 'refund'
  | 'reservation' | 'customer' | 'promo' | 'gift';

export type ModalState =
  | { kind: 'prompt'; prompt: PromptKind; orderNo?: number }
  | { kind: 'mods'; itemId: number }
  | { kind: 'pay'; orderNo: number }
  | { kind: 'receipt'; orderNo: number }
  | { kind: 'shift-open' }
  | { kind: 'shift-close' }
  | { kind: 'table'; table: number }
  | { kind: 'item-form' }
  | { kind: 'waste' }
  | { kind: 'count' }
  | { kind: 'auto-po' };
