import { MODGROUPS, VAT, SERVICE } from '../data/constants';
import type { CartLine, Discount, Ingredient, MenuItem, Order, OrderType } from '../types';

export function modPrice(m: MenuItem, mods?: string[]): number {
  if (!m.mods || !mods) return 0;
  return mods.reduce((s, n) => {
    const o = MODGROUPS[m.mods!].opts.find(x => x[0] === n);
    return s + (o ? o[1] : 0);
  }, 0);
}

export function linePrice(menu: MenuItem[], l: CartLine): number {
  const m = menu.find(x => x.id === l.id);
  return m ? (m.price + modPrice(m, l.mods)) * l.qty : 0;
}

export interface Totals { sub: number; d: number; svc: number; vat: number; total: number }

export function calc(menu: MenuItem[], lines: CartLine[], disc: Discount, type: OrderType): Totals {
  const sub = lines.reduce((s, l) => s + linePrice(menu, l), 0);
  let d = 0;
  if (disc.type === 'pct' || disc.type === 'voucher') d = sub * disc.value / 100;
  else if (disc.type === 'amt') d = Math.min(sub, disc.value);
  const svc = type === 'Dine in' ? (sub - d) * SERVICE : 0;
  const vat = (sub - d + svc) * VAT;
  return { sub, d, svc, vat, total: sub - d + svc + vat };
}

export function cogs(menu: MenuItem[], ings: Ingredient[], lines: CartLine[]): number {
  return lines.reduce((s, l) => {
    const m = menu.find(x => x.id === l.id);
    if (!m) return s;
    return s + Object.entries(m.recipe || {}).reduce((a, [k, q]) => {
      const i = ings.find(x => x.id === k);
      return a + q * (i ? i.cost : 0);
    }, 0) * l.qty;
  }, 0);
}

/** Deducts recipe ingredients for an order. Returns updated ingredients + the cost consumed. */
export function depleteFor(menu: MenuItem[], ings: Ingredient[], o: Order): { ings: Ingredient[]; cost: number } {
  let cost = 0;
  const next = ings.map(i => ({ ...i }));
  o.lines.forEach(l => {
    const m = menu.find(x => x.id === l.id);
    if (!m) return;
    Object.entries(m.recipe || {}).forEach(([k, q]) => {
      const i = next.find(x => x.id === k);
      if (!i) return;
      const used = q * l.qty;
      i.stock = Math.max(0, +(i.stock - used).toFixed(2));
      cost += used * i.cost;
    });
  });
  return { ings: next, cost };
}

export const available = (ings: Ingredient[], m: MenuItem): boolean =>
  Object.entries(m.recipe || {}).every(([k, q]) => {
    const i = ings.find(x => x.id === k);
    return !!i && i.stock >= q;
  });

/** Groups below-par ingredients by supplier — basis for suggested purchase orders. */
export function lowBySupplier(ings: Ingredient[]): Record<string, Ingredient[]> {
  const bySup: Record<string, Ingredient[]> = {};
  ings.filter(i => i.stock < i.par).forEach(i => (bySup[i.sup] = bySup[i.sup] || []).push(i));
  return bySup;
}
