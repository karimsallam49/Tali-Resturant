import type { Branch, ModGroup, OrderStatus, StaffUser, Station, Supplier, TableInfo, ViewId } from '../types';

export const VAT = 0.14;
export const SERVICE = 0.12;

export const BRANCHES: Branch[] = [
  { id: 'maadi', name: 'Maadi', city: 'Cairo', online: true },
  { id: 'zamalek', name: 'Zamalek', city: 'Cairo', online: true },
  { id: 'sheikh', name: 'Sheikh Zayed', city: 'Giza', online: false },
];

export const CATS = ['Main course', 'Grills', 'Soup', 'Salads', 'Drinks', 'Dessert'];

export const STATION: Record<string, Station> = {
  'Main course': 'Hot', Grills: 'Grill', Soup: 'Hot', Salads: 'Cold', Drinks: 'Bar', Dessert: 'Cold',
};

export const MODGROUPS: Record<string, ModGroup> = {
  size: { name: 'Size', opts: [['Regular', 0], ['Large', 15]] },
  protein: { name: 'Protein', opts: [['Chicken', 0], ['Beef', 25], ['Extra meat', 35]] },
};

export const SUPPLIERS: Supplier[] = [
  { name: 'Al Ahram Foods', terms: 'Net 15', phone: '0100 111 2233' },
  { name: 'Cairo Poultry', terms: 'COD', phone: '0122 444 5566' },
  { name: 'Green Valley', terms: 'Net 7', phone: '0111 777 8899' },
  { name: 'Bakery Co', terms: 'Daily', phone: '0106 222 3344' },
  { name: 'Juhayna', terms: 'Net 30', phone: '19222' },
];

export const USERS: StaffUser[] = [
  { name: 'Mahmoud Fathy', role: 'Cashier', pin: '••••', branch: 'Maadi' },
  { name: 'Karim Adel', role: 'Kitchen', pin: '••••', branch: 'Maadi' },
  { name: 'Noura Samir', role: 'Branch manager', pin: '••••', branch: 'Maadi' },
  { name: 'Dina Lotfy', role: 'Accountant', pin: '••••', branch: 'All' },
  { name: 'Tariq Nabil', role: 'Owner', pin: '••••', branch: 'All' },
];

export const ROLES: Record<string, string[]> = {
  Cashier: ['Take orders', 'Accept payments'],
  Kitchen: ['View KDS', 'Bump tickets'],
  'Branch manager': ['Void & refund', 'Discounts', 'Shift close', 'Inventory counts'],
  Accountant: ['Reports', 'Exports', 'Tax'],
  Owner: ['Everything'],
};

export const ORDER_STATUSES: OrderStatus[] = ['New', 'In progress', 'Ready to serve', 'Completed'];

export const TENDERS = ['Cash', 'Card', 'InstaPay', 'Fawry', 'Gift card', 'Points'] as const;

export const AVATAR_COLORS = ['#7A1FE0', '#3B82F6', '#F0605A', '#F5C542', '#C8F000'];

export const TABLES: TableInfo[] = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ n, seats: n > 6 ? 8 : 4 }));

export const TITLES: Record<ViewId, string> = {
  pos: 'Point of Sale', tables: 'Tables & reservations', kds: 'Kitchen display',
  orders: 'Orders', home: 'Dashboard', menu: 'Menu manager', inventory: 'Inventory',
  purchasing: 'Purchasing', customers: 'Customers & loyalty', promos: 'Promotions',
  reports: 'Reports', settings: 'Settings',
};
