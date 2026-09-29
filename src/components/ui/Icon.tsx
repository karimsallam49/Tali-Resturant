import type { ReactNode } from 'react';

const PATHS: Record<string, ReactNode> = {
  pos: (<><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>),
  tables: (<><rect x="3" y="8" width="18" height="8" rx="2" /><path d="M6 16v4M18 16v4M6 4v4M18 4v4" /></>),
  kds: (<><path d="M8 3v7a4 4 0 0 0 8 0V3" /><path d="M12 14v7M4 21h16" /></>),
  orders: (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>),
  home: (<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" />),
  menu: (<path d="M4 6h16M4 12h16M4 18h10" />),
  inventory: (<><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>),
  purchasing: (<><path d="M3 4h2l2 12h11l2-8H7" /><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></>),
  customers: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-5-6.3" /></>),
  promos: (<path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z" />),
  reports: (<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>),
  arrow: (<path d="M7 17 17 7M9 7h8v8" />),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  note: (<path d="M4 20h4l10-10-4-4L4 16z" />),
  voucher: (<path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z" />),
  percent: (<path d="M19 5 5 19M7 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />),
};

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{PATHS[name]}</svg>;
}
