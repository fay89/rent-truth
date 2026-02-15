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
            {/* Landlord Insight Box */}
            {userRole === "LANDLORD" && stats && (
                <div className="bg-gradient-to-br from-indigo-50/80 to-white/50 border border-indigo-100 rounded-[1.5rem] p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center gap-2 mb-4 text-indigo-900 relative z-10">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-heading font-bold text-lg">Rentabilidad</h3>
                    </div>
                    <p className="text-sm text-indigo-900/80 leading-relaxed mb-4 font-medium relative z-10">
                        Los propietarios con perfil verificado alquilan un <strong>{stats.rentalSpeed}x más rápido</strong>.
                    </p>
                    <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[70%] shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                    </div>
                </div>
            )}

            {/* Progress Box */}
            <div className="glass-card p-6 rounded-[1.5rem]">
                <h3 className="font-heading font-bold text-slate-900 mb-6 text-lg">Tu progreso</h3>
                <div className="space-y-0 relative">
                    {/* Connecting Line (visual hack) */}
                    <div className="absolute left-[11px] top-3 bottom-8 w-0.5 bg-slate-100 -z-10"></div>

                    <div className="pb-6">
                        <ProgressItem label="Perfil Completado" done={hasProfile} />
                    </div>
                    <div className="pb-6">
                        <ProgressItem label={userRole === "TENANT" ? "Contrato Verificado" : "Primer Contrato"} done={hasContract} />
                    </div>
                    <div>
                        <ProgressItem label={userRole === "TENANT" ? "Primera Reseña" : "Reviews Recibidas"} done={hasReview} />
                    </div>
                </div>
            </div>

            {/* Tenant Public Toggle */}
            {userRole === "TENANT" && (
                <div className="glass-card p-6 rounded-[1.5rem] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-800">Perfil Público</span>
                        <div
                            onClick={() => setIsPublic(!isPublic)}
                            className={cn("h-7 w-12 rounded-full relative cursor-pointer transition-all duration-300 shadow-inner", isPublic ? "bg-brand-green" : "bg-slate-200")}
                        >
                            <div className={cn("absolute top-1 h-5 w-5 bg-white rounded-full transition-all duration-300 shadow-sm", isPublic ? "translate-x-6" : "translate-x-1")} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isPublic ? "Tu perfil es visible para propietarios verificados." : "Solo tú puedes ver tu perfil."}
                    </p>
                </div>
            )}
        </div>
    );
}
