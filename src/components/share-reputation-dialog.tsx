"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Copy, Check, ExternalLink, CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { useState } from "react";
import Link from "next/link";

export function ShareReputationDialog({ trigger }: { trigger?: React.ReactNode }) {
    const { user } = useAuth();
    const { reviews } = useData();
    const [copied, setCopied] = useState(false);

    if (!user) return null;

    // Calculate rating for preview
    const userReviews = reviews.filter(r => r.targetId === user.email);
    const reviewCount = userReviews.length;
    const averageRating = reviewCount > 0
        ? (userReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
        : "N/A";

    // Generate Link
    // In dev: localhost:3000/verify/...
    // In prod: domain/verify/...
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const verificationUrl = `${origin}/verify/${encodeURIComponent(user.email)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <QrCode className="w-4 h-4" />
                        <span className="hidden sm:inline">Compartir Reputación</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-neutral-50/95 backdrop-blur-sm border-neutral-100">
                <DialogHeader className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-neutral-100">
                    <DialogTitle className="flex items-center gap-2 text-xl text-brand-blue">
                        <Share2 className="w-6 h-6" />
                        Comparte tu Reputación
                    </DialogTitle>
                    <DialogDescription className="max-w-[80%] mx-auto">
                        Muestra este código QR a propietarios o inquilinos para que verifiquen tu identidad y scoring.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-8">
                    {/* QR Card Container */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-brand-blue/5 border border-white flex flex-col items-center gap-6 w-full max-w-[300px] transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-brand-blue/10 relative group">
                            <div className="absolute inset-0 bg-brand-blue/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <QRCode
                                value={verificationUrl}
                                size={220}
                                viewBox={`0 0 256 256`}
                                level="H"
                                bgColor="#ffffff"
                                fgColor="#1e3a8a" // Brand Blue
                                className="mix-blend-multiply"
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-1.5">
                                <p className="font-bold text-brand-blue text-xl">{user.name}</p>
                                {user.identityVerified && (
                                    <CheckCircle2 className="w-5 h-5 text-brand-green fill-brand-green/20" />
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500">
                                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-100 text-xs font-bold">
                                    <span className="text-yellow-500">★</span> {averageRating}
                                </span>
                                <span className="text-neutral-300">•</span>
                                <span className="uppercase text-[10px] tracking-widest font-semibold text-neutral-400">{user.role === "TENANT" ? "Inquilino" : "Propietario"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full max-w-[320px] bg-white p-1.5 rounded-xl border border-neutral-200 shadow-sm">
                        <div className="flex-1 px-3 py-1.5 bg-transparent text-xs text-neutral-500 truncate font-mono select-all text-center">
                            {verificationUrl}
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-neutral-100 rounded-lg" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                            </Button>
                            <div className="w-px h-4 bg-neutral-200 my-auto"></div>
                            <Link href={`/verify/${encodeURIComponent(user.email)}`} target="_blank">
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-neutral-100 rounded-lg">
                                    <ExternalLink className="w-4 h-4 text-neutral-500" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
