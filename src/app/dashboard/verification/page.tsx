"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IdentityVerification } from "@/components/identity-verification";
import { ShieldCheck } from "lucide-react";

export default function VerificationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue">Centro de Verificación</h1>
                <p className="text-neutral-500">Aumenta la confianza de tu perfil verificando tu identidad.</p>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">

                <CardContent className="p-8">
                    <IdentityVerification />
                </CardContent>
            </Card>
        </div>
    );
}
