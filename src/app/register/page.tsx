"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, User, Mail, Lock, Eye, EyeOff, Building2, UserCircle2 } from "lucide-react";
import { APP_VERSION } from "@/lib/version";

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<UserRole>("TENANT");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password && name) {
            setIsLoading(true);
            const fullName = `${name} ${surname}`.trim();
            try {
                await register(email, role, password, fullName);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column (Brand/Info) */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-brand-blue relative overflow-hidden text-white">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-green/20 via-transparent to-transparent opacity-40"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-90 transition-opacity w-fit group">
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                            <ShieldCheck className="h-8 w-8 text-brand-green" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">RentTruth</span>
                    </Link>

                    <h2 className="text-5xl font-extrabold mb-8 leading-[1.15] tracking-tight">
                        Tu reputación es tu mayor <span className="text-brand-green">activo.</span>
                    </h2>

                    <p className="text-lg text-blue-100/80 max-w-md mb-12 leading-relaxed">
                        Crea una cuenta gratuita y comienza a construir un historial de alquiler verificable que te abrirá puertas.
                    </p>

                    <div className="space-y-6">
                        <FeatureRow text="Totalmente gratuito para siempre" />
                        <FeatureRow text="Verificación biométrica segura" />
                        <FeatureRow text="Acceso a inquilinos y propietarios verificados" />
                    </div>
                </div>

                <div className="relative z-10 text-xs text-blue-200/50 flex justify-between items-end">
                    <span>&copy; {new Date().getFullYear()} RentTruth Security.</span>
                    <span>v{APP_VERSION}</span>
                </div>
            </div>

            {/* Right Column (Form) */}
            <div className="flex items-center justify-center p-6 md:p-12 bg-background">
                <div className="w-full max-w-[480px] space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-brand-blue/5 p-3 rounded-xl">
                                <ShieldCheck className="h-10 w-10 text-brand-blue" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-brand-blue tracking-tight">Crear cuenta</h2>
                        <p className="text-neutral-500">Únete a la comunidad de confianza.</p>
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-brand-blue font-medium ml-1">Nombre</Label>
                                <div className="relative group">
                                    <UserCircle2 className="absolute left-3.5 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-brand-blue transition-colors" />
                                    <Input
                                        id="name"
                                        placeholder="Juan"
                                        className="pl-11 h-12 bg-white border-neutral-200 focus:border-brand-blue/30 focus:ring-brand-blue/10 rounded-xl transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname" className="text-brand-blue font-medium ml-1">Apellidos</Label>
                                <Input
                                    id="surname"
                                    placeholder="Pérez"
                                    className="h-12 bg-white border-neutral-200 focus:border-brand-blue/30 focus:ring-brand-blue/10 rounded-xl transition-all"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-brand-blue font-medium ml-1">Email</Label>
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
                            <Label htmlFor="password" className="text-brand-blue font-medium ml-1">Contraseña</Label>
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
                            <p className="text-xs text-neutral-400 ml-1">Mínimo 8 caracteres</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base font-bold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20 rounded-xl mt-4 transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creando cuenta...</span>
                                </div>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-neutral-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-brand-blue font-bold hover:underline transition-colors">
                            Inicia sesión
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
