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
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 text-brand-blue p-2.5 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        {pendingCount > 0 && <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full">{pendingCount} Pendientes</Badge>}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Contratos</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Tienes {totalCount} contratos en total. {pendingCount > 0 ? "Revisa los pendientes para evitar retrasos." : "Todo está al día."}
                    </p>
                </div>
                <Button variant="outline" className="mt-4 w-full rounded-xl border-slate-200 text-slate-600 hover:text-brand-blue hover:bg-slate-50" asChild>
                    <Link href="/dashboard/contracts">Gestión de Contratos</Link>
                </Button>
            </div>
        );
    }

    // Landlord View - formerly the Hero content, now adapted to card
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 text-brand-blue p-2.5 rounded-xl">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                        {pendingCount > 0 && <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full">{pendingCount} Pendientes</Badge>}
                        {activeCount > 0 && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">{activeCount} Activos</Badge>}
                    </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800">Mis Propiedades</h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold tracking-tighter">{totalCount}</span>
                    <span className="text-sm text-slate-500">Total</span>
                </div>
            </div>
            <Button variant="outline" className="mt-4 w-full rounded-xl border-slate-200 text-slate-600 hover:text-brand-blue hover:bg-slate-50" asChild>
                <Link href="/dashboard/contracts">Gestión de Propiedades</Link>
            </Button>
        </div>
    );
}
