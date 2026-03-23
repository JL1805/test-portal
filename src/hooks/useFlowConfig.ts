import { useEffect } from 'react';
import { useFirmaStore } from '../store/firmaStore';
import { firmaService } from '../api/firmaService';
import { uuidSchema } from '../schemas/validations';
import { buildAppError, classifyAxiosError } from '../utils/helpers';

export function useFlowConfig(uuid: string | undefined) {
  const setFlowConfig = useFirmaStore((s) => s.setFlowConfig);
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

    firmaService
      .obtenerConfig(uuid)
      .then((config) => {
        if (!cancelled) {
          setFlowConfig(config);
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
  }, [uuid, setFlowConfig, setCargando, setError]);

  return { flowConfig, cargando, error };
}
