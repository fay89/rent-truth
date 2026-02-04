"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./auth-context";

export type ContractStatus = "PENDING" | "PENDING_ADMIN" | "VERIFIED" | "ACTIVE" | "ENDED";

export interface Contract {
    id: string;
    landlordId: string; // Stored as landlord_id in DB
    tenantEmail: string; // Stored as tenant_email in DB
    propertyAddress: string; // property_address
    startDate: string; // start_date
    endDate: string; // end_date
    status: ContractStatus;
    createdAt: string; // created_at
    contractUrl?: string; // contract_url
}

export interface Review {
    id: string;
    contractId: string; // contract_id
    reviewerId: string; // reviewer_id
    targetId: string; // target_id
    rating: number;
    categories?: Record<string, number>;
    period: "6_MONTHS" | "END_OF_CONTRACT";
    comment: string;
    createdAt: string; // created_at
}

interface DataContextType {
    contracts: Contract[];
    reviews: Review[];
    createContract: (contract: Omit<Contract, "id" | "status" | "createdAt" | "contractUrl">, file?: File | null) => Promise<void>;
    signContract: (contractId: string) => Promise<void>;
    adminVerifyContract: (contractId: string) => Promise<void>;
    addReview: (review: Omit<Review, "id" | "createdAt" | "rating"> & { categories: Record<string, number> }) => Promise<void>;
    getContractsByLandlord: (email: string) => Contract[];
    getContractsByTenant: (email: string) => Contract[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchContracts = React.useCallback(async () => {
        if (!user) return;

        // Fetch contracts where I am landlord OR tenant
        // Due to RLS, 'select *' should only return visible ones.
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching contracts:", error);
            return;
        }

        if (data) {
            const mappedContracts: Contract[] = data.map((c: any) => ({
                id: c.id,
                landlordId: c.landlord_id,
                tenantEmail: c.tenant_email,
                propertyAddress: c.property_address,
                startDate: c.start_date,
                endDate: c.end_date,
                status: c.status,
                createdAt: c.created_at,
                contractUrl: c.contract_url
            }));
            setContracts(mappedContracts);
        }
    }, [user]);

    const fetchReviews = React.useCallback(async () => {
        // Fetch all reviews (or related ones)
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching reviews:", error);
            return;
        }

        if (data) {
            const mappedReviews: Review[] = data.map((r: any) => ({
                id: r.id,
                contractId: r.contract_id,
                reviewerId: r.reviewer_id,
                targetId: r.target_id,
                rating: r.rating,
                categories: r.categories,
                period: r.period,
                comment: r.comment,
                createdAt: r.created_at
            }));
            setReviews(mappedReviews);
        }
    }, []);

    // Load data when user is present
    // Load data when user is present
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (user) {
            fetchContracts();
            fetchReviews();
        }
    }, [user, fetchContracts, fetchReviews]);

    const createContract = async (contractData: Omit<Contract, "id" | "status" | "createdAt" | "contractUrl">, file?: File | null) => {
        if (!user) return;

        let contractUrl = null;

        // 1. Upload File (if present)
        if (file) {
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('rent-files') // Changed from 'contracts'
                .upload(fileName, file);

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                alert("Error subiendo el archivo: " + uploadError.message);
                return; // Stop creation if upload fails
            }

            if (uploadData) {
                contractUrl = uploadData.path; // Store the path (e.g. "timestamp_file.pdf")
            }
        }

        // 2. Create Contract Record
        const dbPayload = {
            landlord_id: user.email, // Using email as ID for now as per schema logic
            tenant_email: contractData.tenantEmail.toLowerCase().trim(),
            property_address: contractData.propertyAddress,
            start_date: contractData.startDate,
            end_date: contractData.endDate,
            status: "PENDING",
            contract_url: contractUrl
        };

        const { data, error } = await supabase
            .from('contracts')
            .insert(dbPayload)
            .select()
            .single();

        if (error) {
            alert("Error creando contrato: " + error.message);
            return;
        }

        if (data) {
            fetchContracts(); // Refresh
        }
    };

    const signContract = async (contractId: string) => {
        // User action: Signs contract -> Moves to PENDING_ADMIN
        const { error } = await supabase
            .from('contracts')
            .update({ status: 'PENDING_ADMIN' })
            .eq('id', contractId);

        if (error) {
            alert("Error firmando contrato: " + error.message);
        } else {
            alert("Contrato firmado. Esperando verificación del administrador.");
            fetchContracts();
        }
    };

    const adminVerifyContract = async (contractId: string) => {
        // ADMIN FUNCTION: Unlocks functionality for users
        const { error } = await supabase
            .from('contracts')
            .update({ status: 'VERIFIED' }) // Verified by Admin => Ready for reviews/activity
            .eq('id', contractId);

        if (error) {
            alert("Error verificando (Admin): " + error.message);
        } else {
            // alert("Contrato verificado correctamente.");
            fetchContracts();
        }
    };

    const addReview = async (reviewData: Omit<Review, "id" | "createdAt" | "rating"> & { categories: Record<string, number> }) => {
        // Calculate average
        const scores = Object.values(reviewData.categories);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const rating = Number(average.toFixed(1));

        // Insert Review
        const { error } = await supabase
            .from('reviews')
            .insert({
                contract_id: reviewData.contractId,
                reviewer_id: reviewData.reviewerId,
                target_id: reviewData.targetId,
                rating: rating,
                categories: reviewData.categories,
                period: reviewData.period,
                comment: reviewData.comment
            })
            .select()
            .single();

        if (error) {
            alert("Error enviando reseña: " + error.message);
            return;
        }

        await fetchReviews(); // Refresh local reviews to check for completion

        // Check Logic for Contract Finalization
        if (reviewData.period === "END_OF_CONTRACT") {
            // We need to fetch FRESH reviews from DB for this contract to be sure
            // RLS allows reading reviews
            const { data: contractReviews } = await supabase
                .from('reviews')
                .select('*')
                .eq('contract_id', reviewData.contractId)
                .eq('period', 'END_OF_CONTRACT');

            if (contractReviews) {
                const contract = contracts.find(c => c.id === reviewData.contractId);
                if (contract) {
                    const hasTenant = contractReviews.some((r: { reviewer_id: string }) => r.reviewer_id === contract.tenantEmail);
                    const hasLandlord = contractReviews.some((r: { reviewer_id: string }) => r.reviewer_id === contract.landlordId);

                    if (hasTenant && hasLandlord) {
                        // Finalize Contract
                        await supabase
                            .from('contracts')
                            .update({ status: 'ENDED' })
                            .eq('id', contract.id);

                        await fetchContracts();
                    }
                }
            }
        }
    };

    const getContractsByLandlord = (email: string) => {
        return contracts.filter((c) => c.landlordId.toLowerCase() === email.toLowerCase());
    };

    const getContractsByTenant = (email: string) => {
        return contracts.filter((c) => c.tenantEmail.toLowerCase() === email.toLowerCase());
    };

    return (
        <DataContext.Provider
            value={{
                contracts,
                reviews,
                createContract,
                signContract,
                adminVerifyContract,
                addReview,
                getContractsByLandlord,
                getContractsByTenant,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
