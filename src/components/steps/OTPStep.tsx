import { useState, useEffect, useCallback, useRef } from 'react';
import { useFirmaStore } from '../../store/firmaStore';
import { firmaService } from '../../api/firmaService';
import { OTPInput } from '../ui/OTPInput';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';

interface OTPStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export function OTPStep({ onNext, onBack }: OTPStepProps) {
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const otpVerificado = useFirmaStore((s) => s.otpVerificado);
  const setOtpVerificado = useFirmaStore((s) => s.setOtpVerificado);
  const setCodigoOtp = useFirmaStore((s) => s.setCodigoOtp);

  const [countdown, setCountdown] = useState(60);
  const [intentos, setIntentos] = useState(0);
  const [verificando, setVerificando] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const otpSent = useRef(false);

  const maxIntentos = flowConfig?.configuracion.intentos_otp_max ?? 3;
  const otpLongitud = flowConfig?.configuracion.otp_longitud ?? 6;
  const telefonoEnmascarado = flowConfig?.configuracion.telefono_enmascarado ?? '';
  const uuid = flowConfig?.uuid ?? '';

  // Send OTP on mount
  useEffect(() => {
    if (otpSent.current || otpVerificado) return;
    otpSent.current = true;

    firmaService.enviarOtp(uuid).catch(() => {
      showToast('Error al enviar el código. Intenta reenviar.', 'error');
    });
  }, [uuid, otpVerificado]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || otpVerificado) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, otpVerificado]);

  const handleResend = useCallback(() => {
    setCountdown(60);
    setHasError(false);
    firmaService.enviarOtp(uuid).then(() => {
      showToast('Código reenviado', 'success');
    }).catch(() => {
      showToast('Error al reenviar el código', 'error');
    });
  }, [uuid]);

  const handleComplete = useCallback(
    async (codigo: string) => {
      if (verificando || bloqueado) return;
      setVerificando(true);
      setHasError(false);

      try {
        const result = await firmaService.validarOtp(uuid, codigo);
        if (result.valido) {
          setOtpVerificado(true);
          setCodigoOtp(codigo);
          showToast('Código verificado correctamente', 'success');
          setTimeout(onNext, 600);
        } else {
          const newIntentos = intentos + 1;
          setIntentos(newIntentos);
          setHasError(true);
          if (newIntentos >= maxIntentos) {
            setBloqueado(true);
            showToast('Máximo de intentos alcanzado', 'error');
          } else {
            showToast(`Código incorrecto. Intentos restantes: ${maxIntentos - newIntentos}`, 'error');
          }
        }
      } catch {
        setHasError(true);
        showToast('Error al verificar el código', 'error');
      } finally {
        setVerificando(false);
      }
    },
    [verificando, bloqueado, uuid, intentos, maxIntentos, setOtpVerificado, setCodigoOtp, onNext]
  );

  if (otpVerificado) {
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
            <h2 className="text-xl font-bold text-[var(--color-success)]">Verificación completada</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Tu número ha sido verificado exitosamente.</p>
          </div>
          <Button onClick={onNext}>Continuar</Button>
        </div>
      </div>
    );
  }

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
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Verificación de identidad
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Hemos enviado un código de verificación al número <strong>{telefonoEnmascarado}</strong>
          </p>
        </div>

        {/* OTP Input */}
        <OTPInput
          length={otpLongitud}
          onComplete={handleComplete}
          disabled={verificando || bloqueado}
          hasError={hasError}
          hasSuccess={false}
        />

        {/* Loading */}
        {verificando && (
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verificando...
          </div>
        )}

        {/* Blocked */}
        {bloqueado && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center space-y-2">
            <p className="text-sm font-medium text-[var(--color-error)]">
              Has superado el máximo de intentos permitidos.
            </p>
            <a
              href="mailto:soporte@firmatest.com"
              className="text-sm text-[var(--color-primary)] underline"
            >
              Contactar soporte
            </a>
          </div>
        )}

        {/* Countdown & Resend */}
        {!bloqueado && (
          <div className="text-center space-y-3">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(countdown / 60) * 100}%` }}
              />
            </div>

            {countdown > 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                Reenviar código en <span className="font-mono font-bold">
                  {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                </span>
              </p>
            ) : (
              <Button variant="ghost" onClick={handleResend}>
                Reenviar código
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
