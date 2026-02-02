"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, User, Mail, Moon, Globe } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-blue">Ajustes</h1>
                <p className="text-neutral-500">Configura tus preferencias y notificaciones.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" /> Cuenta
                        </CardTitle>
                        <CardDescription>Preferencias generales de tu cuenta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lang">Idioma</Label>
                            <select id="lang" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>Español</option>
                                <option>English</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" /> Notificaciones
                        </CardTitle>
                        <CardDescription>Elige qué correos quieres recibir</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Nuevos contratos</Label>
                                <p className="text-sm text-neutral-500">Recibe un email cuando te envíen un contrato.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Nuevas reseñas</Label>
                                <p className="text-sm text-neutral-500">Avisa cuando alguien te deje una review.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Marketing</Label>
                                <p className="text-sm text-neutral-500">Novedades y promociones de RentTruth.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* DANGER ZONE */}
                <Card className="border-red-100 shadow-sm bg-red-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            Zona de Peligro
                        </CardTitle>
                        <CardDescription>Acciones destructivas para desarrolladores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold text-red-700">Eliminar todos los datos</Label>
                                <p className="text-sm text-red-600/80">Borra usuarios, contratos y reseñas. ¡No se puede deshacer!</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (confirm("¿Estás SEGURO? Se borrará TODO y volverás al login.")) {
                                        localStorage.clear();
                                        window.location.href = "/";
                                    }
                                }}
                            >
                                Resetear Todo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
