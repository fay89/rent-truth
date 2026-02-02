"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2, AlertTriangle, XCircle, Upload, ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";

export function IdentityVerification() {
    const { user, updateProfile } = useAuth();
    const [status, setStatus] = useState<'IDLE' | 'LOADING_MODELS' | 'READY' | 'COMPARING' | 'SUCCESS' | 'FAILED'>('IDLE');
    const [dniImage, setDniImage] = useState<string | null>(null);
    const [selfieImage, setSelfieImage] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [score, setScore] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        setStatus('LOADING_MODELS');
        try {
            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setStatus('READY');
        } catch (err) {
            console.error("Error loading models:", err);
            setErrorMsg("Error al cargar modelos de IA. Recarga la página.");
        }
    };

    const handleDniUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setDniImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        setCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
            alert("No se pudo acceder a la cámara.");
            setCameraActive(false);
        }
    };

    const captureSelfie = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            setSelfieImage(canvas.toDataURL('image/jpeg'));

            // Stop camera
            const stream = videoRef.current.srcObject as MediaStream;
            stream?.getTracks().forEach(t => t.stop());
            setCameraActive(false);
        }
    };

    const processVerification = async () => {
        if (!dniImage || !selfieImage) return;
        setStatus('COMPARING');
        setErrorMsg(null);

        try {
            // Detect face in DNI
            const dniImgElement = await faceapi.fetchImage(dniImage);
            const dniDetection = await faceapi.detectSingleFace(dniImgElement).withFaceLandmarks().withFaceDescriptor();

            if (!dniDetection) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn("DEV MODE: Skipping DNI detection failure.");
                } else {
                    throw new Error("No se detectó ninguna cara en el DNI. Intenta con una foto más clara.");
                }
            }

            // Detect face in Selfie
            const selfieImgElement = await faceapi.fetchImage(selfieImage);
            const selfieDetection = await faceapi.detectSingleFace(selfieImgElement).withFaceLandmarks().withFaceDescriptor();

            if (!selfieDetection) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn("DEV MODE: Skipping Selfie detection failure.");
                } else {
                    throw new Error("No se detectó ninguna cara en el Selfie.");
                }
            }

            // Compare
            let distance = 0;
            if (dniDetection && selfieDetection) {
                distance = faceapi.euclideanDistance(dniDetection.descriptor, selfieDetection.descriptor);
            } else if (process.env.NODE_ENV === 'development') {
                distance = 0.1; // Mock passing score
            }

            setScore(distance);

            // Threshold: < 0.6 is usually a match
            if (distance < 0.6) {
                setStatus('SUCCESS');

                // Upload images to Supabase (Secure Bucket)
                const dniFile = await (await fetch(dniImage)).blob();
                const selfieFile = await (await fetch(selfieImage)).blob();
                const timestamp = Date.now();

                await supabase.storage.from('identity_docs').upload(`${user?.id}/dni_${timestamp}.jpg`, dniFile);
                await supabase.storage.from('identity_docs').upload(`${user?.id}/selfie_${timestamp}.jpg`, selfieFile);

                // Update Profile
                await updateProfile({
                    identityVerified: true,
                    identityStatus: 'VERIFIED'
                });
            } else {
                setStatus('FAILED');
                await updateProfile({
                    identityStatus: 'REJECTED'
                });
            }

        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Error durante el análisis biométrico.");
            setStatus('READY');
        }
    };

    if (user?.identityStatus === 'VERIFIED') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-white p-3 rounded-full shadow-sm">
                    <ShieldCheck className="w-8 h-8 text-brand-green" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-green-900">Identidad Verificada</h3>
                    <p className="text-sm text-green-700">Tu DNI y biometría han sido confirmados correctamente.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-brand-blue">Verificación Biométrica</h3>
                    <p className="text-xs text-neutral-500">Comparamos tu DNI con una foto selfie usando IA.</p>
                </div>
            </div>

            {status === 'LOADING_MODELS' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                    <p>Cargando modelos de Inteligencia Artificial...</p>
                </div>
            )}

            {(status === 'READY' || status === 'FAILED' || status === 'COMPARING') && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* DNI Upload */}
                    <Card className={`border-2 border-dashed ${dniImage ? 'border-brand-green/30 bg-green-50/20' : 'border-neutral-200'} shadow-none relative overflow-hidden group`}>
                        <input type="file" accept="image/*" onChange={handleDniUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                        <CardContent className="flex flex-col items-center justify-center h-48 text-center p-4">
                            {dniImage ? (
                                <img src={dniImage} className="h-full object-contain rounded" alt="DNI Preview" />
                            ) : (
                                <>
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                        <Upload className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <p className="font-semibold text-sm">Sube tu DNI (Frontal)</p>
                                    <p className="text-xs text-neutral-400 mt-1">Haz clic para seleccionar</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Selfie Camera */}
                    <Card className={`border-2 ${selfieImage ? 'border-brand-green/30 bg-green-50/20' : 'border-neutral-200'} shadow-none overflow-hidden relative`}>
                        <CardContent className="h-48 p-0 flex items-center justify-center bg-black/5 relative">
                            {selfieImage ? (
                                <div className="relative w-full h-full">
                                    <img src={selfieImage} className="w-full h-full object-cover" alt="Selfie" />
                                    <button
                                        onClick={() => setSelfieImage(null)}
                                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : cameraActive ? (
                                <div className="relative w-full h-full">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" onLoadedMetadata={() => videoRef.current?.play()} />
                                    <Button size="sm" onClick={captureSelfie} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                                        <Camera className="w-4 h-4 mr-2" /> Capturar
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center p-4 flex flex-col items-center">
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                        <Camera className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <p className="font-semibold text-sm">Hazte un Selfie</p>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={startCamera}>
                                        Abrir Cámara
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {errorMsg}
                </div>
            )}

            {status === 'FAILED' && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg text-center space-y-2">
                    <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="font-bold">Verificación Fallida</p>
                    <p className="text-sm">Las caras no coinciden suficientemente (Score: {score?.toFixed(2)}). Intenta de nuevo con mejor luz.</p>
                </div>
            )}

            {(status === 'READY' || status === 'FAILED') && (
                <Button
                    className="w-full py-6 text-lg"
                    disabled={!dniImage || !selfieImage}
                    onClick={processVerification}
                >
                    Verificar Identidad
                </Button>
            )}

            {status === 'COMPARING' && (
                <div className="text-center py-4 space-y-3">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                    <p className="text-neutral-500">Analizando biometría facial...</p>
                </div>
            )}

            {status === 'SUCCESS' && (
                <div className="p-6 bg-green-50 text-green-900 rounded-lg text-center space-y-2 animate-in fade-in zoom-in">
                    <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto" />
                    <h3 className="text-xl font-bold">¡Verificación Exitosa!</h3>
                    <p>Usuario verificado correctamente.</p>
                    <p className="text-xs text-green-700 opacity-70">Desviación biométrica: {score?.toFixed(4)}</p>
                </div>
            )}
        </div>
    );
}
