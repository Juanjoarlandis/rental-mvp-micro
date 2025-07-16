// src/pages/Register.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import zxcvbn from 'zxcvbn';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaGithub, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { register as apiRegister } from '../features/auth/register';
import { login as apiLogin }    from '../features/auth/login';
import { useAuth } from '../hooks/useAuth';

import Container from '../components/shared/Container';
import SocialButton from '../components/ui/SocialButton';

const pwdReq = 'Mín. 8 caracteres, 1 número, 1 mayúscula';
const schema = z.object({
  username : z.string().min(3, 'Mín. 3 caracteres'),
  email    : z.string().email('Email inválido'),
  password : z.string()
               .min(8, pwdReq)
               .regex(/\d/,  pwdReq)
               .regex(/[A-Z]/, pwdReq),
  confirm  : z.string(),
  terms    : z.literal(true, { errorMap: () => ({ message: 'Acepta los términos' }) })
}).refine(d => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden', path: ['confirm']
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { login: saveToken } = useAuth();
  const nav = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
        useForm<FormData>({ resolver: zodResolver(schema) });

  const pwd = watch('password', '');
  const [showPwd, setShowPwd] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const strength = zxcvbn(pwd);
  const colors = ['bg-red-500','bg-orange-400','bg-yellow-400','bg-lime-500','bg-green-600'];

  /* submit */
  const onSubmit = async (data: FormData) => {
    try {
      await apiRegister(data.username, data.email, data.password);
      const token = await apiLogin(data.username, data.password);
      saveToken(token);
      toast.success('Cuenta creada, ¡bienvenido!');
      nav('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'No se pudo crear la cuenta.');
    }
  };

  /* fade‑in */
  useEffect(() => {
    setTimeout(() => document.querySelector('.form-container')?.classList.add('visible'), 100);
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <Container>
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl
                        fade-in form-container transition-opacity duration-500">
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Crear cuenta
          </h1>

          {/* --- registro social --- */}
          <div className="space-y-4">
            <SocialButton provider="google" icon={FcGoogle}
                          label="Continuar con Google" />
            <SocialButton provider="github" icon={FaGithub}
                          label="Continuar con GitHub" />
            <SocialButton provider="apple"  icon={FaApple}
                          label="Continuar con Apple" />
          </div>

          <div className="relative my-6">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white
                             px-4 text-sm text-gray-500">
              o con email
            </span>
          </div>

          {/* --- formulario email --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-live="polite">
            {/* usuario */}
            <div className="relative">
              <label htmlFor="username"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Nombre de usuario
              </label>
              <input id="username" {...register('username')} placeholder=" "
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand" />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            {/* email */}
            <div className="relative">
              <label htmlFor="email"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Email
              </label>
              <input id="email" type="email" {...register('email')} placeholder=" "
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* contraseña */}
            <div className="relative">
              <label htmlFor="password"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Contraseña
              </label>
              <input id="password" type={showPwd ? 'text' : 'password'}
                     {...register('password')} placeholder=" "
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand pr-10" />
              <button type="button" aria-pressed={showPwd}
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-500 hover:text-brand">
                {showPwd ? <FaEyeSlash className="h-5 w-5" />
                         : <FaEye      className="h-5 w-5" />}
              </button>
            </div>

            {/* fuerza */}
            {pwd && (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                  <div style={{ width: `${(strength.score+1)*20}%` }}
                       className={clsx('h-full transition-all', colors[strength.score])} />
                </div>
                <p className="text-xs text-gray-500">{pwdReq}</p>
              </div>
            )}
            {errors.password && <p className="form-error">{errors.password.message}</p>}

            {/* confirm */}
            <div className="relative">
              <label htmlFor="confirm"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Repite contraseña
              </label>
              <input id="confirm" type={showPwd ? 'text' : 'password'}
                     {...register('confirm')} placeholder=" "
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand" />
              {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
            </div>

            {/* términos */}
            <label className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" {...register('terms')}
                     className="rounded border-gray-300 text-brand focus:ring-brand" />
              Acepto los&nbsp;
              <button type="button" onClick={() => setShowTerms(true)}
                      className="text-brand hover:underline">
                Términos y Política de privacidad
              </button>
            </label>
            {errors.terms && <p className="form-error">{errors.terms.message}</p>}

            <button disabled={isSubmitting}
                    className="btn w-full rounded-lg py-3 text-base font-semibold">
              {isSubmitting ? 'Creando…' : 'Crear cuenta'}
            </button>
          </form>

          {/* legal notice */}
          <p className="text-center text-xs text-gray-500">
            Al registrarte aceptas nuestras&nbsp;
            <Link to="/legal" className="underline">Condiciones de uso</Link>.
          </p>
        </div>
      </main>

      {/* --- modal términos --- */}
      {showTerms && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
          <div className="max-w-lg space-y-4 rounded-xl bg-white p-8 shadow-2xl">
            <h2 className="text-lg font-semibold">Términos &amp; Privacidad</h2>
            <p className="h-60 overflow-y-auto text-sm leading-relaxed">
              {/* aquí iría tu texto legal… */}
            </p>
            <div className="flex justify-end">
              <button className="btn" onClick={() => setShowTerms(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
