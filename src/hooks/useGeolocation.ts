import { useEffect } from 'react';
import { useFirmaStore } from '../store/firmaStore';

export function useGeolocation() {
  const setGeolocalizacion = useFirmaStore((s) => s.setGeolocalizacion);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocalizacion(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocalizacion({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precision: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      () => {
        setGeolocalizacion(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [setGeolocalizacion]);
}
