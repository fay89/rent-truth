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
        <div className={cn("p-8 rounded-[2rem] transition-all h-full flex flex-col justify-between group", hasProfile ? "glass-card hover:shadow-xl hover:shadow-brand-blue/5 border-white/60" : "bg-red-50/50 border border-red-100 backdrop-blur-sm")}>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-sm", hasProfile ? (isTenant ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-blue-50 text-blue-600 ring-1 ring-blue-100") : "bg-red-100/80 text-red-500 ring-1 ring-red-200")}>
                        {hasProfile ? <ShieldCheck className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                    </div>
                    {!hasProfile && <Badge variant="destructive" className="rounded-full px-3 py-1 shadow-md shadow-red-200">Acción requerida</Badge>}
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">Identidad {hasProfile ? "Verificada" : "Pendiente"}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {hasProfile ? verifiedText : unverifiedText}
                </p>
            </div>
            {!hasProfile && (
                <Link href="/dashboard/verification" className="mt-6 inline-block w-full">
                    <Button size="lg" className="w-full rounded-xl bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 text-white font-bold transition-all hover:-translate-y-1">Verificar Ahora</Button>
                </Link>
            )}
        </div>
    );
}
