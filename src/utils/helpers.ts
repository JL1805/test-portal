import type { AppError, ErrorType } from '../types';

export function truncateUuid(uuid: string): string {
  return uuid.substring(0, 8) + '...' + uuid.substring(uuid.length - 4);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function maskPhone(phone: string): string {
  return phone;
}

export function buildAppError(tipo: ErrorType): AppError {
  const errors: Record<ErrorType, { titulo: string; mensaje: string; reintentable: boolean }> = {
    uuid_invalido: {
      titulo: 'Enlace no válido',
      mensaje: 'El enlace que recibiste parece estar incompleto. Verifica que lo hayas copiado correctamente.',
      reintentable: false,
    },
    no_encontrado: {
      titulo: 'Solicitud no encontrada',
      mensaje: 'El enlace puede haber expirado o ya no está disponible. Contacta a soporte si necesitas uno nuevo.',
      reintentable: false,
    },
    ya_firmado: {
      titulo: 'Solicitud ya completada',
      mensaje: 'Este documento ya fue firmado anteriormente. No es necesario realizar ninguna acción adicional.',
      reintentable: false,
    },
    sin_conexion: {
      titulo: 'Sin conexión',
      mensaje: 'No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.',
      reintentable: true,
    },
    timeout: {
      titulo: 'Tiempo de espera agotado',
      mensaje: 'El servidor tardó demasiado en responder. Intenta de nuevo en unos momentos.',
      reintentable: true,
    },
    desconocido: {
      titulo: 'Error inesperado',
      mensaje: 'Ocurrió un error inesperado. Por favor intenta de nuevo o contacta a soporte.',
      reintentable: true,
    },
  };

  const errorInfo = errors[tipo];
  return { tipo, ...errorInfo };
}

export function classifyAxiosError(error: unknown): ErrorType {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { status: number }; code?: string };
    if (axiosError.code === 'ECONNABORTED') return 'timeout';
    if (!axiosError.response) return 'sin_conexion';
    if (axiosError.response.status === 404) return 'no_encontrado';
    if (axiosError.response.status === 409) return 'ya_firmado';
    return 'desconocido';
  }
  if (error instanceof Error && error.message === 'Solicitud no encontrada') {
    return 'no_encontrado';
  }
  return 'desconocido';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
