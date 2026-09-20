"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PERMISSIONS } from "@/src/constants/permissions";
import { toast } from "sonner";
import { LockKeyhole, UserRound } from "lucide-react";
import { login } from "../services/auth.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { useAuth } from "../context/auth.context";
import { can } from "@/src/lib/auth/helper/permissions.helper";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //para manejo de errores variables
  const [error, setErrors] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      username: "",
      password: "",
    };

    if (!username) {
      newErrors.username = "El usuario es obligatorio";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);

    if (newErrors.username || newErrors.password) {
      return;
    }

    try {
      const response = await login({
        username,
        password,
      });

      const fullName = `${response.employee.firstName} ${response.employee.surname}`;
      toast.success(`Iniciso de sesión existoso. Bienvenido ${fullName}`);
      setAuth(response.accessToken, response.employee);

      if (can(response.employee.role, PERMISSIONS.RESERVATIONS_READ)) {
        router.replace("/dashboard");
        return;
      }

      if (can(response.employee.role, PERMISSIONS.AGENDA_READ)) {
        router.replace("/agenda");
        return;
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md px-6">
      <h2 className="text-3xl font-bold text-slate-800">Iniciar sesión</h2>

      <p className="mt-2 text-sm text-slate-500">
        Ingrese sus credenciales para continuar.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mt-8">
          <label htmlFor="username" className="block text-sm font-medium">
            Usuario
          </label>

          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 h-5 w-5 -traslate-y-1/2 text-salte-400" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 pl-12 pr-4 py-3 text-slate-800 outline-none transition focus:border-[#00D4C6] focus:ring-2 focus:ring-[#00D4C6]/20"
            />
            {error.username && (
              <p className=" mt-2 text-sm text-red-600">{error.username}</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -traslate-y-1/2 text-salte-400" />
            <input
              type="password"
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 pl-12 pr-4 py-3 text-slate-800 outline-none transition focus:border-[#00D4C6] focus:ring-2 focus:ring-[#00D4C6]/20"
            />
            {error.password && (
              <p className=" mt-2 text-sm text-red-600">{error.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-lg bg-[#00D4C6] px-4 py-3 font-semibold text-slate-900 transition hover:bg-[#00b8ab] focus:outline-none focus:ring-2 focus:ring-[#00D4C6]/40"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
