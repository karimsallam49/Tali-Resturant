export default function Toggle({ checked, onChange, label }: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <button className="tog" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} />
  );
}
