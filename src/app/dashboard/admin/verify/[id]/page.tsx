"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, ArrowLeft, Loader2, UserCheck, ShieldCheck } from "lucide-react";

export default function VerifyContractPage() {
    const params = useParams(); // params is a Promise in Next 15, but let's assume standard behavior or use React.use() if needed. In Next 14 it's object.
    // Assuming Next 14/15 based on "Next.js 16.1.6" log earlier - wait, params is synchronous in client usually unless strictly async component.
    // In "use client", params is usually directly accessible or unwrapped. 
    // Let's safe access it.
    const id = params?.id as string;

    const { contracts, adminVerifyContract } = useData();
    const { getPublicUser } = useAuth();
    const router = useRouter();

    const contract = contracts.find(c => c.id === id);

    const [landlordData, setLandlordData] = useState<any>(null);
    const [tenantData, setTenantData] = useState<any>(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            if (!contract) return;
            setLoadingUsers(true);
            try {
                // Fetch public profiles to check identity verification status
                const lUser = await getPublicUser(contract.landlordId); // landlordId is email usually in this schema
                const tUser = await getPublicUser(contract.tenantEmail);
                setLandlordData(lUser);
                setTenantData(tUser);
            } catch (err) {
                console.error("Error loading user details", err);
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, [contract, getPublicUser]);

    if (!contract) {
        return (
            <div className="p-8 text-center">
                <p>Contrato no encontrado o no autorizado.</p>
                <Button variant="link" onClick={() => router.back()}>Volver</Button>
            </div>
        );
    }

    const handleApprove = async () => {
        if (!confirm("¿Confirmas que has verificado tanto las identidades como el documento?")) return;

        setIsVerifying(true);
        try {
            await adminVerifyContract(contract.id);
            router.push("/dashboard/admin");
        } catch (error) {
            console.error(error);
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold">Verificar Contrato</h1>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{contract.status}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Contract Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-neutral-500" />
                            Detalles del Alquiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-neutral-500">Dirección</p>
                            <p className="font-medium text-lg">{contract.propertyAddress}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-neutral-500">Inicio</p>
                                <p className="font-medium">{contract.startDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500">Fin</p>
                                <p className="font-medium">{contract.endDate}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <p className="text-sm font-semibold mb-2">Documento Adjunto</p>
                            {contract.contractUrl ? (
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/rent-files/${contract.contractUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    Ver PDF Contrato
                                </a>
                            ) : (
                                <span className="text-red-500 text-sm">No se adjuntó archivo PDF.</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Identities Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-neutral-500" />
                            Verificación de Identidad
                        </CardTitle>
                        <CardDescription>Revisa que ambos usaron DNI válido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {loadingUsers ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <>
                                {/* Landlord */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-neutral-500">Propietario</p>
                                        {landlordData?.identityVerified ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Verificado
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">No Verificado</Badge>
                                        )}
                                    </div>
                                    <div className="p-3 bg-neutral-50 rounded-lg border">
                                        <p className="font-bold">{contract.landlordId}</p>
                                        <p className="text-sm text-neutral-500">{landlordData?.name || "Sin nombre"}</p>
                                    </div>
                                </div>

                                {/* Tenant */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-neutral-500">Inquilino</p>
                                        {tenantData?.identityVerified ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Verificado
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">No Verificado</Badge>
                                        )}
                                    </div>
                                    <div className="p-3 bg-neutral-50 rounded-lg border">
                                        <p className="font-bold">{contract.tenantEmail}</p>
                                        <p className="text-sm text-neutral-500">{tenantData?.name || "Sin nombre"}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleReject}
                        disabled={isVerifying}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Contrato
                    </Button>
                    <Button
                        size="lg"
                        className="bg-brand-green hover:bg-brand-green/90 text-white"
                        onClick={handleApprove}
                        disabled={isVerifying}
                    >
                        {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                        Aprobar y Activar
                    </Button>
                </div>
            </div>
        </div>
    );
}
