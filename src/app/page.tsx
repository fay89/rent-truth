import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, FileText, Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-brand-blue">
      {/* Navbar */}
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-center md:justify-between border-b border-neutral-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="relative h-24 w-72 md:h-12 md:w-48">
          <Image
            src="/logo-full.png"
            alt="RentTruth"
            fill
            className="object-contain object-center md:object-left"
            priority
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="#" className="hover:text-brand-blue">Inicio</Link>
          <Link href="#" className="hover:text-brand-blue">Cómo funciona</Link>
          <Link href="#" className="hover:text-brand-blue">Precios</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-brand-green">
            Iniciar sesión
          </Link>
          <Link href="/register">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md px-6">
              Crear cuenta
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 py-20 md:py-32 flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-12">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-blue leading-[1.1]">
              La verdad de cada <br />
              alquiler, sin letra pequeña
            </h1>
            <p className="text-xl text-neutral-500 max-w-xl mx-auto md:mx-0">
              Sistema de reputación verificada para inquilinos y propietarios basado en contratos reales. Transparencia que genera confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/login">
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-white w-full sm:w-auto text-lg px-8 h-12 rounded-full font-semibold shadow-lg shadow-brand-blue/20">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-brand-blue text-brand-blue hover:bg-blue-50 w-full sm:w-auto text-lg px-8 h-12 rounded-full border-2 font-semibold">
                  Crear perfil
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative justify-center flex">
            {/* Placeholder for Phone Mockup */}
            <div className="relative w-full max-w-[300px] h-[600px] bg-neutral-100 rounded-[3rem] border-8 border-neutral-900 shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-white h-full w-full p-4 overflow-hidden pt-12 flex flex-col">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <ShieldCheck className="h-6 w-6 text-brand-blue" />
                  <span className="font-bold text-brand-blue">RentTruth</span>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 shadow-sm mb-4 mx-2">
                  <h3 className="font-bold text-lg mb-2">Hola, Alex</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-brand-blue"><CheckCircle2 className="h-4 w-4 text-brand-green" /> Crea tu perfil</div>
                    <div className="flex items-center gap-2 text-sm text-brand-blue"><CheckCircle2 className="h-4 w-4 text-brand-green" /> Firma un contrato</div>
                    <div className="flex items-center gap-2 text-sm text-brand-blue"><CheckCircle2 className="h-4 w-4 text-brand-green" /> Recibe valoraciones</div>
                  </div>
                </div>
                <div className="mt-auto mb-8 px-4">
                  <Button className="w-full bg-brand-green text-white rounded-full font-semibold">Crear perfil</Button>
                </div>
              </div>
              {/* Phone Notch/Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-xl"></div>
            </div>
          </div>
        </section>

        {/* Features / Roles */}
        <section className="bg-neutral-50 py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-brand-blue">Para inquilinos</h3>
              <p className="text-neutral-500">Demuestra que eres buen pagador. Tu reputación viaja contigo.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-brand-blue">Para propietarios</h3>
              <p className="text-neutral-500">Reduce el riesgo de impago. Encuentra inquilinos verificados.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-brand-blue">Para inmobiliarias</h3>
              <p className="text-neutral-500">Filtra candidatos efectivamente con historiales reales.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-brand-blue text-center md:text-left">Cómo funciona</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-default">
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                  <User className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Crea tu perfil</h3>
                <p className="text-neutral-500">Regístrate en 1 minuto y verifica tu identidad.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-default">
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Firma un contrato</h3>
                <p className="text-neutral-500">El propietario inicia el contrato y tú lo aceptas.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-default">
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Recibe valoraciones</h3>
                <p className="text-neutral-500">Construye tu historial con reseñas verificadas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-neutral-400" />
            <span className="font-bold text-neutral-400">RentTruth</span>
          </div>
          <div className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} RentTruth. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-neutral-500 hover:text-brand-blue transition-colors">Política de privacidad</Link>
            <Link href="#" className="text-sm text-neutral-500 hover:text-brand-blue transition-colors">Términos del servicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
