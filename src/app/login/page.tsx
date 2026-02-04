"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";

import { APP_VERSION } from "@/lib/version";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("TENANT");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setIsLoading(true);

            // Safety timeout
            const safetyTimeout = setTimeout(() => {
                if (isMounted.current) {
                    setIsLoading(false);
                    alert("El sistema tardó demasiado en responder.");
                }
            }, 8000);

            try {
                const success = await login(email, role, password);
                clearTimeout(safetyTimeout);
                if (!success) {
                    // Alert handled by context
                }
            } catch (err) {
                console.error("Login trigger error:", err);
                clearTimeout(safetyTimeout);
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column (Brand/Info) */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-brand-blue relative overflow-hidden text-white">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-transparent opacity-50"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-90 transition-opacity w-fit group">
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                            <ShieldCheck className="h-8 w-8 text-brand-green" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">RentTruth</span>
                    </Link>

                    <h2 className="text-5xl font-extrabold mb-8 leading-[1.15] tracking-tight">
                        La verdad de cada alquiler, <span className="text-brand-green">verificada.</span>
                    </h2>

                    <p className="text-lg text-blue-100/80 max-w-md mb-12 leading-relaxed">
                        Únete a la única plataforma donde cada reseña está respaldada por un contrato real. Sin falsedades, solo transparencia.
                    </p>

                    <div className="space-y-6">
                        <FeatureRow text="Identidad verificada con biometría" />
                        <FeatureRow text="Contratos protegidos y encriptados" />
                        <FeatureRow text="Historial de reputación inmutable" />
                    </div>
                </div>

                <div className="relative z-10 text-xs text-blue-200/50 flex justify-between items-end">
                    <span>&copy; {new Date().getFullYear()} RentTruth Security.</span>
                    <span>v{APP_VERSION}</span>
                </div>
            </div>

            {/* Right Column (Form) */}
            <div className="flex items-center justify-center p-6 md:p-12 bg-background">
                <div className="w-full max-w-[420px] space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-brand-blue/5 p-3 rounded-xl">
                                <ShieldCheck className="h-10 w-10 text-brand-blue" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-brand-blue tracking-tight">Bienvenido</h2>
                        <p className="text-neutral-500">Ingresa tus credenciales para acceder al panel.</p>
                    </div>

                    {/* Role Selector */}
                    <div className="bg-neutral-100/50 p-1 rounded-xl grid grid-cols-2 gap-1 border border-neutral-200/50">
                        <button
                            type="button"
                            onClick={() => setRole("TENANT")}
                            className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${role === "TENANT" ? "bg-white text-brand-blue shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            <User className="w-4 h-4" />
                            Inquilino
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("LANDLORD")}
                            className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${role === "LANDLORD" ? "bg-white text-brand-blue shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            <Building2 className="w-4 h-4" />
                            Propietario
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-brand-blue font-medium ml-1">Correo Electrónico</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-brand-blue transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-11 h-12 bg-white border-neutral-200 focus:border-brand-blue/30 focus:ring-brand-blue/10 rounded-xl transition-all"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-brand-blue font-medium">Contraseña</Label>
                                <Link href="#" className="text-xs font-semibold text-brand-blue hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-brand-blue transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-11 pr-11 h-12 bg-white border-neutral-200 focus:border-brand-blue/30 focus:ring-brand-blue/10 rounded-xl transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-full px-4 flex items-center text-neutral-400 hover:text-brand-blue transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20 rounded-xl transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-neutral-500">
                        ¿Aún no tienes cuenta?{" "}
                        <Link href="/register" className="text-brand-blue font-bold hover:underline transition-colors">
                            Regístrate gratis
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 text-white/90 group">
            <div className="bg-brand-green/10 p-2 rounded-full group-hover:bg-brand-green/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-brand-green" />
            </div>
            <span className="font-medium tracking-wide">{text}</span>
        </div>
    );
}
