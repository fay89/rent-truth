"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Lock as LockIcon } from "lucide-react";

export default function VerificationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue">Centro de Verificación</h1>
                <p className="text-neutral-500">Aumenta la confianza de tu perfil verificando tu identidad.</p>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <div className="bg-brand-blue p-8 text-white flex flex-col items-center text-center">
                    <ShieldCheck className="w-16 h-16 mb-4 text-brand-green" />
                    <h2 className="text-2xl font-bold mb-2">Tu identidad está verificada</h2>
                    <p className="text-blue-100 max-w-lg">
                        Gracias por completar el proceso. Tu insignia de verificado aparece en tu perfil y contratos.
                    </p>
                </div>
                <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-brand-blue mb-4">Documentos aportados</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <LockIcon className="w-4 h-4 text-brand-green" />
                                </div>
                                <div>
                                    <p className="font-medium">DNI / Pasaporte</p>
                                    <p className="text-xs text-neutral-500">Verificado el 12/01/2024</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Completado</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <LockIcon className="w-4 h-4 text-brand-green" />
                                </div>
                                <div>
                                    <p className="font-medium">Número de teléfono</p>
                                    <p className="text-xs text-neutral-500">Verificado el 12/01/2024</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Completado</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
