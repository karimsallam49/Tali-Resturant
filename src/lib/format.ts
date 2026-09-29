import type { Order, OrderStatus } from '../types';

export const fmt = (n: number) => 'EGP ' + (+n).toFixed(2);
export const num = (n: number) => Math.round(n).toLocaleString();

export const ago = (t: number) => {
  const m = Math.max(1, Math.round((Date.now() - t) / 60000));
  return m < 60 ? m + ' min ago' : Math.round(m / 60) + ' h ago';
};

export const mins = (t: number) => Math.round((Date.now() - t) / 60000);

export const cls = (s: OrderStatus): string =>
  ({ New: 'new', 'In progress': 'progress', 'Ready to serve': 'ready', Completed: 'done', Cancelled: 'cancelled' })[s];

export const barColor = (s: OrderStatus): string =>
  ({ New: 'var(--amber)', 'In progress': 'var(--purple)', 'Ready to serve': 'var(--lime)', Completed: 'var(--white)', Cancelled: 'var(--red)' })[s];

export const initials = (n: string) => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export const isOpen = (o: Order) => !['Completed', 'Cancelled'].includes(o.status);
