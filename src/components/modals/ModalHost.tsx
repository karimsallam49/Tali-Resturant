import { useApp } from '../../store/AppContext';
import AutoPOModal from './AutoPOModal';
import CountModal from './CountModal';
import ItemFormModal from './ItemFormModal';
import ModsModal from './ModsModal';
import PaymentModal from './PaymentModal';
import PromptModal from './PromptModal';
import ReceiptModal from './ReceiptModal';
import ShiftModal from './ShiftModal';
import TableModal from './TableModal';
import WasteModal from './WasteModal';

export default function ModalHost() {
  const { state } = useApp();
  const m = state.modal;
  if (!m) return null;

  switch (m.kind) {
    case 'prompt': return <PromptModal prompt={m.prompt} orderNo={m.orderNo} />;
    case 'mods': return <ModsModal itemId={m.itemId} />;
    case 'pay': return <PaymentModal orderNo={m.orderNo} />;
    case 'receipt': return <ReceiptModal orderNo={m.orderNo} />;
    case 'shift-open': return <ShiftModal mode="shift-open" />;
    case 'shift-close': return <ShiftModal mode="shift-close" />;
    case 'table': return <TableModal table={m.table} />;
    case 'item-form': return <ItemFormModal />;
    case 'waste': return <WasteModal />;
    case 'count': return <CountModal />;
    case 'auto-po': return <AutoPOModal />;
    default: return null;
  }
}
