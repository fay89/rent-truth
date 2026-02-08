"use client";

import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { useMarketStats } from "@/hooks/use-market-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, FileText, ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Shared Components
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReputationHero } from "@/components/dashboard/reputation-hero";
import { VerificationCard } from "@/components/dashboard/verification-card";
import { ContractsStatCard } from "@/components/dashboard/contracts-stat-card";
import { MarketInsights } from "@/components/dashboard/market-insights";
import { ProgressSection } from "@/components/dashboard/progress-section";

export default function TenantDashboard() {
    const { getContractsByTenant, signContract, reviews } = useData();
    const { user } = useAuth();
    const stats = useMarketStats();

    if (!user) return null;

    const contracts = getContractsByTenant(user.email);
    const pendingContracts = contracts.filter(c => c.status === "PENDING");

    // Metrics
    const myReviews = reviews.filter(r => r.targetId === user.email);
    const rating = myReviews.length > 0
        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
        : "N/A";

    const hasProfile = user.identityVerified;
    const hasContract = contracts.length > 0;
    const hasReview = myReviews.length > 0;

    const handleVerify = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("¿Confirmas que has leído y aceptas el contrato?")) {
            await signContract(id);
        }
    };

    return (
        <DashboardGrid>
            {/* 1. Hero / Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReputationHero
                    user={user}
                    rating={rating}
                    reviewCount={myReviews.length}
                    colorScheme="blue"
                />

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <VerificationCard hasProfile={hasProfile} userRole="TENANT" />
                    <ContractsStatCard
                        userRole="TENANT"
                        totalCount={contracts.length}
                        pendingCount={pendingContracts.length}
                    />
                </div>
            </div>

            {/* 2. Market Insights */}
            <MarketInsights userRole="TENANT" stats={stats} />

            {/* 3. Main Content & Sidebar */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Sections Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Actividad Reciente</h2>
                        <Link href="/dashboard/contracts" className="text-sm font-semibold text-brand-blue hover:underline flex items-center gap-1">
                            Ver todo <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Pending Contracts Detailed List */}
                    {pendingContracts.length > 0 && (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10"></div>
                            <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5" /> Requiere tu firma
                            </h3>
                            <div className="space-y-3">
                                {pendingContracts.map(contract => (
                                    <div key={contract.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-orange-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 transition-transform hover:scale-[1.01]">
                                        <div>
                                            <p className="font-bold text-slate-800">{contract.propertyAddress}</p>
                                            <p className="text-xs text-slate-500">Propietario: {contract.landlordId}</p>
                                        </div>
                                        <Button onClick={(e) => handleVerify(contract.id, e)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg shadow-orange-500/20">
                                            Revisar y Firmar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Latest Contracts */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {contracts.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-bold mb-2">Aún no tienes contratos</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                                    Pide a tu propietario que cree el contrato en RentTruth para empezar a generar historial.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {contracts.slice(0, 5).map((contract) => (
                                    <Link href={`/dashboard/contracts/${contract.id}`} key={contract.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 group-hover:text-brand-blue transition-colors">{contract.propertyAddress}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5",
                                                        contract.status === 'VERIFIED' ? "bg-green-50 text-green-700 border-green-200" :
                                                            contract.status === 'PENDING' ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-slate-100 text-slate-600")}>
                                                        {contract.status === 'VERIFIED' ? 'Verificado' : contract.status}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400">{contract.startDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <ProgressSection
                    userRole="TENANT"
                    hasProfile={hasProfile}
                    hasContract={hasContract}
                    hasReview={hasReview}
                />
            </div>
        </DashboardGrid>
    );
}
