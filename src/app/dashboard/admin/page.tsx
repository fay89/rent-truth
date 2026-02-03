"use client";

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, ArrowRight, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const { contracts } = useData();
    const router = useRouter();

    // Filter contracts needing verification
    // For now we look for PENDING_ADMIN. 
    // If you want to see all for debug, remove filter.
    const pendingContracts = contracts.filter(c => c.status === "PENDING_ADMIN");

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Panel de Verificación</h1>
                <p className="text-neutral-500 mt-2">Revisa y aprueba contratos firmados antes de que se activen.</p>
            </div>

            {pendingContracts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-neutral-200 text-center">
                    <ShieldAlert className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900">No hay verificaciones pendientes</h3>
                    <p className="text-neutral-500 max-w-sm mt-1">
                        ¡Todo al día! Cuando un inquilino y un propietario firmen un contrato, aparecerá aquí.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pendingContracts.map((contract) => (
                        <Card key={contract.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                                        Pendiente Admin
                                    </Badge>
                                    <span className="text-xs text-neutral-400 font-mono">
                                        {new Date(contract.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                </div>
                                <CardTitle className="text-lg line-clamp-1">{contract.propertyAddress}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <User className="h-4 w-4 text-brand-blue" />
                                    <span className="truncate">Prop: {contract.landlordId}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <User className="h-4 w-4 text-brand-green" />
                                    <span className="truncate">Inq: {contract.tenantEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{contract.startDate} - {contract.endDate}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button
                                    className="w-full bg-neutral-900 hover:bg-black text-white"
                                    onClick={() => router.push(`/dashboard/admin/verify/${contract.id}`)}
                                >
                                    Revisar Contrato
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
