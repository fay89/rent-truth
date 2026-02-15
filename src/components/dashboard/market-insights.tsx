import { ShieldCheck, Zap, Users, Shield, Clock, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface InsightCardProps {
    icon: ReactNode;
    title: string;
    description: ReactNode;
    color: "blue" | "emerald" | "indigo" | "orange" | "purple";
}

function InsightCard({ icon, title, description, color }: InsightCardProps) {
    const colorStyles = {
        blue: "bg-blue-50/50 border-blue-100 text-blue-600 ring-blue-500/20",
        emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600 ring-emerald-500/20",
        indigo: "bg-indigo-50/50 border-indigo-100 text-indigo-600 ring-indigo-500/20",
        orange: "bg-orange-50/50 border-orange-100 text-orange-600 ring-orange-500/20",
        purple: "bg-purple-50/50 border-purple-100 text-purple-600 ring-purple-500/20",
    };

    const wrapperClass = `glass-card p-5 rounded-2xl flex items-start gap-4 hover:bg-white/90 group transition-all duration-300`;
    // const iconClass = `bg-white p-2.5 rounded-xl shadow-sm ${colorStyles[color].split(" ")[3]} shrink-0 group-hover:scale-110 transition-transform duration-300 ring-1`;
    const iconClass = `p-3 rounded-2xl shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300 ring-1 ${colorStyles[color]}`;

    return (
        <div className={wrapperClass}>
            <div className={iconClass}>
                {icon}
            </div>
            <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm mb-1">{title}</h4>
                <p className="text-sm text-slate-600 leading-snug font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
}

interface MarketInsightsProps {
    userRole: "TENANT" | "LANDLORD";
    stats: any;
}

export function MarketInsights({ userRole, stats }: MarketInsightsProps) {
    if (userRole === "TENANT") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                    color="blue"
                    icon={<ShieldCheck className="w-6 h-6" />}
                    title="Confianza Total"
                    description={<>El <span className="font-bold text-brand-blue">{stats.landlordPreference}% de los propietarios</span> priorizan candidatos con identidad verificada.</>}
                />
                <InsightCard
                    color="emerald"
                    icon={<Zap className="w-6 h-6" />}
                    title="Ultra Rápido"
                    description={<>Consigue alquiler <span className="font-bold text-emerald-600">{stats.rentalSpeed}x más rápido</span> al presentar tu historial validado.</>}
                />
                <InsightCard
                    color="indigo"
                    icon={<Users className="w-6 h-6" />}
                    title={`+${stats.activeTenants.toLocaleString()} Inquilinos`}
                    description={<>Únete a la comunidad que está transformando el alquiler en una experiencia <span className="font-bold text-indigo-600">segura y justa</span>.</>}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
                color="blue"
                icon={<Shield className="w-6 h-6" />}
                title="Cero Impagos"
                description={<>Reducción del <span className="font-bold text-brand-blue">{stats.paymentSuccess}% en incidentes</span> al usar contratos validados por RentTruth.</>}
            />
            <InsightCard
                color="orange"
                icon={<Clock className="w-6 h-6" />}
                title="Gestión Ágil"
                description={<>Cierra acuerdos en <span className="font-bold text-orange-600">menos de {stats.avgTime}h</span> mostrando tu reputación verificada.</>}
            />
            <InsightCard
                color="purple"
                icon={<Sparkles className="w-6 h-6" />}
                title="Más Valor"
                description={<>Los inquilinos perciben un <span className="font-bold text-purple-600">{stats.valueIncrease}% más valor</span> en propiedades con propietarios transparentes.</>}
            />
        </div>
    );
}
