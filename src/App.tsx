import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { FlowPage } from './pages/FlowPage';
import { getFlowEntries } from './config/flows';

const flowEntries = getFlowEntries();

export default function App() {
  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        {flowEntries.map((entry) => (
          <Route
            key={entry.flowType}
            path={entry.routePattern}
            element={<FlowPage flowType={entry.flowType} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/firmar/550e8400-e29b-41d4-a716-446655440000" replace />} />
      </Routes>
    </HashRouter>
  );
}
