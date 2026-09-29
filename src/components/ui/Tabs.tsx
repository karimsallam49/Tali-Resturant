export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export default function Tabs({ items, selected, onSelect, white }: {
  items: TabItem[];
  selected: string;
  onSelect: (key: string) => void;
  white?: boolean;
}) {
  return (
    <div className={`tabs${white ? ' white' : ''}`} role="tablist">
      {items.map(t => (
        <button key={t.key} role="tab" aria-selected={t.key === selected} onClick={() => onSelect(t.key)}>
          {t.label}
          {t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
