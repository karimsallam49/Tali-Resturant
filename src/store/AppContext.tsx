import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { initialState, reducer } from './reducer';
import type { Action, AppState } from './reducer';

const AppCtx = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // 30s tick to keep "x min ago" labels and KDS timers fresh
  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'TICK' }), 30000);
    return () => clearInterval(t);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
