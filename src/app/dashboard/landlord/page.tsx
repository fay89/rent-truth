"use client";

import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { useMarketStats } from "@/hooks/use-market-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Shared Components
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ReputationHero } from "@/components/dashboard/reputation-hero";
import { VerificationCard } from "@/components/dashboard/verification-card";
import { ContractsStatCard } from "@/components/dashboard/contracts-stat-card";
import { MarketInsights } from "@/components/dashboard/market-insights";
import { ProgressSection } from "@/components/dashboard/progress-section";

export default function LandlordDashboard() {
    const { user } = useAuth();
    const stats = useMarketStats();
    const { getContractsByLandlord, reviews } = useData();

    if (!user) return null;

    const contracts = getContractsByLandlord(user.email);
    const pendingContracts = contracts.filter(c => c.status === "PENDING" || c.status === "VERIFIED");
    const activeContracts = contracts.filter(c => c.status === "ACTIVE").length;

    // Metrics
    const myReviews = reviews.filter(r => r.targetId === user.email);
    const rating = myReviews.length > 0
        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
        : "N/A";

    const hasProfile = user.identityVerified;
    const hasContract = contracts.length > 0;
    const hasReview = myReviews.length > 0;

    return (
        <DashboardGrid>
            {/* 1. Hero / Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* REPUTATION IS NOW HERO (Moved from small card) */}
                <ReputationHero
                    user={user}
                    rating={rating}
                    reviewCount={myReviews.length}
                    colorScheme="slate"
                />

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Verification Status */}
                    <VerificationCard hasProfile={hasProfile} userRole="LANDLORD" />

                    {/* PROPERTIES IS NOW A CARD (Moved from Hero) */}
                    <ContractsStatCard
                        userRole="LANDLORD"
                        totalCount={contracts.length}
                        pendingCount={pendingContracts.length}
                        activeCount={activeContracts}
                    />
                </div>
            </div>

            {/* 2. Market Insights */}
            <MarketInsights userRole="LANDLORD" stats={stats} />

            {/* 3. Main Content & Sidebar */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Mis Contratos & Propiedades</h2>
                        <Link href="/dashboard/contracts" className="text-sm font-semibold text-brand-blue hover:underline flex items-center gap-1">
                            Gestionar todo <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Contract List */}
                    <div className="glass-card rounded-[2rem] overflow-hidden">
                        {contracts.length === 0 ? (
                            <div className="text-center py-20 px-6">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Plus className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg mb-2">Comienza ahora</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                    Crea tu primer contrato digital. Es gratuito, seguro y te permite recibir valoraciones reales.
                                </p>
                                <Link href="/dashboard/contracts/new">
                                    <Button size="lg" className="rounded-full px-8 bg-brand-blue hover:bg-slate-800">
                                        Crear Primer Contrato
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {contracts.map(contract => (
                                    <Link href={`/dashboard/contracts/${contract.id}`} key={contract.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg group-hover:text-brand-blue transition-colors">{contract.propertyAddress}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 rounded-md",
                                                        contract.status === 'VERIFIED' ? "bg-green-50 text-green-700 border-green-200" :
                                                            contract.status === 'PENDING' ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-slate-100 text-slate-600")}>
                                                        {contract.status === 'VERIFIED' ? 'Verificado' : contract.status === 'PENDING' ? 'Pendiente' : contract.status}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {contract.tenantEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-slate-700">Contrato</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <ProgressSection
                    userRole="LANDLORD"
                    hasProfile={hasProfile}
                    hasContract={hasContract}
                    hasReview={hasReview}
                    stats={stats}
                />
            </div>
        </DashboardGrid>
    );
}
