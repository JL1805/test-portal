import { useState } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { firmaService } from '../../api/firmaService';
import { showToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface DecisionStepProps {
  onBack?: () => void;
}

export function DecisionStep({ onBack }: DecisionStepProps) {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const setDecision = useFirmaStore((s) => s.setDecision);
  const setCompletado = useFirmaStore((s) => s.setCompletado);
  const setCargando = useFirmaStore((s) => s.setCargando);

  const [modalAceptar, setModalAceptar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [procesando, setProcesando] = useState(false);

  if (!flowConfig) return null;

  const handleAceptar = async () => {
    setModalAceptar(false);
    setProcesando(true);
    setCargando(true);
    try {
      await firmaService.aceptarDocumento(flowConfig.uuid);
      setDecision('aceptado');
      setCompletado();
      showToast('Documento autorizado exitosamente', 'success');
    } catch {
      showToast('Error al procesar la autorización. Intenta de nuevo.', 'error');
    } finally {
      setProcesando(false);
      setCargando(false);
    }
  };

  const handleRechazar = async () => {
    setModalRechazar(false);
    setProcesando(true);
    setCargando(true);
    try {
      await firmaService.rechazarDocumento(flowConfig.uuid);
      setDecision('rechazado');
      setCompletado();
      showToast('Documento rechazado', 'info');
    } catch {
      showToast('Error al procesar el rechazo. Intenta de nuevo.', 'error');
    } finally {
      setProcesando(false);
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-8 h-8" aria-hidden="true">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.817c-.897-.957-2.578-.9-3.408.098l-.39.459a.75.75 0 01-1.14-.976l.39-.459c1.372-1.647 4.149-1.735 5.62-.156 1.537 1.647 1.42 4.358-.278 5.82l-1.22 1.05a.75.75 0 11-.978-1.14l1.22-1.05c1.09-.937 1.16-2.68.184-3.646z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          ¿Qué deseas hacer?
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mx-auto leading-relaxed">
          Has revisado el documento <strong className="text-slate-700">{flowConfig.documento_titulo}</strong>.
          Selecciona una opción para continuar.
        </p>
      </div>

      {/* Document summary */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-primary)" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{flowConfig.documento_titulo}</p>
          <p className="text-xs text-slate-500">{flowConfig.empresa.nombre}</p>
        </div>
      </div>

      {/* Decision buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setModalAceptar(true)}
          disabled={procesando}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          Aceptar documento
        </button>

        <button
          type="button"
          onClick={() => setModalRechazar(true)}
          disabled={procesando}
          className="w-full py-4 px-6 rounded-2xl font-bold text-base shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3 border-2 border-red-200 text-red-600 bg-white hover:bg-red-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
          Rechazar documento
        </button>
      </div>

      {/* Back button */}
      {onBack && (
        <div className="pt-2">
          <Button variant="ghost" onClick={onBack}>
            ← Volver al documento
          </Button>
        </div>
      )}

      {/* Modal Aceptar */}
      <Modal
        isOpen={modalAceptar}
        onClose={() => setModalAceptar(false)}
        title="Confirmar autorización"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#10B981" className="w-7 h-7" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm text-slate-600 leading-relaxed">
            ¿Estás seguro de que deseas <strong className="text-emerald-600">autorizar</strong> el documento
            <strong> {flowConfig.documento_titulo}</strong>?
            Se notificará a todos los involucrados.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="secondary" fullWidth onClick={() => setModalAceptar(false)}>
              Cancelar
            </Button>
            <button
              type="button"
              onClick={handleAceptar}
              className="w-full py-3 px-4 rounded-full font-semibold text-white text-base transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              Sí, autorizar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Rechazar */}
      <Modal
        isOpen={modalRechazar}
        onClose={() => setModalRechazar(false)}
        title="Confirmar rechazo"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#EF4444" className="w-7 h-7" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm text-slate-600 leading-relaxed">
            ¿Estás seguro de que deseas <strong className="text-red-600">rechazar</strong> el documento
            <strong> {flowConfig.documento_titulo}</strong>?
            Se cancelará el proceso de firma y se notificará a todos los involucrados.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="secondary" fullWidth onClick={() => setModalRechazar(false)}>
              Cancelar
            </Button>
            <button
              type="button"
              onClick={handleRechazar}
              className="w-full py-3 px-4 rounded-full font-semibold text-white text-base transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl bg-gradient-to-r from-red-500 to-red-600"
            >
              Sí, rechazar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
