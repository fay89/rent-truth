import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Building2 } from "lucide-react";
import Link from "next/link";

interface ContractsStatCardProps {
    userRole: "TENANT" | "LANDLORD";
    totalCount: number;
    pendingCount: number;
    activeCount?: number; // More relevant for landlord
}

export function ContractsStatCard({ userRole, totalCount, pendingCount, activeCount = 0 }: ContractsStatCardProps) {
    const isTenant = userRole === "TENANT";

    if (isTenant) {
        return (
            <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between group">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 text-brand-blue p-3 rounded-2xl shadow-sm ring-1 ring-blue-100 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-6 h-6" />
                        </div>
                        {pendingCount > 0 && <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg shadow-orange-200 animate-pulse">{pendingCount} Pendientes</Badge>}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-slate-800">Contratos</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed font-medium">
                        Tienes <span className="text-slate-900 font-bold">{totalCount}</span> contratos en total. {pendingCount > 0 ? "Revisa los pendientes para evitar retrasos." : "Todo está al día."}
                    </p>
                </div>
                <Button variant="outline" className="mt-6 w-full rounded-xl border-slate-200 text-slate-600 hover:text-brand-blue hover:bg-slate-50 font-semibold" asChild>
                    <Link href="/dashboard/contracts">Gestión de Contratos</Link>
                </Button>
            </div>
        );
    }

    // Landlord View - formerly the Hero content, now adapted to card
    return (
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between group">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-brand-blue text-white p-3 rounded-2xl shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                        {pendingCount > 0 && <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full shadow-md">{pendingCount} Pendientes</Badge>}
                        {activeCount > 0 && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full font-bold">{activeCount} Activos</Badge>}
                    </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-800">Mis Propiedades</h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-heading font-extrabold tracking-inute text-slate-900">{totalCount}</span>
                    <span className="text-sm text-slate-500 font-medium">Total</span>
                </div>
            </div>
            <Button className="mt-6 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:translate-y-[-2px]" asChild>
                <Link href="/dashboard/contracts">Gestión de Propiedades</Link>
            </Button>
        </div>
    );
}
