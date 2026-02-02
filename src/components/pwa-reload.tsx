"use client";

import { useEffect } from "react";

export function PwaReload() {
    useEffect(() => {
        // Limpieza agresiva en desarrollo
        if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                    console.log('[Dev] Service Worker unregistered');
                }
            });
        }

        // Cuando el SW controla la página (porque se activó uno nuevo via skipWaiting), recargamos
        // para que el usuario vea la nueva versión inmediatamente.
        const handleControllerChange = () => {
            // Evitamos bucle infinito con una bandera de sesión si fuera necesario, 
            // pero con skipWaiting y una nueva versión real, debería ser seguro.
            // Opcional: mostrar un toast en lugar de reload forzoso. 
            // Pero el usuario pidió "actualizar sin hacer nada", así que reload es lo más efectivo.
            window.location.reload();
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        }

        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            }
        };
    }, []);

    return null;
}
