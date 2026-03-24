import type { FlowRegistryEntry, FlowType } from '../types';

export const FLOW_REGISTRY: Record<FlowType, FlowRegistryEntry> = {
  'sign-all': {
    flowType: 'sign-all',
    routePattern: '/firmar/:uuid',
    pasos: ['checks_legales', 'otp', 'biometria', 'visor_documentos', 'firma'],
    mostrarBienvenida: true,
  },
  'call-center': {
    flowType: 'call-center',
    routePattern: '/call-center/:uuid',
    pasos: ['otp', 'checks_legales', 'biometria', 'firma'],
    mostrarBienvenida: true,
  },
  'revisar': {
    flowType: 'revisar',
    routePattern: '/revisar/:uuid',
    pasos: ['info_documento', 'visor_documentos', 'decision'],
    mostrarBienvenida: false,
  },
};

export function getFlowByRoute(pathname: string): FlowRegistryEntry | undefined {
  return Object.values(FLOW_REGISTRY).find((entry) => {
    const pattern = entry.routePattern.replace(':uuid', '[^/]+');
    return new RegExp(`^${pattern}$`).test(pathname);
  });
}

export function getFlowEntries(): FlowRegistryEntry[] {
  return Object.values(FLOW_REGISTRY);
}
