// src/pages/ResetPassword.tsx
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";  // +useState for toggle
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Container from "../components/shared/Container";
import { reset } from "../features/auth/reset";
import clsx from "clsx";
import zxcvbn from "zxcvbn";  // +strength

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string()
  })
  .refine(d => d.password === d.confirm, {
    message: "No coincide",
    path: ["confirm"]
  });

type Form = z.infer<typeof schema>;

export default function ResetPassword() {
  const [params] = useSearchParams();
  const tokenQP = params.get("token") ?? "";
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Form>({
    resolver: zodResolver(schema)
  });

  const pwd = watch("password", "");
  const [showPwd, setShowPwd] = useState(false);  // NEW: Toggle

  const onSubmit = async (data: Form) => {
    try {
      await reset(tokenQP, data.password);
      toast.success("Contraseña actualizada");
      nav("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Token inválido o expirado.");
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl fade-in form-container transition-opacity duration-500"  // FIXED: +fade-in
        >
          <h1 className="text-center text-3xl font-bold text-gray-900">Nueva contraseña</h1>

          <div className="relative">
            <label htmlFor="password" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Contraseña</label>
            <input id="password" type={showPwd ? "text" : "password"} {...register("password")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand pr-10" placeholder=" " />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand">
              {showPwd ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>

          {pwd && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                <div style={{ width: `${(strength.score + 1) * 20}%` }} className={clsx("h-full transition-all", strengthColors[strength.score])} />
              </div>
              <p className="text-xs text-gray-500">{strength.feedback.suggestions.join(' ')}</p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.password.message}</p>}

          <div className="relative">
            <label htmlFor="confirm" className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">Repite contraseña</label>
            <input id="confirm" type={showPwd ? "text" : "password"} {...register("confirm")} className="form-input w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand pr-10" placeholder=" " />
          </div>
          {errors.confirm && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠️</span>{errors.confirm.message}</p>}

          <button className="btn w-full rounded-lg py-3 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Cambiar contraseña"}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Recordaste tu clave? <Link to="/login" className="text-brand font-medium hover:underline">Iniciar sesión</Link>
          </p>
        </form>
      </main>
    </Container>
  );
}