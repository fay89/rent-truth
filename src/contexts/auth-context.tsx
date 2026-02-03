"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

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
                    .maybeSingle();

                if (error) {
                    // Check if error is actually an AbortError wrapped by Supabase
                    const isAbort = error.message?.includes('AbortError') ||
                        error.message?.includes('aborted') ||
                        error.code === '20';

                    if (isAbort) {
                        console.debug(`Attempt ${attempts} aborted (Supabase error). Navigation likely occurred.`);
                        return null;
                    }

                    console.error(`Attempt ${attempts} failed fetching profile:`, error);
                    if (attempts === maxAttempts) {
                        // Only alert if it's NOT an abort error (which we filtered) and NOT a network fluctuation likely to pass
                        alert(`Error obteniendo perfil tras ${maxAttempts} intentos: ${error.message} (${error.code})`);
                        return null;
                    }
                    // Wait before retry
                    await new Promise(r => setTimeout(r, 1000 * attempts));
                    continue;
                }

                if (data) {
                    console.log(`[Auth] Perfil cargado: ${data.email} | Rol: ${data.role}`);
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
                    console.warn("[Auth] fetchProfile devolvió data=null pero sin error. Esto es inusual.");
                    alert("Error crítico: Tu usuario existe pero tu perfil de datos no aparece. Por favor contacta soporte.");
                    return null;
                }
                // Valid exit
                break;

            } catch (err: any) {
                // Ignore AbortError (caused by navigation/unmount)
                const isAbort = err.name === 'AbortError' ||
                    err.message?.includes('aborted') ||
                    String(err).includes('AbortError');

                if (isAbort) {
                    console.debug(`Attempt ${attempts} aborted. Navigation likely occurred.`);
                    return null;
                }

                console.error(`Attempt ${attempts} unexpected error:`, err);
                // Removed intrusive alert to prevent bad UX on fleeting network errors or race conditions
                // if (attempts === maxAttempts) {
                //    alert(...) 
                // }

                await new Promise(r => setTimeout(r, 1000 * attempts));
            }
        }
        return null;
    };

    // Initialize Auth Listener
    useEffect(() => {
        let mounted = true;

        console.log("Initializing Auth Listener...");
        if (mounted) setIsLoading(true);

        // We use a variable to store the subscription cleanup function
        // because onAuthStateChange is technically async in recent Supabase versions but returns a subscription immediately often?
        // Wait, supabase.auth.onAuthStateChange returns { data: { subscription } } synchronously usually, 
        // but let's handle the promise correctly if it is one. Used to be sync.

        // Actually, supabase.auth.onAuthStateChange IS synchronous in returning the subscription object wrapper in v2,
        // but let's follow the safe pattern.

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log("Auth State Change:", event);

            if (session?.user?.email) {
                await fetchProfile(session.user.id, session.user.email);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                // Safe redirect check
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
                    router.push("/login");
                }
            }

            if (mounted) setIsLoading(false);
        });

        // Cleanup function returned synchronously
        return () => {
            console.log("Cleaning up Auth Listener...");
            mounted = false;
            subscription.unsubscribe();
        };
    }, [router]);

    const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
        if (!password) return false;

        setIsLoading(true);
        try {
            console.log("Iniciando login para:", email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.warn("Login error:", error.message);
                alert("Error al iniciar sesión: " + error.message);
                setIsLoading(false);
                return false;
            }

            if (data.user) {
                console.log("Autenticación exitosa. Obteniendo perfil...");

                // Intento directo de obtener perfil
                const userProfile = await fetchProfile(data.user.id, data.user.email!);

                if (!userProfile) {
                    // Si falla el perfil, NO bloqueamos.
                    // Probablemente el listener lo capture o sea un fallo temporal.
                    // Redirigimos basándonos en el rol solicitado como fallback optimista.
                    console.warn("No se pudo cargar el perfil inmediatamente. Usando rol solicitado como fallback.");

                    setIsLoading(false); // Liberar UI
                    if (role === "LANDLORD") {
                        router.push("/dashboard/landlord");
                    } else if (role === "ADMIN") {
                        // Admin requires stricter check usually, but for now allow flow
                        router.push("/dashboard/admin");
                    } else {
                        router.push("/dashboard/tenant");
                    }
                    return true;
                }

                // Perfil cargado correctamente
                setIsLoading(false); // Liberar UI
                if (userProfile.role === 'ADMIN') {
                    router.push("/dashboard/admin");
                    return true;
                }

                if (userProfile.role !== role) {
                    setIsLoading(false); // Liberar UI
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

        } catch (error: any) {
            console.error("Critical login error:", error);
            alert("Error inesperado: " + error.message);
            setIsLoading(false);
            return false;
        }
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
            user, login, register, updateProfile, verifyEmail, logout, isAuthenticated: !!user, isLoading, getPublicUser
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
