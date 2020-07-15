import { h } from 'preact';

export function Checkbox({ label, ...props }) {
  return (
    <label>
      <input
        type="checkbox"
        {...props}
      />
      {' '}
      {label}
    </label>
  );
}
