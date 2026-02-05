"use client";

import { useEffect } from "react";

export function PwaReload() {
    useEffect(() => {
        // 1. Limpieza en desarrollo
        if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
            return; // En dev no hacemos nada más
        }

        // 2. Handler para cuando el SW cambia (se ha instalado uno nuevo)
        const handleControllerChange = () => {
            console.log('[PWA] New version found. Skipping auto-reload to improved UX.');
            // window.location.reload(); // Disabled to prevent splash loop
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

            // 3. Forzar chequeo de actualizaciones periódicamente y al volver a la app
            const updateServiceWorker = async () => {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    if (registration) {
                        console.log('[PWA] Checking for updates...');
                        await registration.update();
                    }
                } catch (error) {
                    console.error('[PWA] Update check failed:', error);
                }
            };

            // Chequear al cargar
            updateServiceWorker();

            // Chequear cada vez que la app vuelve al foco (usuario abre la app)
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    updateServiceWorker();
                }
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Chequear cada 1 hora por si acaso
            const intervalId = setInterval(updateServiceWorker, 60 * 60 * 1000);

            return () => {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                clearInterval(intervalId);
            };
        }
    }, []);

    return null;
}
