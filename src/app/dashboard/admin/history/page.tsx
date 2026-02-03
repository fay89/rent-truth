"use client";

import { useData } from "@/contexts/data-context";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, Calendar, User, Building } from "lucide-react";

export default function AdminHistoryPage() {
    const { contracts } = useData();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter verified/active contracts
    const verifiedContracts = contracts.filter(c =>
        c.status === "VERIFIED" || c.status === "ACTIVE" || c.status === "ENDED"
    );

    const filteredContracts = verifiedContracts.filter(c =>
        c.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.landlordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Historial de Verificaciones</h1>
                <p className="text-neutral-500 mt-2">Consulta todos los contratos que han sido verificados y aprobados.</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                    placeholder="Buscar por dirección, propietario o inquilino..."
                    className="pl-10 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredContracts.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed text-neutral-400">
                        <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No se encontraron contratos verificados con ese criterio.</p>
                    </div>
                ) : (
                    filteredContracts.map(contract => (
                        <Card key={contract.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                            <FileCheck className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <h3 className="font-semibold text-lg text-neutral-900 truncate pr-4">
                                                {contract.propertyAddress}
                                            </h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span className="truncate max-w-[150px]">{contract.tenantEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Building className="h-3.5 w-3.5" />
                                                    <span className="truncate max-w-[150px]">{contract.landlordId}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{contract.startDate} - {contract.endDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 pl-14 md:pl-0">
                                        <Badge variant="outline" className={
                                            contract.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                contract.status === 'ENDED' ? 'bg-neutral-100 text-neutral-600 border-neutral-200' :
                                                    'bg-green-50 text-green-700 border-green-200'
                                        }>
                                            {contract.status === 'ACTIVE' ? 'Activo' :
                                                contract.status === 'ENDED' ? 'Finalizado' : 'Verificado'}
                                        </Badge>
                                        <span className="text-xs text-neutral-400 font-mono">
                                            ID: {contract.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
