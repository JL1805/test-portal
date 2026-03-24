import { useEffect } from 'react';
import { useFirmaStore } from '../store/firmaStore';
import { firmaService } from '../api/firmaService';
import { uuidSchema } from '../schemas/validations';
import { buildAppError, classifyAxiosError } from '../utils/helpers';
import { FLOW_REGISTRY } from '../config/flows';
import type { FlowType } from '../types';

export function useFlowConfig(uuid: string | undefined, flowType: FlowType) {
  const setFlowConfig = useFirmaStore((s) => s.setFlowConfig);
  const setFlowType = useFirmaStore((s) => s.setFlowType);
  const setCargando = useFirmaStore((s) => s.setCargando);
  const setError = useFirmaStore((s) => s.setError);
  const flowConfig = useFirmaStore((s) => s.flowConfig);
  const cargando = useFirmaStore((s) => s.cargando);
  const error = useFirmaStore((s) => s.error);

  useEffect(() => {
    if (!uuid) {
      setError(buildAppError('uuid_invalido'));
      return;
    }

    const result = uuidSchema.safeParse(uuid);
    if (!result.success) {
      setError(buildAppError('uuid_invalido'));
      return;
    }

    let cancelled = false;
    setCargando(true);
    setFlowType(flowType);

    // Set mostrarBienvenida based on flow registry
    const registryEntry = FLOW_REGISTRY[flowType];
    if (registryEntry && !registryEntry.mostrarBienvenida) {
      // For flows without welcome, start at step 0 directly
      useFirmaStore.setState({ mostrarBienvenida: false, pasoActual: 0 });
    }

    firmaService
      .obtenerConfig(uuid, flowType)
      .then((config) => {
        if (!cancelled) {
          setFlowConfig({ ...config, flowType });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const tipo = classifyAxiosError(err);
          setError(buildAppError(tipo));
          setCargando(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uuid, flowType, setFlowConfig, setFlowType, setCargando, setError]);

  return { flowConfig, cargando, error };
}
