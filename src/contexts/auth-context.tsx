"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type UserRole = "TENANT" | "LANDLORD";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    photoUrl?: string;
    phone?: string;
    phoneVerified: boolean;
    identityVerified: boolean;
    identityStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
    register: (email: string, role: UserRole, password?: string, name?: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    getPublicUser: (email: string) => Promise<User | null>;
    verifyEmail: () => void;
    startPhoneVerification: (phone: string) => Promise<{ error?: string }>;
    verifyPhoneOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user profile from 'profiles' table
    const fetchProfile = async (userId: string, email: string): Promise<User | null> => {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                attempts++;
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error && error.code !== "PGRST116") { // PGRST116 is "Row not found"
                    console.error(`Attempt ${attempts} failed fetching profile:`, error);
                    if (attempts === maxAttempts) {
                        alert(`Error obteniendo perfil tras ${maxAttempts} intentos: ${error.message} (${error.code})`);
                        return null;
                    }
                    // Wait before retry
                    await new Promise(r => setTimeout(r, 1000 * attempts));
                    continue;
                }

                if (data) {
                    const mappedUser: User = {
                        id: data.id,
                        name: data.name || email.split('@')[0],
                        email: data.email || email,
                        role: data.role as UserRole,
                        emailVerified: data.email_verified || false,
                        photoUrl: data.photo_url,
                        phone: data.phone,
                        phoneVerified: data.phone_verified || false,
                        identityVerified: data.identity_verified || false,
                        identityStatus: data.identity_status || 'PENDING'
                    };
                    setUser(mappedUser);
                    return mappedUser;
                } else {
                    // FALLBACK
                    console.warn("Profile missing. Attempting fallback creation...");

                    const { data: { session } } = await supabase.auth.getSession();
                    const metadata = session?.user?.user_metadata || {};
                    const fallbackRole = metadata.role || "TENANT";
                    const fallbackName = metadata.name || email.split('@')[0];

                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: userId,
                            email: email,
                            name: fallbackName,
                            role: fallbackRole
                        })
                        .select()
                        .single();

                    if (insertError) {
                        console.error("Error creating profile fallback:", insertError);
                        alert(`Error creando perfil (fallback): ${insertError.message} (${insertError.code})`);
                        return null;
                    }

                    if (newProfile) {
                        const mappedUser: User = {
                            id: newProfile.id,
                            name: newProfile.name,
                            email: newProfile.email,
                            role: newProfile.role as UserRole,
                            emailVerified: newProfile.email_verified || false,
                            photoUrl: newProfile.photo_url,
                            phone: newProfile.phone,
                            phoneVerified: newProfile.phone_verified || false,
                            identityVerified: newProfile.identity_verified || false,
                            identityStatus: newProfile.identity_status || 'PENDING'
                        };
                        setUser(mappedUser);
                        return mappedUser;
                    }
                }
                // Valid exit
                break;

            } catch (err: any) {
                console.error(`Attempt ${attempts} unexpected error:`, err);
                if (attempts === maxAttempts) {
                    alert(`Error inesperado login tras ${maxAttempts} intentos: ${err?.message || JSON.stringify(err)}`);
                }
                await new Promise(r => setTimeout(r, 1000 * attempts));
            }
        }
        return null;
    };

    // Initialize Auth Listener
    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                console.log("Session found on mount:", session.user.email);
                await fetchProfile(session.user.id, session.user.email);
            }
            setIsLoading(false);

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                console.log("Auth State Change:", event);
                if (event === 'SIGNED_IN' && session?.user.email) {
                    await fetchProfile(session.user.id, session.user.email);
                    // router.refresh(); // Conflict with login router.push
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    router.push("/login"); // Force redirect on logout
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        initAuth();
    }, [router]);

    const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
        if (!password) return false;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.warn("Login warning:", error.message);
            alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            return false;
        }

        if (data.user) {
            // Force fetch profile to ensure we have the role
            const userProfile = await fetchProfile(data.user.id, data.user.email!);

            if (!userProfile) {
                alert("Login correcto pero no se pudo cargar tu perfil.");
                return false;
            }

            if (userProfile.role !== role) {
                alert(`Atención: Estás registrado como ${userProfile.role === 'TENANT' ? 'Inquilino' : 'Propietario'}. Te redirigiremos a tu panel correspondiente.`);
                // Proceed anyway, but redirect to the CORRECT dashboard
                if (userProfile.role === "LANDLORD") {
                    router.push("/dashboard/landlord");
                } else {
                    router.push("/dashboard/tenant");
                }
                return true;
            }

            if (role === "LANDLORD") {
                router.push("/dashboard/landlord");
            } else {
                router.push("/dashboard/tenant");
            }
            return true;
        }

        return false;
    };

    const register = async (email: string, role: UserRole, password?: string, name?: string) => {
        if (!password) return;

        // Sign Up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: role
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        if (data.user) {
            alert("Cuenta creada. Por favor, verifica tu email si es necesario.");
            // Profile should be created by Postgres Trigger defined in schema.sql
            router.push("/verify-request");
        }
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) return;

        // Map frontend User fields to DB columns
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.photoUrl) dbUpdates.photo_url = updates.photoUrl;
        if (updates.emailVerified !== undefined) dbUpdates.email_verified = updates.emailVerified;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.phoneVerified !== undefined) dbUpdates.phone_verified = updates.phoneVerified;
        if (updates.identityVerified !== undefined) dbUpdates.identity_verified = updates.identityVerified;
        if (updates.identityStatus) dbUpdates.identity_status = updates.identityStatus;

        // Update local state optimistic
        setUser(prev => prev ? { ...prev, ...updates } : null);

        const { error: updateError } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', user.id);

        if (updateError) {
            console.error("FATAL: Error updating profile DB:", updateError);
            alert(`Error de base de datos: ${updateError.message}`);
            // Rollback optimistic update ideally, but for now simple alert
            return;
        }
    };

    const verifyEmail = async () => {
        if (user) {
            await updateProfile({ emailVerified: true });
        }
    };

    const startPhoneVerification = async (phone: string) => {
        // Mock for development if Supabase SMS is not configured
        if (process.env.NODE_ENV === 'development') {
            console.log("DEV MOCK: Sending OTP to", phone);
            return { error: undefined };
        }

        const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });
        return { error: error?.message };
    };

    const verifyPhoneOtp = async (phone: string, token: string) => {
        // Mock for development
        if (process.env.NODE_ENV === 'development' && token === '123456') {
            console.log("DEV MOCK: Verifying OTP for", phone);
            await updateProfile({ phone: phone, phoneVerified: true });
            return { success: true };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });

        if (error) return { success: false, error: error.message };

        if (data.session && user) {
            // Update profile phone verified status
            await updateProfile({ phone: phone, phoneVerified: true });
            return { success: true };
        }

        return { success: false, error: "Verificación fallida" };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        // Listener handles redirect
    };

    const getPublicUser = async (email: string): Promise<User | null> => {
        // Public profiles query
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (data) {
            return {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role as UserRole,
                emailVerified: data.email_verified,
                photoUrl: data.photo_url,
                phoneVerified: data.phone_verified || false,
                identityVerified: data.identity_verified || false,
                identityStatus: data.identity_status || 'PENDING'
            };
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{
            user, login, register, updateProfile, verifyEmail, logout, isAuthenticated: !!user, isLoading, getPublicUser,
            startPhoneVerification, verifyPhoneOtp
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
