"use client";

import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdentityVerification } from "@/components/identity-verification";
import { Input } from "@/components/ui/input";
import {
    User,
    Mail,
    Shield,
    CheckCircle2,
    Star,
    TrendingUp,

    Camera,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const { reviews } = useData();

    // Phone Verification State


    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue">Mi Perfil</h1>
                <p className="text-neutral-500">Gestiona tu información personal y verificación.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Tus datos registrados en RentTruth.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center justify-center p-6 border-b border-neutral-100 mb-4">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload')?.click()}>
                                    <div className="w-24 h-24 rounded-full bg-brand-light-gray overflow-hidden border-2 border-brand-green/20 mb-3 shadow-sm flex items-center justify-center">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt="Perfil" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-neutral-300" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold">Cambiar</span>
                                    </div>
                                </div>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                                                alert("La imagen es demasiado grande. Máximo 2MB.");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                updateProfile({ photoUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <p className="text-sm font-medium text-brand-blue">{user.name}</p>
                                <p className="text-xs text-neutral-400">Toca la imagen para cambiarla</p>
                            </div>

                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-neutral-50/50">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="w-6 h-6 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Nombre completo</p>
                                    <p className="font-semibold text-neutral-800">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-neutral-50/50">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Mail className="w-6 h-6 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Email</p>
                                    <p className="font-semibold text-neutral-800">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-neutral-50/50">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Shield className="w-6 h-6 text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Rol</p>
                                    <p className="font-semibold text-neutral-800">{user.role === 'TENANT' ? 'Inquilino' : 'Propietario'}</p>
                                </div>
                            </div>



                        </CardContent>
                    </Card>

                    {/* Identity Verification Section */}
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle>Verificación de Identidad</CardTitle>
                            <CardDescription>Sube tu DNI y un selfie para verificar tu identidad.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <IdentityVerification />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-brand-blue text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-brand-green" /> Estado Verificado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-blue-100 text-sm mb-4">
                                Tu perfil está activo y verificado. Puedes firmar contratos y recibir valoraciones.
                            </p>
                            <Button variant="secondary" className="w-full text-brand-blue">
                                Ver documentación
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reputation Card */}
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Tu Reputación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-blue">
                                        {reviews.filter(r => r.targetId === user.email).length > 0
                                            ? (reviews.filter(r => r.targetId === user.email).reduce((acc, r) => acc + r.rating, 0) / reviews.filter(r => r.targetId === user.email).length).toFixed(1)
                                            : "-"}
                                    </div>
                                    <div className="text-xs text-neutral-500 font-medium">Score Total</div>
                                </div>
                                <div className="h-8 w-px bg-neutral-100"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-blue">
                                        {reviews.filter(r => r.targetId === user.email).length}
                                    </div>
                                    <div className="text-xs text-neutral-500 font-medium">Reseñas</div>
                                </div>
                            </div>
                            <div className="bg-neutral-50 p-3 rounded text-xs text-neutral-500 flex gap-2">
                                <TrendingUp className="w-4 h-4 text-brand-green" />
                                <span>Tu puntuación se actualiza automáticamente con cada contrato finalizado o revisado.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
