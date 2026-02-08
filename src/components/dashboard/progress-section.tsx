import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function ProgressItem({ label, done }: { label: string, done: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors", done ? "bg-brand-green text-white" : "bg-slate-100 text-slate-300")}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 dashed" />}
            </div>
            <span className={cn("text-sm font-medium", done ? "text-slate-800" : "text-slate-400")}>{label}</span>
        </div>
    );
}

interface ProgressSectionProps {
    userRole: "TENANT" | "LANDLORD";
    hasProfile: boolean;
    hasContract: boolean;
    hasReview: boolean;
    stats?: any; // Useful for landlord insights chart/bar
}

export function ProgressSection({ userRole, hasProfile, hasContract, hasReview, stats }: ProgressSectionProps) {
    const [isPublic, setIsPublic] = useState(true);

    return (
        <div className="space-y-6">
            {/* Landlord Insight Box (replacing simple progress if needed, but keeping progress for both as requested) */}
            {userRole === "LANDLORD" && stats && (
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-indigo-900">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="font-bold">Rentabilidad</h3>
                    </div>
                    <p className="text-sm text-indigo-800/80 leading-relaxed mb-4">
                        Los propietarios con perfil verificado alquilan un <strong>{stats.rentalSpeed}x más rápido</strong>.
                    </p>
                    <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[70%]"></div>
                    </div>
                </div>
            )}

            {/* Progress Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Tu progreso</h3>
                <div className="space-y-4">
                    <ProgressItem label="Perfil Completado" done={hasProfile} />
                    <ProgressItem label={userRole === "TENANT" ? "Contrato Verificado" : "Primer Contrato"} done={hasContract} />
                    <ProgressItem label={userRole === "TENANT" ? "Primera Reseña" : "Reviews Recibidas"} done={hasReview} />
                </div>
            </div>

            {/* Tenant Public Toggle */}
            {userRole === "TENANT" && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Perfil Público</span>
                        <div
                            onClick={() => setIsPublic(!isPublic)}
                            className={cn("h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-300", isPublic ? "bg-brand-green" : "bg-slate-300")}
                        >
                            <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full transition-transform duration-300 shadow-sm", isPublic ? "translate-x-6" : "translate-x-1")} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">
                        {isPublic ? "Tu perfil es visible para propietarios verificados." : "Solo tú puedes ver tu perfil."}
                    </p>
                </div>
            )}
        </div>
    );
}
