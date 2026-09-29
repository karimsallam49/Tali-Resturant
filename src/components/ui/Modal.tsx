import type { ReactNode } from 'react';
import { useApp } from '../../store/AppContext';

/** Backdrop modal — children render inside .dlg. Dispatches CLOSE_MODAL on backdrop click. */
export default function Modal({ children, title }: { children: ReactNode; title: ReactNode }) {
  const { dispatch } = useApp();
  return (
    <div className="modal open" onClick={e => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL' }); }}>
      <div className="dlg">
        <h3>{title}<button className="x" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>×</button></h3>
        {children}
      </div>
    </div>
  );
}
