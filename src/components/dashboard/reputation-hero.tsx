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
        ? "bg-gradient-to-br from-brand-blue to-slate-900 shadow-brand-blue/20"
        : "bg-[#1e293b] shadow-slate-900/10 border-slate-700/50"; // Mapping landlord style but keeping structure

    return (
        <div className={`md:col-span-1 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group ${bgClass}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0 shadow-lg">
                            {user.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-blue-200 mb-1">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold tracking-wide text-sm uppercase">Reputación</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold tracking-tighter">{rating}</span>
                        <span className="text-xl text-blue-200/50">/ 5.0</span>
                    </div>
                    <p className="text-sm text-blue-200 mt-1">{reviewCount} reseñas verificadas</p>
                </div>
                <div className="mt-8">
                    <ShareReputationDialog
                        trigger={
                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm border border-white/10 shadow-lg shadow-black/10 transition-all group-hover:scale-[1.02]">
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
