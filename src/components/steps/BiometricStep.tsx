import { useState } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { useCamera } from '../../hooks/useCamera';
import { Button } from '../ui/Button';

interface BiometricStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export function BiometricStep({ onNext, onBack }: BiometricStepProps) {
  const selfieBase64 = useFirmaStore((s) => s.selfieBase64);
  const setSelfie = useFirmaStore((s) => s.setSelfie);
  const { videoRef, canvasRef, isStreaming, capturedImage, error, startCamera, capture, retake, stopCamera } = useCamera();
  const [showCamera, setShowCamera] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleCapture = () => {
    setFlashActive(true);
    setTimeout(() => {
      capture();
      setFlashActive(false);
    }, 150);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      setSelfie(capturedImage);
      setShowCamera(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    setShowCamera(false);
  };

  // Already captured — show confirmation
  if (selfieBase64) {
    return (
      <div className="animate-slideInRight">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Atrás
            </button>
          )}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-success)" className="w-8 h-8" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-success)]">Identidad verificada</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Tu selfie ha sido capturada correctamente.</p>
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[var(--color-success)]">
              <img src={selfieBase64} alt="Selfie capturada" className="w-full h-full object-cover" />
            </div>
          </div>
          <Button onClick={onNext}>Continuar</Button>
        </div>
      </div>
    );
  }

  // Camera view
  if (showCamera) {
    return (
      <div className="animate-scaleIn">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Camera header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <button onClick={handleCancel} className="text-sm flex items-center gap-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Cancelar
            </button>
            <span className="text-sm font-medium">Captura biométrica</span>
            <div className="w-16" />
          </div>

          {/* Video area */}
          <div className="relative bg-black aspect-[3/4] max-h-[60vh]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Flash effect */}
            {flashActive && (
              <div className="absolute inset-0 bg-white z-10 animate-scaleIn" />
            )}

            {/* Oval overlay */}
            {isStreaming && !capturedImage && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                <defs>
                  <mask id="ovalMask">
                    <rect width="100%" height="100%" fill="white" />
                    <ellipse cx="50%" cy="45%" rx="30%" ry="38%" fill="black" />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#ovalMask)" />
                <ellipse cx="50%" cy="45%" rx="30%" ry="38%" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 4" />
              </svg>
            )}

            {/* Captured preview */}
            {capturedImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <img src={capturedImage} alt="Foto capturada" className="max-w-full max-h-full object-contain" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-error)" className="w-12 h-12 mb-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
                <p className="text-white text-sm mb-4">{error}</p>
                <Button variant="secondary" onClick={startCamera}>
                  Reintentar
                </Button>
              </div>
            )}
          </div>

          {/* Instructions + Controls */}
          <div className="p-4 space-y-4 bg-slate-900">
            {!capturedImage && (
              <>
                <p className="text-center text-sm text-slate-300">
                  Centra tu rostro en el óvalo y mantén el dispositivo firme
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleCapture}
                    disabled={!isStreaming}
                    className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 hover:border-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    aria-label="Capturar foto"
                  />
                </div>
              </>
            )}
            {capturedImage && (
              <div className="flex gap-3">
                <Button variant="secondary" onClick={retake}>
                  Retomar
                </Button>
                <Button onClick={handleUsePhoto}>
                  Usar esta foto
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Instructions screen
  return (
    <div className="animate-slideInRight">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-primary)" className="w-8 h-8" aria-hidden="true">
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Verificación de identidad
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Necesitamos verificar tu identidad con una selfie. Sigue las instrucciones a continuación.
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          {[
            'Busca un lugar con buena iluminación',
            'Usa un fondo neutro o liso',
            'No uses lentes de sol ni gorra',
            'Mira directamente a la cámara',
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <div className="w-6 h-6 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-primary)" className="w-3.5 h-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              {tip}
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            setShowCamera(true);
            setTimeout(startCamera, 100);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2" aria-hidden="true">
            <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Activar cámara
        </Button>
      </div>
    </div>
  );
}
