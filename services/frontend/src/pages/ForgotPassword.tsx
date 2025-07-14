import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Container from "../components/shared/Container";
import { forgot } from "../features/auth/forgot";

export default function ForgotPassword() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await forgot(user.trim());
      toast.success("Token generado: revisa tu correo (demo: consola)");
      console.info("🔑 reset_token =", token);   // ← visible en consola dev
      nav(`/reset-password?token=${token}`);
    } catch (err: any) {
      setLoading(false);
      const msg =
        err?.response?.status === 404
          ? "Usuario no encontrado"
          : err?.response?.data?.detail ?? "Error inesperado";
      toast.error(msg);
    }
  }

  return (
    <Container>
      <main className="flex min-h-[70vh] items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-card"
        >
          <h1 className="text-center text-2xl font-bold">
            Restablecer contraseña
          </h1>

          <input
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="Nombre de usuario"
            className="form-input w-full"
            required
          />

          <button className="btn w-full" disabled={loading}>
            {loading ? "Enviando…" : "Generar enlace"}
          </button>
        </form>
      </main>
    </Container>
  );
}
