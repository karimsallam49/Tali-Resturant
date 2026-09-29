import Icon from './Icon';

export default function KpiCard({ title, value, label, tone }: {
  title: string;
  value: string | number;
  label: string;
  tone?: 'lime' | 'white' | 'purple';
}) {
  return (
    <div className={`kpi${tone ? ' ' + tone : ''}`}>
      <div className="h">{title} <Icon name="arrow" className="arrow" /></div>
      <div>
        <div className="v">{value}</div>
        <div className="l">{label}</div>
      </div>
    </div>
  );
}
