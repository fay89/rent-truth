import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VerificationCardProps {
    hasProfile: boolean;
    userRole: "TENANT" | "LANDLORD";
}

export function VerificationCard({ hasProfile, userRole }: VerificationCardProps) {
    const isTenant = userRole === "TENANT";

    const verifiedText = isTenant
        ? "Tu perfil genera máxima confianza a los propietarios."
        : "Tu identidad verificada te protege de fraudes y atrae mejores inquilinos.";

    const unverifiedText = isTenant
        ? "Verifica tu DNI y Selfie para poder firmar contratos."
        : "Verifica tu identidad para dar seguridad a tus inquilinos y evitar problemas.";

    return (
        <div className={cn("p-6 rounded-3xl border transition-all h-full flex flex-col justify-between", hasProfile ? "bg-white border-slate-100 shadow-sm" : "bg-red-50 border-red-100")}>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2.5 rounded-xl", hasProfile ? (isTenant ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/5 text-brand-blue") : "bg-red-100 text-red-500")}>
                        {hasProfile ? <ShieldCheck className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                    </div>
                    {!hasProfile && <Badge variant="destructive" className="rounded-full">Acción requerida</Badge>}
                </div>
                <h3 className="font-bold text-lg text-slate-800">Identidad {hasProfile ? "Verificada" : "Pendiente"}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {hasProfile ? verifiedText : unverifiedText}
                </p>
            </div>
            {!hasProfile && (
                <Link href="/dashboard/verification" className="mt-4 inline-block">
                    <Button size="sm" variant="destructive" className="w-full rounded-xl">Verificar Ahora</Button>
                </Link>
            )}
        </div>
    );
}
