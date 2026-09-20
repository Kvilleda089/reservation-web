import LoginForm from "@/src/features/auth/components/LoginForm";
import { CalendarDays } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
          {/** Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/images/image-home.jpeg)",
            }}
          />

          {/** Overlay Celeste */}
          <div className="absolute inset-0 bg-cyan-950/70" />

          {/**Contenido */}
          <div className="relative z-10 text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <CalendarDays
                className="h-10 w-10 text-white"
                strokeWidth={1.8}
              />

              <h1 className="text-4xl font-bold">
                Reserva<span className="text-[#00D4C6]">Fácil</span>
              </h1>
            </div>

            <p className="mt-4 text-lg text-white/90">
              Tú espacio, en el momento perfecto.
            </p>

            <p className="mt-2 text-2xl font-semibold">
              Gestiona tus reservas de forma
              <br />
              <span className="text-[#00D4C6]">rápida y sencilla</span>
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-sm">
                Salones
              </span>
              <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-sm">
                Canchas
              </span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white">
          <LoginForm></LoginForm>
        </section>
      </div>
    </main>
  );
}
