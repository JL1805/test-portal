import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { FlowPage } from './pages/FlowPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/firma/:uuid" element={<FlowPage />} />
        <Route path="*" element={<Navigate to="/firma/550e8400-e29b-41d4-a716-446655440000" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
