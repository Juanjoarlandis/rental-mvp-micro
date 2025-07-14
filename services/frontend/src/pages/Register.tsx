// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useEffect, useState } from "react";  // +useState for terms modal
import { FaEye, FaEyeSlash } from "react-icons/fa";  // +eye

import { register as apiRegister } from "../features/auth/register";
import { login as apiLogin } from "../features/auth/login";
import { useAuth } from "../hooks/useAuth";

import Container from "../components/shared/Container";
import SocialButton from "../components/ui/SocialButton";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const schema = z
  .object({
    username: z.string().min(3, "Mín. 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mín. 8 caracteres"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Acepta los términos" }) }),
  })
  .refine(data => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { login: saveToken } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const pwd = watch("password", "");
  const [showPwd, setShowPwd] = useState(false);  // NEW: Toggle
  const [showTermsModal, setShowTermsModal] = useState(false);  // NEW: Terms modal

  const onSubmit = async (data: FormData) => {
    try {
      await apiRegister(data.username, data.email, data.password);
      const token = await apiLogin(data.username, data.password);
      saveToken(token);
      toast.success("Cuenta creada, ¡bienvenido!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "No se pudo crear la cuenta.");
    }
  };

  useEffect(() => {  // Fade-in
    const timer = setTimeout(() => document.querySelector('.form-container')?.classList.add('visible'), 100);
    return () => clearTimeout(timer);
  }, []);

  const strength = zxcvbn(pwd);
  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-600'];

  return (
    <Container>
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl fade-in form-container transition-opacity duration-500">  {/* FIXED: +fade-in */}
          <h1 className="text-center text-3xl font-bold text-gray-900">Crear cuenta</h1>

          <div className="space-y-4">
            <SocialButton provider="google" icon={FcGoogle} label="Continuar con Google" />
            <SocialButton provider="github" icon={FaGithub} label="Continuar con GitHub" />
          </div>

          <div className="relative my-6">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white px-4 text-sm text-gray-500">o con email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <label htmlFor="username" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Nombre de usuario</label>
              <input id="username" {...register("username")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand" placeholder=" " />
              {errors.username && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.username.message}</p>}  {/* +icon */}
            </div>

            <div className="relative">
              <label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Email</label>
              <input id="email" type="email" {...register("email")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand" placeholder=" " />
              {errors.email && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Contraseña</label>
              <input id="password" type={showPwd ? "text" : "password"} {...register("password")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand pr-10" placeholder=" " />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand">
                {showPwd ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>

            {/* Strength meter with tips */}
            {pwd && (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                  <div style={{ width: `${(strength.score + 1) * 20}%` }} className={clsx("h-full transition-all", strengthColors[strength.score])} />
                </div>
                <p className="text-xs text-gray-500">{strength.feedback.suggestions.join(' ')}</p>  {/* +tips from zxcvbn */}
              </div>
            )}
            {errors.password && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.password.message}</p>}

            <div className="relative">
              <label htmlFor="confirm" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Repite contraseña</label>
              <input id="confirm" type={showPwd ? "text" : "password"} {...register("confirm")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand pr-10" placeholder=" " />
            </div>
            {errors.confirm && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.confirm.message}</p>}

            <label className="flex flex-wrap items-center gap-2 text-sm text-gray-600">  {/* FIXED: +flex-wrap items-center, gap-2 para better spacing */}
              <input type="checkbox" {...register("terms")} className="rounded border-gray-300 text-brand focus:ring-brand" />
              Acepto los <button type="button" onClick={() => setShowTermsModal(true)} className="text-brand hover:underline">Términos y Política de privacidad</button>
            </label>
            {errors.terms && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.terms.message}</p>}

            <button className="btn w-full rounded-lg py-3 text-base font-semibold" disabled={isSubmitting}>  {/* +styles */}
              {isSubmitting ? "Creando…" : "Crear cuenta"}
            </button>
          </form>

          {/* Terms Modal (simple dialog) */}
          {showTermsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold">Términos y Privacidad</h3>
                <p className="mt-2 text-sm text-gray-600">Aquí irían los términos reales. Para demo, cierra.</p>
                <button onClick={() => setShowTermsModal(false)} className="mt-4 btn w-full">Cerrar</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}