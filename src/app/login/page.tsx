"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

import { APP_VERSION } from "@/lib/version";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("TENANT");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setIsLoading(true);

            // UI Safety Net: Force unlock after 8 seconds if context hangs
            const safetyTimeout = setTimeout(() => {
                if (isLoading) { // Check if still loading
                    console.warn("UI Safety Timeout triggered");
                    setIsLoading(false);
                    alert("El inicio de sesión está tardando demasiado. \n\nPor favor:\n1. Comprueba tu conexión.\n2. Si persiste, recarga la página (tira hacia abajo) para actualizar la App.");
                }
            }, 8000);

            try {
                const success = await login(email, role, password);
                clearTimeout(safetyTimeout); // Clear timer on response

                if (!success) {
                    // Alert is already shown by AuthContext for specific errors
                }
            } catch (err) {
                console.error("Login trigger error:", err);
                clearTimeout(safetyTimeout);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Por favor introduce correo y contraseña");
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-brand-light-gray font-sans">
            {/* Left Column (Brand/Info) - Hidden on mobile or different */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-subtle-gradient text-white relative overflow-hidden bg-brand-blue">
                <div className="z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-90 w-fit">
                        <ShieldCheck className="h-8 w-8 text-white" />
                        <span className="text-2xl font-bold">RentTruth</span>
                    </Link>
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
                        La verdad de cada alquiler, sin letra pequeña.
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Perfiles verificados</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Contratos seguros</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Reseñas auténticas</span>
                        </div>
                    </div>
                </div>
                <div className="z-10 text-sm text-blue-200 mt-12">
                    &copy; {new Date().getFullYear()} RentTruth. Puntuación Verificada.
                </div>
            </div>

            {/* Right Column (Form) */}
            <div className="flex items-center justify-center p-6 bg-white shadow-xl">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center md:text-left mb-8">
                        <div className="md:hidden flex justify-center mb-6">
                            <ShieldCheck className="h-10 w-10 text-brand-blue" />
                        </div>
                        <h2 className="text-3xl font-bold text-brand-blue mb-2">Accede a tu cuenta</h2>
                        <p className="text-neutral-500">Bienvenido de nuevo. Por favor, introduce tus datos.</p>
                    </div>

                    <div className="bg-neutral-100 p-1.5 rounded-xl grid grid-cols-2 mb-8 gap-1">
                        <button
                            type="button"
                            onClick={() => setRole("TENANT")}
                            className={`py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === "TENANT" ? "bg-white text-brand-blue shadow-sm" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            Soy Inquilino
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("LANDLORD")}
                            className={`py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === "LANDLORD" ? "bg-white text-brand-blue shadow-sm" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            Soy Propietario
                        </button>
                    </div>

                    <div className="absolute top-4 right-4 text-xs text-neutral-300 pointer-events-none opacity-50">
                        {APP_VERSION}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-brand-blue font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-white border-neutral-200 focus-visible:ring-brand-green h-12 rounded-lg text-base"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-brand-blue font-medium">Contraseña</Label>
                                <Link href="#" className="text-sm text-brand-blue/80 hover:text-brand-blue font-medium">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="bg-white border-neutral-200 focus-visible:ring-brand-green h-12 rounded-lg text-base pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-brand-blue bg-transparent border-none"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-lg font-bold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20 rounded-lg mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isLoading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-neutral-500 mt-6">
                        ¿No tienes cuenta? <Link href="/register" className="text-brand-blue font-bold hover:underline transition-colors ml-1">Crear cuenta</Link>
                    </div>
                </div>
            </div>
            {/* Dev Helper: Reset Data */}
            <div className="fixed bottom-4 right-4 animate-in fade-in duration-1000">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-neutral-300 hover:text-red-500 hover:bg-red-50"
                    onClick={() => {
                        if (confirm("¿Borrar todos los datos y usuarios?")) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                >
                    Reiniciar Sistema (Debug)
                </Button>
            </div>
        </div>
    );
}
