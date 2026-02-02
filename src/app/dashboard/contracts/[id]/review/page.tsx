"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { REVIEW_QUESTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

export default function ReviewContractPage() {
    const params = useParams(); // params.id is the contract ID
    const router = useRouter();
    const { user } = useAuth();
    const { contracts, reviews, addReview } = useData();

    const [scores, setScores] = useState<Record<string, number>>({});
    const [period, setPeriod] = useState<"6_MONTHS" | "END_OF_CONTRACT">(() => {
        // Calculate initial state based on existing reviews
        // We can't access 'user' or 'contract' easily here if they depend on context that might not be ready?
        // Actually, user and contracts come from hooks.
        // But initializing state from props/context is fine if they are stable.
        // However, 'contracts' might be empty initially.
        return "6_MONTHS";
    });
    const [comment, setComment] = useState("");

    const contractId = params.id as string;
    const contract = contracts.find((c) => c.id === contractId);

    // Check existing reviews
    const hasReviewed6Months = user ? reviews.some(
        (r) => r.contractId === contractId && r.reviewerId === user.email && r.period === "6_MONTHS"
    ) : false;
    const hasReviewedFinal = user ? reviews.some(
        (r) => r.contractId === contractId && r.reviewerId === user.email && r.period === "END_OF_CONTRACT"
    ) : false;

    // Effect to update period ONCE when data loads, if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (hasReviewed6Months && !hasReviewedFinal && period !== "END_OF_CONTRACT") {
            setPeriod("END_OF_CONTRACT");
        }
    }, [hasReviewed6Months, hasReviewedFinal, period]);

    // Initial checks
    useEffect(() => {
        if (!user || !contract) return;

        // If both reviewed
        if (hasReviewed6Months && hasReviewedFinal) {
            alert("Ya has completado todas las valoraciones para este contrato.");
            router.push("/dashboard/contracts");
            return;
        }
    }, [contract, user, hasReviewed6Months, hasReviewedFinal, router]);


    if (!user || !contract) return <div className="p-8">Cargando contrato...</div>;

    // Determines questions
    const isLandlord = user.role === "LANDLORD";
    const questions = isLandlord
        ? REVIEW_QUESTIONS.LANDLORD_RATING_TENANT
        : REVIEW_QUESTIONS.TENANT_RATING_LANDLORD;

    const targetEmail = isLandlord ? contract.tenantEmail : contract.landlordId;

    const handleRatingChange = (category: string, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Safety check again
        if ((period === "6_MONTHS" && hasReviewed6Months) || (period === "END_OF_CONTRACT" && hasReviewedFinal)) {
            alert("Ya has enviado esta valoración.");
            return;
        }

        // Validate all questions answered
        if (Object.keys(scores).length < questions.length) {
            alert("Por favor, responde a todas las preguntas.");
            return;
        }

        addReview({
            contractId: contract.id,
            reviewerId: user.email,
            targetId: targetEmail,
            categories: scores,
            period,
            comment,
        });

        alert("¡Valoración enviada con éxito!");
        router.push("/dashboard/reviews");
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-brand-blue mb-2">Valorar Contrato</h1>
            <p className="text-neutral-500 mb-8">
                Tu opinión ayuda a construir un mercado más transparente.
                Estás valorando a <span className="font-semibold">{targetEmail}</span>.
            </p>

            <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-lg mb-8">
                    <CardHeader>
                        <CardTitle>Tipo de valoración</CardTitle>
                        <CardDescription>¿En qué momento del contrato estáis?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={period} onValueChange={(v) => setPeriod(v as "6_MONTHS" | "END_OF_CONTRACT")} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="6_MONTHS" id="6_months" className="peer sr-only" disabled={hasReviewed6Months} />
                                <Label
                                    htmlFor="6_months"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all
                                        ${hasReviewed6Months
                                            ? "bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                                            : "bg-popover border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:text-brand-blue"
                                        }`}
                                >
                                    <span className="text-xl mb-1">📅</span>
                                    <span className="font-semibold">6 Meses</span>
                                    {hasReviewed6Months && <span className="text-xs text-brand-green font-medium mt-1">(Realizada)</span>}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="END_OF_CONTRACT" id="end_contract" className="peer sr-only" disabled={hasReviewedFinal} />
                                <Label
                                    htmlFor="end_contract"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all
                                        ${hasReviewedFinal
                                            ? "bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                                            : "bg-popover border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:text-brand-blue"
                                        }`}
                                >
                                    <span className="text-xl mb-1">🏁</span>
                                    <span className="font-semibold">Final del Contrato</span>
                                    {hasReviewedFinal && <span className="text-xs text-brand-green font-medium mt-1">(Realizada)</span>}
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg mb-8">
                    <CardHeader>
                        <CardTitle>Cuestionario de Calidad</CardTitle>
                        <CardDescription>Puntúa del 1 al 5 cada aspecto</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {questions.map((q) => (
                            <div key={q.id} className="space-y-2 border-b border-neutral-100 pb-4 last:border-0">
                                <Label className="text-base font-medium text-brand-blue block mb-2">
                                    {q.label}
                                </Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(q.id, star)}
                                            className={`transition-all hover:scale-110 p-1 ${(scores[q.id] || 0) >= star
                                                ? "text-brand-green"
                                                : "text-neutral-200 hover:text-brand-green/50"
                                                }`}
                                        >
                                            <Star className={`w-8 h-8 ${(scores[q.id] || 0) >= star ? "fill-current" : ""
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="space-y-2 pt-4">
                            <Label htmlFor="comment" className="text-brand-blue font-medium">Comentario público</Label>
                            <Textarea
                                id="comment"
                                placeholder="Comparte más detalles sobre tu experiencia..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white text-lg h-12">
                            Enviar Valoración
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
