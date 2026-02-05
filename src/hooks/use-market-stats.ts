"use client";

import { useState, useEffect } from "react";

export interface MarketStats {
    activeTenants: number;
    landlordPreference: number;
    rentalSpeed: number;
    paymentSuccess: number;
    valueIncrease: number;
    avgTime: number; // in hours
}

export function useMarketStats() {
    const [stats, setStats] = useState<MarketStats>({
        activeTenants: 10432,
        landlordPreference: 85.4,
        rentalSpeed: 3.2,
        paymentSuccess: 98.4,
        valueIncrease: 12.5,
        avgTime: 28
    });

    useEffect(() => {
        // Hydration matching: ensure initial render matches server (though these are client components mostly)
        // We set up the interval only on client side
        const interval = setInterval(() => {
            setStats(prev => {
                // Volatility logic: slight random jitter around a base trend
                const tenantJitter = Math.floor(Math.random() * 5) - 1; // -1 to +3 active tenants
                const prefJitter = (Math.random() * 0.2) - 0.1; // +/- 0.1%
                const speedJitter = (Math.random() * 0.1) - 0.05; // +/- 0.05x

                return {
                    activeTenants: prev.activeTenants + tenantJitter > 10000 ? prev.activeTenants + tenantJitter : 10432,
                    landlordPreference: Number((prev.landlordPreference + prefJitter).toFixed(1)),
                    rentalSpeed: Number((prev.rentalSpeed + speedJitter).toFixed(2)),
                    paymentSuccess: Number((98.4 + (Math.random() * 0.5)).toFixed(2)), // Always high between 98.4 and 98.9
                    valueIncrease: Number((12.5 + (Math.random() * 0.4) - 0.2).toFixed(1)),
                    avgTime: 28 + Math.floor(Math.random() * 3)
                };
            });
        }, 4000); // Update every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return stats;
}
