"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth, User } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { Card } from "@/components/ui/card";
import { Star, ShieldCheck, User as UserIcon, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicVerificationPage() {
    const params = useParams();
    const { getPublicUser } = useAuth();
    const { reviews } = useData();
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const email = decodeURIComponent(params.id as string);

    useEffect(() => {
        if (email) {
            getPublicUser(email).then(user => {
                setTargetUser(user);
                setLoading(false);
            });
        }
    }, [email, getPublicUser]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-50">Cargando perfil...</div>;
    }

    if (!targetUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-800 mb-2">Usuario no encontrado</h1>
                    <p className="text-neutral-500 mb-6">El perfil que buscas no existe o no es público.</p>
                    <Link href="/">
                        <Button>Volver al inicio</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // Calculate Score
    const userReviews = reviews.filter(r => r.targetId === targetUser.email);
    const reviewCount = userReviews.length;
    const averageRating = reviewCount > 0
        ? (userReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
        : "N/A";

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm relative">

                {/* ID Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 relative z-10">
                    {/* Header Background */}
                    <div className="h-32 bg-brand-blue relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute left-10 bottom-10 w-20 h-20 bg-brand-green/20 rounded-full blur-xl"></div>
                    </div>

                    <div className="px-6 pb-8 relative">
                        {/* Avatar / Icon */}
                        <div className="-mt-16 mb-4 flex justify-center">
                            <div className="w-32 h-32 bg-white p-2 rounded-full shadow-lg">
                                <div className="w-full h-full bg-neutral-100 rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                                    <span className="text-4xl font-bold text-neutral-300 select-none">
                                        {targetUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-neutral-800 flex items-center justify-center gap-2">
                                {targetUser.name}
                                <CheckCircle2 className="w-5 h-5 text-brand-green fill-green-50" />
                            </h1>
                            <p className="text-brand-blue font-medium uppercase tracking-wide text-xs mt-1">
                                {targetUser.role === "TENANT" ? "Inquilino Verificado" : "Propietario Verificado"}
                            </p>
                            <p className="text-neutral-400 text-xs mt-1">{targetUser.email}</p>
                        </div>

                        {/* Score Card */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col items-center justify-center gap-2 mb-6">
                            <p className="text-xs uppercase font-bold text-neutral-400 tracking-widest">Reputación RentTruth</p>
                            <div className="flex items-center gap-3">
                                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                <span className="text-5xl font-black text-brand-blue tracking-tighter">
                                    {averageRating}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${reviewCount > 0 && Number(averageRating) >= star ? "text-yellow-400 fill-yellow-400" : "text-neutral-200"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-neutral-400 font-medium">({reviewCount} reseñas)</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
                                <ShieldCheck className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Identidad</p>
                                <p className="text-sm font-bold text-brand-blue">Verificada</p>
                            </div>
                            <div className="bg-green-50/50 p-3 rounded-xl border border-green-100 text-center">
                                <Calendar className="w-5 h-5 text-brand-green mx-auto mb-1" />
                                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Miembro</p>
                                <p className="text-sm font-bold text-brand-green">Activo</p>
                            </div>
                        </div>

                        {/* Footer / Logo */}
                        <div className="text-center pt-4 border-t border-neutral-100">
                            <div className="flex items-center justify-center gap-1.5 opacity-40 grayscale">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="font-bold text-sm tracking-tight">RentTruth Indicator</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-2">
                                Escaneado el {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-4 left-4 right-4 bottom-4 bg-brand-blue/5 rounded-[2rem] transform rotate-3 -z-10"></div>
                <div className="absolute top-4 left-4 right-4 bottom-4 bg-brand-green/5 rounded-[2rem] transform -rotate-3 -z-20"></div>
            </div>
        </div>
    );
}
