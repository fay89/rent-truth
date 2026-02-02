"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<UserRole>("TENANT");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we would send name and password to the backend here
        if (email && password) {
            const fullName = `${name} ${surname}`.trim();
            register(email, role, password, fullName);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-brand-light-gray font-sans">
            {/* Left Column (Brand/Info) */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-subtle-gradient text-white relative overflow-hidden bg-brand-blue">
                <div className="z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-90 w-fit">
                        <ShieldCheck className="h-8 w-8 text-white" />
                        <span className="text-2xl font-bold">RentTruth</span>
                    </Link>
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
                        Empieza a construir tu reputación hoy.
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Totalmente gratuito</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Verificación segura</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-blue-100">
                            <CheckCircle2 className="h-6 w-6 text-brand-green" />
                            <span>Acceso a mejores alquileres</span>
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
                        <h2 className="text-3xl font-bold text-brand-blue mb-2">Crear nueva cuenta</h2>
                        <p className="text-neutral-500">Únete a la comunidad de alquileres transparentes.</p>
                    </div>

                    <div className="bg-neutral-100 p-1.5 rounded-xl grid grid-cols-2 mb-6 gap-1">
                        <button
                            type="button"
                            onClick={() => setRole("TENANT")}
                            className={`py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${role === "TENANT" ? "bg-white text-brand-blue shadow-sm" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            Soy Inquilino
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("LANDLORD")}
                            className={`py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${role === "LANDLORD" ? "bg-white text-brand-blue shadow-sm" : "text-neutral-500 hover:text-brand-blue hover:bg-neutral-200/50"}`}
                        >
                            Soy Propietario
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name" className="text-brand-blue font-medium ml-1">Nombre</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Juan"
                                    className="bg-white border-neutral-200 focus-visible:ring-brand-green h-11 rounded-lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name" className="text-brand-blue font-medium ml-1">Apellidos</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Pérez"
                                    className="bg-white border-neutral-200 focus-visible:ring-brand-green h-11 rounded-lg"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-brand-blue font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-white border-neutral-200 focus-visible:ring-brand-green h-11 rounded-lg"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-brand-blue font-medium ml-1">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="bg-white border-neutral-200 focus-visible:ring-brand-green h-11 rounded-lg pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-brand-blue bg-transparent border-none"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            <p className="text-xs text-neutral-400 ml-1">Mínimo 8 caracteres</p>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-bold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20 rounded-lg mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Crear Cuenta
                        </Button>
                    </form>

                    <div className="text-center text-sm text-neutral-500 mt-6">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-brand-blue font-bold hover:underline transition-colors ml-1">Inicia sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
