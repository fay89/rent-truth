"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User as UserIcon, CheckCircle2, XCircle, Shield, Mail, Phone, Loader2 } from "lucide-react";
import { UserRole } from "@/contexts/auth-context";

interface Profile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    identity_verified: boolean;
    phone_verified: boolean;
    email_verified: boolean;
    created_at?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Fetch all profiles
                // Needs RLS policy allowing Admin to read all profiles
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching users:", error);
                    // alert("Error cargando usuarios: " + error.message);
                } else {
                    setUsers(data as any[] || []);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Usuarios Registrados</h1>
                <p className="text-neutral-500 mt-2">Gestión y visualización de la base de usuarios de RentTruth.</p>
            </div>

            {/* Stats Snippet */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-brand-blue">{users.length}</span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Total</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-brand-green">
                            {users.filter(u => u.role === 'LANDLORD').length}
                        </span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Propietarios</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-purple-600">
                            {users.filter(u => u.role === 'TENANT').length}
                        </span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Inquilinos</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-orange-500">
                            {users.filter(u => u.identity_verified).length}
                        </span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Verificados</span>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    className="pl-10 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed text-neutral-400">
                    <UserIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No se encontraron usuarios.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Usuario</th>
                                    <th className="px-6 py-4 font-medium">Rol</th>
                                    <th className="px-6 py-4 font-medium">Identidad</th>
                                    <th className="px-6 py-4 font-medium">Contacto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold shrink-0">
                                                    {(user.name || user.email || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-neutral-900 truncate max-w-[180px]">{user.name || "Sin nombre"}</p>
                                                    <p className="text-xs text-neutral-400 truncate max-w-[180px]">{user.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className={
                                                user.role === 'ADMIN' ? 'bg-red-50 text-red-700' :
                                                    user.role === 'LANDLORD' ? 'bg-green-50 text-green-700' :
                                                        'bg-purple-50 text-purple-700'
                                            }>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.identity_verified ? (
                                                    <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                                                        <Shield className="h-3 w-3" /> Verificado
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-neutral-400 text-xs px-2 py-1 bg-neutral-100 rounded-full">
                                                        Pendiente
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate max-w-[200px]">{user.email}</span>
                                                    {user.email_verified && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                                </div>
                                                {/* Phone if available */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
