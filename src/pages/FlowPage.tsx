import { Suspense, lazy, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFirmaStore } from '../store/firmaStore';
import { useFlowConfig } from '../hooks/useFlowConfig';
import { useGeolocation } from '../hooks/useGeolocation';
import { firmaService } from '../api/firmaService';
import { FlowLayout } from '../components/layout/FlowLayout';
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { DocumentInfoStep } from '../components/steps/DocumentInfoStep';
import { WelcomeSkeleton } from '../components/ui/Skeleton';
import { showToast } from '../components/ui/Toast';
import { ErrorPage } from './ErrorPage';
import { SuccessPage } from './SuccessPage';
import { ReviewResultPage } from './ReviewResultPage';
import type { CompletarPayload, CallCenterPayload, FlowType, StepId } from '../types';

const LegalChecksStep = lazy(() =>
  import('../components/steps/LegalChecksStep').then((m) => ({ default: m.LegalChecksStep }))
);
const OTPStep = lazy(() =>
  import('../components/steps/OTPStep').then((m) => ({ default: m.OTPStep }))
);
const BiometricStep = lazy(() =>
  import('../components/steps/BiometricStep').then((m) => ({ default: m.BiometricStep }))
);
const DocumentViewerStep = lazy(() =>
  import('../components/steps/DocumentViewerStep').then((m) => ({ default: m.DocumentViewerStep }))
);
const SignaturePadStep = lazy(() =>
  import('../components/steps/SignaturePadStep').then((m) => ({ default: m.SignaturePadStep }))
);
const DecisionStep = lazy(() =>
  import('../components/steps/DecisionStep').then((m) => ({ default: m.DecisionStep }))
);

const StepSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-4">
    <div className="h-8 w-48 mx-auto animate-shimmer rounded-lg" />
    <div className="h-4 w-64 mx-auto animate-shimmer rounded" />
    <div className="h-40 w-full animate-shimmer rounded-xl" />
    <div className="h-14 w-full animate-shimmer rounded-full" />
  </div>
);

interface FlowPageProps {
  flowType: FlowType;
}

export function FlowPage({ flowType }: FlowPageProps) {
  const { uuid } = useParams<{ uuid: string }>();
  const { cargando, error } = useFlowConfig(uuid, flowType);
  useGeolocation();

  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const mostrarBienvenida = useFirmaStore((s) => s.mostrarBienvenida);
  const pasoActual = useFirmaStore((s) => s.pasoActual);
  const completado = useFirmaStore((s) => s.completado);
  const avanzarPaso = useFirmaStore((s) => s.avanzarPaso);
  const retrocederPaso = useFirmaStore((s) => s.retrocederPaso);
  const getPasosActivos = useFirmaStore((s) => s.getPasosActivos);
  const checksAceptados = useFirmaStore((s) => s.checksAceptados);
  const codigoOtp = useFirmaStore((s) => s.codigoOtp);
  const selfieBase64 = useFirmaStore((s) => s.selfieBase64);
  const firmaBase64 = useFirmaStore((s) => s.firmaBase64);
  const documentosLeidos = useFirmaStore((s) => s.documentosLeidos);
  const geolocalizacion = useFirmaStore((s) => s.geolocalizacion);
  const setCompletado = useFirmaStore((s) => s.setCompletado);
  const setCargando = useFirmaStore((s) => s.setCargando);

  const pasosActivos = getPasosActivos();
  const pasoActualConfig = pasosActivos[pasoActual];
  const isFirstStep = pasoActual === 0;
  const isLastStep = pasoActual === pasosActivos.length - 1;

  const handleCompletar = useCallback(async () => {
    if (!flowConfig) return;

    setCargando(true);
    try {
      if (flowType === 'sign-all') {
        const payload: CompletarPayload = {
          checksAceptados,
          codigoOtp,
          selfieBase64,
          firmaBase64: firmaBase64 ?? '',
          documentosLeidos,
          geolocalizacion,
        };
        await firmaService.completar(flowConfig.uuid, payload);
        setCompletado();
        showToast('Documento firmado exitosamente', 'success');
      } else if (flowType === 'call-center') {
        const payload: CallCenterPayload = {
          checksAceptados,
          codigoOtp,
          selfieBase64,
          firmaBase64: firmaBase64 ?? '',
          geolocalizacion,
        };
        await firmaService.completarCallCenter(flowConfig.uuid, payload);
        setCompletado();
        showToast('Documento firmado exitosamente', 'success');
      }
      // For 'revisar' flow, completion is handled by DecisionStep directly
    } catch {
      showToast('Error al completar la firma. Intenta de nuevo.', 'error');
    } finally {
      setCargando(false);
    }
  }, [
    flowType, flowConfig, setCargando, setCompletado,
    checksAceptados, codigoOtp, selfieBase64, firmaBase64, documentosLeidos, geolocalizacion,
  ]);

  const handleNext = useCallback(async () => {
    if (isLastStep && flowType !== 'revisar') {
      await handleCompletar();
    } else {
      avanzarPaso();
    }
  }, [isLastStep, flowType, avanzarPaso, handleCompletar]);

  const handleBack = useCallback(() => {
    retrocederPaso();
  }, [retrocederPaso]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (completado) {
    // For 'revisar' flow, show the review result page
    if (flowType === 'revisar') {
      return (
        <FlowLayout showStepIndicator={false}>
          <ReviewResultPage />
        </FlowLayout>
      );
    }
    return (
      <FlowLayout showStepIndicator>
        <SuccessPage />
      </FlowLayout>
    );
  }

  if (cargando || !flowConfig) {
    return (
      <FlowLayout showStepIndicator={false}>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <WelcomeSkeleton />
        </div>
      </FlowLayout>
    );
  }

  // Welcome screen (only for flows that have it)
  if (mostrarBienvenida && flowType !== 'revisar') {
    return (
      <FlowLayout showStepIndicator>
        <WelcomeStep />
      </FlowLayout>
    );
  }

  const renderStep = () => {
    if (!pasoActualConfig) return null;

    const stepId: StepId = pasoActualConfig.id;
    const backProps = isFirstStep ? {} : { onBack: handleBack };

    switch (stepId) {
      case 'checks_legales':
        return <LegalChecksStep onNext={handleNext} {...backProps} />;
      case 'otp':
        return <OTPStep onNext={handleNext} {...backProps} />;
      case 'biometria':
        return <BiometricStep onNext={handleNext} {...backProps} />;
      case 'visor_documentos':
        return <DocumentViewerStep onNext={handleNext} {...backProps} />;
      case 'firma':
        return <SignaturePadStep onNext={handleNext} {...backProps} />;
      case 'info_documento':
        return <DocumentInfoStep onNext={handleNext} />;
      case 'decision':
        return <DecisionStep {...backProps} />;
      default:
        return null;
    }
  };

  const currentStepId = pasoActualConfig?.id;

  const getMaxWidth = () => {
    if (currentStepId === 'firma') return '3xl';
    if (currentStepId === 'visor_documentos') return '3xl';
    return '2xl';
  };

  return (
    <FlowLayout showStepIndicator maxWidth={getMaxWidth()}>
      <Suspense fallback={<StepSkeleton />}>
        {renderStep()}
      </Suspense>
    </FlowLayout>
  );
}
