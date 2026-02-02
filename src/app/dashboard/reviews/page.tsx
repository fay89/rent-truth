"use client";

import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, Quote } from "lucide-react";

export default function ReviewsPage() {
    const { user } = useAuth();
    const { reviews } = useData();

    if (!user) return null;

    const myReviews = reviews.filter(r => r.targetId === user.email);
    const averageRating = myReviews.length > 0
        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue">Valoraciones</h1>
                <p className="text-neutral-500">Tu reputación basada en contratos reales.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="col-span-1 border-none shadow-sm bg-brand-blue text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Star className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-blue-100">Puntuación Media</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <div className="text-6xl font-extrabold text-brand-green mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${Number(averageRating) >= star ? "text-brand-green fill-brand-green" : "text-blue-800"}`}
                                />
                            ))}
                        </div>
                        <p className="text-blue-200">{myReviews.length} valoraciones verificadas</p>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-white flex flex-col justify-center">
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <ThumbsUp className="w-6 h-6 text-brand-green" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-brand-blue">Construye confianza</h3>
                                <p className="text-neutral-500">Cada valoración positiva aumenta tus posibilidades de cerrar mejores contratos en el futuro.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-brand-blue mt-8 mb-4">Historial de Reviews</h2>
            <div className="grid gap-4">
                {myReviews.length === 0 ? (
                    <Card className="border-dashed border-neutral-200 shadow-none bg-neutral-50">
                        <CardContent className="py-12 text-center text-neutral-500">
                            Aún no has recibido valoraciones. Completa contratos para empezar a recibir feedback.
                        </CardContent>
                    </Card>
                ) : (
                    myReviews.map((review) => (
                        <Card key={review.id} className="border-none shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-neutral-100 p-2 rounded-full">
                                        <Quote className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-brand-blue">{review.reviewerId}</p>
                                                <p className="text-xs text-neutral-400">{review.createdAt}</p>
                                            </div>
                                            <div className="flex items-center bg-green-50 px-2 py-1 rounded text-brand-green font-bold text-sm">
                                                <Star className="w-3.5 h-3.5 fill-brand-green mr-1" />
                                                {review.rating}
                                            </div>
                                        </div>
                                        <p className="italic text-neutral-600 mb-2">&quot;{review.comment}&quot;</p>
                                        <div className="mt-3 text-xs text-neutral-400 bg-neutral-50 inline-block px-2 py-1 rounded">
                                            Contrato verificado: {review.contractId}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
