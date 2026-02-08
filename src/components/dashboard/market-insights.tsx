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
        blue: "bg-brand-blue/5 border-brand-blue/10 text-brand-blue",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
        indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
        orange: "bg-orange-50 border-orange-100 text-orange-600",
        purple: "bg-purple-50 border-purple-100 text-purple-600",
    };

    const wrapperClass = `${colorStyles[color].split(" ")[0]} border ${colorStyles[color].split(" ")[1]} p-5 rounded-2xl flex items-start gap-4 hover:bg-opacity-75 transition-colors`;
    const iconClass = `bg-white p-2.5 rounded-xl shadow-sm ${colorStyles[color].split(" ")[2]} shrink-0`;

    return (
        <div className={wrapperClass}>
            <div className={iconClass}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
                <p className="text-sm text-slate-600 leading-snug">
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
