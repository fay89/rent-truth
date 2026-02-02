"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // 2.5 segundos de splash

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white animate-out fade-out duration-700 fill-mode-forwards" style={{ animationDelay: "2s" }}>
            <div className="relative w-64 h-24 animate-in zoom-in-50 duration-1000">
                {/* Usamos el logo de texto completo para el splash */}
                <Image
                    src="/logo-full.png"
                    alt="RentTruth Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
