import { Button } from "@/components/ui/button";
import { ShareReputationDialog } from "@/components/share-reputation-dialog";
import { Star, QrCode } from "lucide-react";

interface ReputationHeroProps {
    user: {
        name: string;
        photoUrl?: string | null;
    };
    rating: string | number;
    reviewCount: number;
    colorScheme?: "blue" | "slate"; // To distinguish or unify themes if needed
}

export function ReputationHero({ user, rating, reviewCount, colorScheme = "blue" }: ReputationHeroProps) {
    const bgClass = colorScheme === "blue"
        ? "bg-gradient-to-br from-brand-blue to-[#0f172a] shadow-2xl shadow-brand-blue/20 border border-white/10"
        : "bg-slate-900 shadow-xl border border-slate-800";

    return (
        <div className={`md:col-span-1 rounded-[2rem] p-8 text-white relative overflow-hidden group ${bgClass} transition-all duration-500 hover:scale-[1.01]`}>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="h-20 w-20 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500">
                            {user.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-white text-3xl font-heading font-bold">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-blue-200/80 mb-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-[pulse_3s_infinite]" />
                                <span className="font-bold tracking-widest text-xs uppercase">Reputación</span>
                            </div>
                            <h3 className="font-heading text-lg font-semibold leading-tight">{user.name}</h3>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-6xl font-heading font-extrabold tracking-inute bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">{rating}</span>
                        <span className="text-xl text-blue-200/40 font-medium">/ 5.0</span>
                    </div>
                    <p className="text-sm text-blue-200/60 mt-2 font-medium">{reviewCount} reseñas verificadas</p>
                </div>
                <div className="mt-8">
                    <ShareReputationDialog
                        trigger={
                            <Button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/10 shadow-lg transition-all group-hover:translate-y-[-2px]">
                                <div className="flex items-center gap-2">
                                    <QrCode className="w-4 h-4" />
                                    <span>Compartir mi QR</span>
                                </div>
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
