"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function NewContractPage() {
    const router = useRouter();
    const { createContract } = useData();
    const { user } = useAuth();

    // Form State
    const [tenantEmail, setTenantEmail] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [address, setAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        createContract({
            landlordId: user.email,
            tenantEmail: tenantEmail,
            propertyAddress: address,
            startDate,
            endDate,
        }, file); // Pass the file!

        alert("¡Contrato creado con éxito! El inquilino recibirá una notificación.");
        router.push("/dashboard/landlord");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/landlord" className="text-neutral-400 hover:text-brand-blue transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-brand-blue">Nuevo contrato</h1>
                    <p className="text-neutral-500">Formulario para crear un contrato verificable.</p>
                </div>
            </div>

            <Card className="border-none shadow-md bg-white overflow-hidden">
                <div className="h-2 bg-brand-blue w-full" /> {/* Decorative top bar */}
                <CardHeader>
                    <CardTitle>Detalles del alquiler</CardTitle>
                    <CardDescription>Introduce los datos para verificar el alquiler.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tenantEmail" className="font-medium text-brand-blue">Email de la otra parte (Inquilino)</Label>
                            <Input
                                id="tenantEmail"
                                type="email"
                                placeholder="inquilino@ejemplo.com"
                                value={tenantEmail}
                                onChange={(e) => setTenantEmail(e.target.value)}
                                required
                                className="bg-neutral-50 border-neutral-200 h-11"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="font-medium text-brand-blue">Fecha inicio</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="bg-neutral-50 border-neutral-200 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="font-medium text-brand-blue">Fecha fin</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="bg-neutral-50 border-neutral-200 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="font-medium text-brand-blue">Dirección del inmueble</Label>
                            <Input
                                id="address"
                                placeholder="Calle Mayor, 123, Madrid"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="bg-neutral-50 border-neutral-200 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-medium text-brand-blue">Archivo (opcional)</Label>
                            <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors cursor-pointer relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                                    <Upload className="w-6 h-6 text-brand-blue" />
                                </div>
                                <p className="text-sm font-medium text-brand-blue">
                                    {file ? file.name : "Subir archivo del contrato"}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    PDF, DOCX o Imágenes (Máx. 10MB)
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                            <p className="text-xs text-neutral-400">
                                Contrato pendiente de confirmación por la otra parte.
                            </p>
                            <Button type="submit" className="bg-brand-green hover:bg-brand-green/90 text-white px-8 h-11">
                                Crear contrato
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
