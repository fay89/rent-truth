"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyRequestPage() {
    const { user, verifyEmail } = useAuth();
    const router = useRouter();

    // Mock function to simulate clicking the email link
    const handleSimulateVerify = () => {
        verifyEmail();
    };

    if (!user) {
        // Fallback if accessed directly without session
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
                <Link href="/login">
                    <Button>Ir al Login</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-gray p-4 font-sans">
            <Card className="max-w-md w-full border-none shadow-xl bg-white text-center">
                <CardHeader className="flex flex-col items-center pt-10">
                    <div className="bg-blue-50 p-4 rounded-full mb-6 relative">
                        <Mail className="w-12 h-12 text-brand-blue" />
                        <div className="absolute top-0 right-0 w-4 h-4 bg-brand-green rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-brand-blue">Verifica tu correo</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Hemos enviado un enlace de confirmación a <span className="font-semibold text-neutral-800">{user.email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-10">
                    <p className="text-neutral-500 text-sm">
                        Haz clic en el enlace del correo para activar tu cuenta y empezar a usar RentTruth.
                    </p>

                    <div className="border border-dashed border-neutral-200 p-4 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-semibold">Simulación de Desarrollo</p>
                        <p className="text-xs text-neutral-500 mb-4">
                            Como estamos en modo desarrollo (sin servidor de correo real), puedes simular el clic en el enlace aquí:
                        </p>
                        <Button
                            onClick={handleSimulateVerify}
                            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
                        >
                            Simular verificación de email <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="text-sm">
                        <button
                            className="text-neutral-400 hover:text-brand-blue transition-colors underline"
                            onClick={() => router.push('/login')}
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
