import type { ComponentType } from 'react';
import OrderPanel from './components/layout/OrderPanel';
import SideRail from './components/layout/SideRail';
import TopBar from './components/layout/TopBar';
import ModalHost from './components/modals/ModalHost';
import Toast from './components/ui/Toast';
import { AppProvider, useApp } from './store/AppContext';
import type { ViewId } from './types';
import CustomersView from './views/CustomersView';
import DashboardView from './views/DashboardView';
import InventoryView from './views/InventoryView';
import KdsView from './views/KdsView';
import MenuView from './views/MenuView';
import OrdersView from './views/OrdersView';
import PosView from './views/PosView';
import PromosView from './views/PromosView';
import PurchasingView from './views/PurchasingView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import TablesView from './views/TablesView';

const VIEWS: Record<ViewId, ComponentType> = {
  pos: PosView, tables: TablesView, kds: KdsView, orders: OrdersView,
  home: DashboardView, menu: MenuView, inventory: InventoryView,
  purchasing: PurchasingView, customers: CustomersView, promos: PromosView,
  reports: ReportsView, settings: SettingsView,
};

function Shell() {
  const { state, dispatch } = useApp();
  const View = VIEWS[state.view];
  const showSide = state.view === 'pos';

  return (
    <div className={`device${showSide ? ' with-side' : ''}${state.navOpen ? ' nav-open' : ''}`}>
      <TopBar />
      <SideRail />
      <div className="nav-scrim" onClick={() => dispatch({ type: 'SET_NAV_OPEN', open: false })} />
      <main className="main">
        <View key={state.view} />
      </main>
      {showSide && <OrderPanel />}
      <ModalHost />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
