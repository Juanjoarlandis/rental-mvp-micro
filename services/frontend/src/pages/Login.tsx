// src/pages/Login.tsx
import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin } from '../features/auth/login';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash, FaApple } from 'react-icons/fa';
import { RiMailSendLine } from 'react-icons/ri';
import SocialButton from '../components/ui/SocialButton';
import Container from '../components/shared/Container';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function Login() {
  /* ---------------- estado ---------------- */
  const [user, setUser]   = useState('');
  const [pwd, setPwd]     = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateError, setAnimateError] = useState(false);
  const [magicOpen, setMagicOpen] = useState(false);      // modal enlace mágico
  const [magicEmail, setMagicEmail] = useState('');

  const { login: saveToken } = useAuth();
  const nav = useNavigate();

  /* ---------------- submit pwd ---------------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const token = await apiLogin(user.trim(), pwd);
      saveToken(token);
      nav('/dashboard');
      toast.success('¡Bienvenido de nuevo!');
      setError(null);
    } catch {
      toast.error('Usuario o contraseña incorrectos');
      setError('Credenciales inválidas');
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 300);
    }
  }

  /* ---------------- submit magic‑link ---------------- */
  async function handleMagic(e: FormEvent) {
    e.preventDefault();
    try {
      await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: magicEmail })
      });
      toast.success('Te hemos enviado un enlace de acceso');
      setMagicOpen(false);
    } catch {
      toast.error('No se pudo enviar el enlace');
    }
  }

  /* fade‑in */
  useEffect(() => { setTimeout(() =>
      document.querySelector('.form-container')?.classList.add('visible'), 100);
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <Container>
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl
                        fade-in form-container transition-opacity duration-500">
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h1>

          {/* --- login social --- */}
          <div className="space-y-4">
            <SocialButton provider="google" icon={FcGoogle}
                          label="Continuar con Google" />
            <SocialButton provider="github" icon={FaGithub}
                          label="Continuar con GitHub" />
            <SocialButton provider="apple"  icon={FaApple}
                          label="Continuar con Apple" />
          </div>

          <button
            type="button"
            onClick={() => setMagicOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm
                       font-medium text-brand hover:underline"
          >
            <RiMailSendLine className="h-4 w-4" /> Acceder con enlace mágico
          </button>

          <div className="relative my-6">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white
                             px-4 text-sm text-gray-500">
              o con email
            </span>
          </div>

          {/* --- formulario usuario / pwd --- */}
          <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
            <div className="relative">
              <label htmlFor="user"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Usuario o email
              </label>
              <input id="user" required
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand"
                     placeholder=" " value={user}
                     onChange={e => setUser(e.target.value)} />
            </div>

            <div className="relative">
              <label htmlFor="pwd"
                     className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Contraseña
              </label>
              <input id="pwd" type={showPwd ? 'text' : 'password'} required
                     className="form-input w-full rounded-lg border-gray-300
                                focus:border-brand focus:ring-brand pr-10"
                     placeholder=" " value={pwd}
                     onChange={e => setPwd(e.target.value)} />
              <button type="button" aria-pressed={showPwd}
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-500 hover:text-brand">
                {showPwd ? <FaEyeSlash className="h-5 w-5" />
                         : <FaEye      className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <p className={clsx(
                     'text-center text-sm text-red-600 error-shake',
                     animateError && 'animate-shake')}>
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center
                            sm:justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox"
                       className="rounded border-gray-300 text-brand
                                  focus:ring-brand" />
                Recordarme
              </label>
              <Link to="/forgot-password"
                    className="text-brand hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button className="btn w-full rounded-lg py-3 text-base font-semibold">
              Entrar
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Al continuar aceptas nuestros&nbsp;
            <Link to="/legal/privacidad" className="underline">
              Términos y Política de privacidad
            </Link>
            .
          </p>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?&nbsp;
            <Link to="/register"
                  className="text-brand font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </main>

      {/* ---------- Modal magic‑link ---------- */}
      {magicOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center
                        bg-black/50 px-4">
          <form onSubmit={handleMagic}
                className="w-full max-w-sm space-y-6 rounded-xl bg-white
                           p-8 shadow-xl">
            <h2 className="text-lg font-semibold">Enlace mágico</h2>
            <input type="email" required autoFocus
                   placeholder="Tu email"
                   className="form-input w-full"
                   value={magicEmail}
                   onChange={e => setMagicEmail(e.target.value)} />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setMagicOpen(false)}
                      className="btn--ghost px-4 py-2">Cancelar</button>
              <button className="btn px-4 py-2">Enviar enlace</button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}
