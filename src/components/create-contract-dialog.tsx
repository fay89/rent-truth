"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";

export function CreateContractDialog() {
    const { user } = useAuth();
    const { createContract } = useData();
    const [open, setOpen] = useState(false);

    const [tenantEmail, setTenantEmail] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && tenantEmail && propertyAddress) {
            createContract({
                landlordId: user.email,
                tenantEmail,
                propertyAddress,
                startDate,
                endDate,
            });
            setOpen(false);
            // Reset form
            setTenantEmail("");
            setPropertyAddress("");
            setStartDate("");
            setEndDate("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Crear Nuevo Contrato
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
                <DialogHeader>
                    <DialogTitle>Crear Contrato de Alquiler</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Introduce los detalles del contrato aquí. El inquilino deberá verificarlo.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tenant-email" className="text-right text-neutral-300">
                                Email Inquilino
                            </Label>
                            <Input
                                id="tenant-email"
                                type="email"
                                value={tenantEmail}
                                onChange={(e) => setTenantEmail(e.target.value)}
                                className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right text-neutral-300">
                                Dirección
                            </Label>
                            <Input
                                id="address"
                                value={propertyAddress}
                                onChange={(e) => setPropertyAddress(e.target.value)}
                                className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-date" className="text-right text-neutral-300">
                                Fecha Inicio
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end-date" className="text-right text-neutral-300">
                                Fecha Fin
                            </Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Crear Contrato
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
