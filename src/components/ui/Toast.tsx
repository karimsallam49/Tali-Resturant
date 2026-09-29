import { useEffect } from 'react';
import { useApp } from '../../store/AppContext';

export default function Toast() {
  const { state, dispatch } = useApp();
  const t = state.toast;

  useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => dispatch({ type: 'DISMISS_TOAST' }), 2400);
    return () => clearTimeout(id);
  }, [t, dispatch]);

  return (
    <div className={`toast${t ? ' show' : ''}`} role="status" aria-live="polite">
      {t?.msg}
    </div>
  );
}
