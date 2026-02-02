"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";

interface RateUserDialogProps {
    contractId: string;
    targetId: string; // The person being rated
    targetName: string; // For display
    onRate?: () => void;
}

export function RateUserDialog({ contractId, targetId, targetName, onRate }: RateUserDialogProps) {
    const { user } = useAuth();
    const { addReview } = useData();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && rating > 0) {
            addReview({
                contractId,
                reviewerId: user.email,
                targetId,
                // rating, // Removed as addReview calculates it
                categories: { "General": rating },
                period: "6_MONTHS", // Default for manual/generic reviews
                comment,
            });
            setOpen(false);
            setRating(0);
            setComment("");
            if (onRate) onRate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10">
                    <Star className="h-4 w-4 mr-2" />
                    Valorar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
                <DialogHeader>
                    <DialogTitle>Valorar a {targetName}</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Comparte tu experiencia. Tu reseña será verificada por este contrato.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`focus:outline-none transition-colors ${rating >= star ? "text-yellow-400" : "text-neutral-600 hover:text-yellow-400/50"
                                        }`}
                                >
                                    <Star className="h-8 w-8 fill-current" />
                                </button>
                            ))}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="comment" className="text-neutral-300">
                                Comentario
                            </Label>
                            <Input
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="¿Cómo fue tu experiencia?"
                                className="bg-neutral-800 border-neutral-700 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={rating === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Enviar Reseña
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
