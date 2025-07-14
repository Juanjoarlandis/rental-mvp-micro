// src/pages/Login.tsx
import { FormEvent, useState, useEffect } from "react";  // +useEffect para anim
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login as apiLogin } from "../features/auth/login";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";  // +eye icons
import SocialButton from "../components/ui/SocialButton";
import Container from "../components/shared/Container";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function Login() {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);  // NEW: Toggle visibility
  const [error, setError] = useState<string | null>(null);
  const [animateError, setAnimateError] = useState(false);  // NEW: Shake anim

  const { login: saveToken } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = await apiLogin(user.trim(), pwd);
      saveToken(token);
      nav("/dashboard");
      toast.success("¡Bienvenido de nuevo!");
      setError(null);
    } catch {
      toast.error("Usuario o contraseña incorrectos");
      setError("Credenciales inválidas");
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 300);  // Reset anim
    }
  }

  useEffect(() => {  // Fade-in anim on mount
    const timer = setTimeout(() => document.querySelector('.form-container')?.classList.add('visible'), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <main className="flex min-h-screen items-center justify-center bg-gray-50">  {/* +bg for pro look */}
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl fade-in form-container transition-opacity duration-500">  {/* FIXED: +fade-in */}
          <h1 className="text-center text-3xl font-bold text-gray-900">Iniciar sesión</h1>  {/* +text-3xl */}

          {/* ---------- Login social ---------- */}
          <div className="space-y-4">
            <SocialButton provider="google" icon={FcGoogle} label="Continuar con Google" />  {/* Updated label */}
            <SocialButton provider="github" icon={FaGithub} label="Continuar con GitHub" />
          </div>

          <div className="relative my-6">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white px-4 text-sm text-gray-500">o con email</span>  {/* +text-sm */}
          </div>

          {/* ---------- Formulario ---------- */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="user" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Usuario</label>  {/* Floating label */}
              <input
                id="user"
                className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand"
                placeholder=" "
                value={user}
                onChange={e => setUser(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="pwd" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Contraseña</label>
              <input
                id="pwd"
                type={showPwd ? "text" : "password"}
                className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand pr-10"  
                placeholder=" "
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand"
              >
                {showPwd ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <p className={clsx("text-center text-sm text-red-600 error-shake", animateError && "animate-shake")}>{error}</p> 
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">  {/* FIXED: flex-col en mobile, gap-2 para spacing */}
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-brand focus:ring-brand" />
                Recordarme
              </label>
              <Link to="/forgot-password" className="text-brand hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button className="btn w-full rounded-lg py-3 text-base font-semibold">  {/* +py-3, text-base */}
              Entrar
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta? <Link to="/register" className="text-brand font-medium hover:underline">Regístrate</Link>
          </p>
        </div>
      </main>
    </Container>
  );
}